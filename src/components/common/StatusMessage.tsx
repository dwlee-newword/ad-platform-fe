import { Loader2 } from 'lucide-react';
import { COMMON } from '@/constants/text';

interface StatusMessageProps {
  variant: 'loading' | 'error' | 'empty';
  message?: string;
}

const variantStyles: Record<StatusMessageProps['variant'], string> = {
  loading: 'py-16 flex items-center justify-center gap-2 text-gray-500',
  error: 'py-16 text-center text-error',
  empty: 'py-10 text-center text-sm text-gray-400',
};

const defaultMessages: Partial<Record<StatusMessageProps['variant'], string>> = {
  loading: COMMON.loading,
  error: COMMON.fetchError,
};

export default function StatusMessage({ variant, message }: StatusMessageProps) {
  if (variant === 'loading') {
    return (
      <div className={variantStyles[variant]}>
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">{message ?? defaultMessages[variant]}</span>
      </div>
    );
  }
  return <div className={variantStyles[variant]}>{message ?? defaultMessages[variant]}</div>;
}
