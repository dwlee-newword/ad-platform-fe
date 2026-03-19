'use client';

import { COMMON } from '@/constants/text';
import StatusMessage from '@/components/common/StatusMessage';

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <StatusMessage variant="error" message={COMMON.systemError} />
      <button
        type="button"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        onClick={reset}
      >
        {COMMON.retry}
      </button>
    </div>
  );
}
