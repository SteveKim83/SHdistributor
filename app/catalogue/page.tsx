import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { PaginationControls } from "@/components/ui/PaginationControls";
import { Suspense } from 'react'
import { ProductSkeleton } from '../../components/ProductSkeleton'
import { FilterBar } from '../../components/FilterBar'
import { unstable_cache } from 'next/cache';
import type { Product, SearchParams } from '../types/catalogue';

const itemsPerPage = 12; // or whatever number you prefer

async function getProductData(): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/read`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product data:', error);
    return [];
  }
}

function paginateProducts(products: Product[], page: number, itemsPerPage: number): Product[] {
  const startIndex = (page - 1) * itemsPerPage;
  return products.slice(startIndex, startIndex + itemsPerPage);
}

// Cache the getSheetData function
const getProductDataCached = unstable_cache(
  async () => {
    const data = await getProductData();
    return data;
  },
  ['product-data'],
  {
    revalidate: 3600,
    tags: ['products']
  }
);

// Add filtering function
function filterProducts(
  products: Product[],
  filters: {
    category?: string;
    status?: string;
    search?: string;
  }
): Product[] {
  return products.filter(product => {
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesStatus = !filters.status || product.status === filters.status;
    const matchesSearch = !filters.search || 
      product.name.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });
}

async function getParamAsString(param: string | string[] | undefined): Promise<string | undefined> {
  if (Array.isArray(param)) {
    return param[0];  // Use the first item in the array
  }
  return param;  // Return the single string value
}

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: SearchParams | Promise<SearchParams>
}) {
 
   
  // Await searchParams first
  const resolvedParams = await searchParams;
  
  // Keep the current page when filtering, unless it's explicitly changed
  const currentPage = Number(await getParamAsString(resolvedParams.page)) || 1;
  const categoryFilter = await getParamAsString(resolvedParams.category);
  const statusFilter = await getParamAsString(resolvedParams.status);
  const searchFilter = await getParamAsString(resolvedParams.search);

  // Prefetch and cache the data
  const allProductsPromise = getProductDataCached();
  
  // Wait for data
  const allProducts = await allProductsPromise;
  const filteredProducts = filterProducts(allProducts, {
    category: categoryFilter,
    status: statusFilter,
    search: searchFilter,
  });
  const paginatedProducts = paginateProducts(filteredProducts, currentPage, itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Catalogue</h1>
      
      <FilterBar 
        categories={[...new Set(allProducts.map(p => p.category))]}
        currentFilters={{ 
          category: categoryFilter, 
          status: statusFilter, 
          search: searchFilter,
          page: currentPage.toString()
        }}
      />

      <div className="mb-4">
        <PaginationControls 
          currentPage={currentPage}
          totalPages={Math.ceil(filteredProducts.length / itemsPerPage)} 
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <Suspense fallback={[...Array(itemsPerPage)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}>
          {paginatedProducts.map((product) => (
            <Card key={product.barcode} className="w-full">
              <CardHeader className="space-y-2 p-3">
                {product.imageId && (
                  <div className="relative w-full aspect-square mb-2">
                    <Image 
                      src={`https://drive.google.com/thumbnail?id=${product.imageId}&sz=w400`}
                      alt={product.name}
                      fill
                      className="object-cover rounded-md"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      loading="lazy"
                      quality={75}
                    />
                  </div>
                )}
                <CardTitle className="text-sm line-clamp-2">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-1">
                  <p className="text-xs text-gray-600 line-clamp-1">Category: {product.category} / {product.subCategory}</p>
                  <p className="text-sm font-bold text-blue-600">
                      ${product.ctnCost.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">Size: {product.size}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                    product.status === 'In stock' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </Suspense>
      </div>
    </div>
  );
}
