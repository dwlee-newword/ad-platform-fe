'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { COMMON } from '@/constants/text';
import StatusMessage from './common/StatusMessage';
import Pagination from './common/Pagination';

interface Product {
  id: number;
  name: string;
  description: string;
}

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalCount: number;
  page: number;
  size: number;
}

export default function AdContractsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    api
      .get<PageResponse<Product>>('/api/products', {
        params: { page: currentPage },
      })
      .then((res) => {
        setProducts(res.data.content);
        setTotalPages(Math.max(res.data.totalPages, 1));
      })
      .catch(() => setError(COMMON.fetchError))
      .finally(() => setLoading(false));
  }, [currentPage]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-4 gap-4">
        {loading && (
          <div className="col-span-4">
            <StatusMessage variant="loading" />
          </div>
        )}
        {error && (
          <div className="col-span-4">
            <StatusMessage variant="error" message={error} />
          </div>
        )}
        {!loading &&
          !error &&
          products.map((product) => (
            <Link
              key={product.id}
              href={`/contracts/${product.id}`}
              className="flex min-h-[20vh] flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-gray-400"
            >
              <div className="text-sm font-semibold text-gray-900">{product.name}</div>
              <div className="text-xs text-gray-500">{product.description}</div>
            </Link>
          ))}
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
