'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useCallback, useState, useEffect } from 'react';


interface FilterBarProps {
  categories: string[];
  currentFilters: {
    category?: string;
    status?: string;
    search?: string;
    page?: string;
  };
}

export function FilterBar({ categories, currentFilters }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Cache the sorted categories
  const sortedCategories = useMemo(() => {
    return [...categories].sort();
  }, [categories]);

  // Add local state for search input
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || '');

  const handleFilterChange = useCallback((type: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(type, value);
    } else {
      params.delete(type);
    }
    
    // Only reset page to 1 if we're changing filters other than the page
    // AND only if we're actually changing a filter value
    if (type !== 'page' && value !== currentFilters[type as keyof typeof currentFilters]) {
      params.set('page', '1');
    }
    
    router.push(`/catalogue?${params.toString()}`);
  }, [searchParams, router, currentFilters]);

  // Debounced search effect with stable reference
  useEffect(() => {
    const currentSearch = currentFilters.search || '';
    if (searchTerm === currentSearch) return;

    const timer = setTimeout(() => {
      handleFilterChange('search', searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, currentFilters.search, handleFilterChange]);

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search products..."
          className="px-3 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="px-3 py-2 border rounded-md"
          value={currentFilters.category || ''}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {sortedCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          className="px-3 py-2 border rounded-md"
          value={currentFilters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">All Status</option>
          <option value="In stock">In Stock</option>
          <option value="Out of stock">Out of Stock</option>
        </select>
      </div>
    </div>
  );
}
