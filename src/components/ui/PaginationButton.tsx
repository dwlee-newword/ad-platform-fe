import { ButtonHTMLAttributes } from 'react';

interface PaginationButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export default function PaginationButton({
  active = false,
  className,
  ...props
}: PaginationButtonProps) {
  return (
    <button
      className={`rounded border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? 'border-primary-border bg-primary-subtle text-primary font-semibold'
          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
      } ${className ?? ''}`}
      {...props}
    />
  );
}
