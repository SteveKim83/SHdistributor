// New types file
export interface Product {
  barcode: string;
  category: string;
  subCategory: string;
  productType: string;
  supplierId: string;
  name: string;
  imageId?: string;
  size: string;
  ctnQty: string;
  ctnCost: number;
  rrp: number;
  gst: string;
  gstRate: string;
  discountRate: string;
  status: string;
}

export interface FilterOptions {
  category?: string;
  status?: string;
  search?: string;
}

export interface SearchParams {
  page?: string | string[];
  category?: string | string[];
  status?: string | string[];
  search?: string | string[];
} 