'use client';

import PaginationButton from '../ui/PaginationButton';
import { PAGINATION } from '@/constants/text';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-1">
      <PaginationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        {PAGINATION.prev}
      </PaginationButton>

      {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
        <PaginationButton
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page + 1}
        </PaginationButton>
      ))}

      <PaginationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        {PAGINATION.next}
      </PaginationButton>
    </div>
  );
}
