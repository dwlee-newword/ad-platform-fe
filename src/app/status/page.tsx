import PageLayout from '@/components/PageLayout';
import AdStatusContent from '@/components/AdStatusContent';
import { PAGES } from '@/constants/text';
import api from '@/lib/api';
import { format, addDays } from 'date-fns';

type SearchParams = {
  companyId?: string;
  companyName?: string;
  statuses?: string;
  startDate?: string;
  endDate?: string;
  page?: string;
};

type PageResponse<T> = {
  content: T[];
  totalCount: number;
  totalPages: number;
  page: number;
  size: number;
};

type ContractRow = {
  id: number;
  contractNumber: string;
  contractDate: string;
  companyName: string;
  productName: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: string;
};

const INDIVIDUAL_STATUS_VALUES = ['PENDING', 'IN_PROGRESS', 'CANCELLED', 'COMPLETED'];

function getDefaultDates() {
  const today = new Date();
  return {
    startDate: format(today, 'yyyy-MM-dd'),
    endDate: format(addDays(today, 28), 'yyyy-MM-dd'),
  };
}

export default async function AdStatusPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const defaults = getDefaultDates();
  const startDate = searchParams.startDate ?? defaults.startDate;
  const endDate = searchParams.endDate ?? defaults.endDate;

  const statuses = searchParams.statuses
    ? searchParams.statuses.split(',').filter(Boolean)
    : [...INDIVIDUAL_STATUS_VALUES];

  const params: Record<string, unknown> = {
    page: Number(searchParams.page ?? 0),
    statuses,
    startDate,
    endDate,
  };
  if (searchParams.companyId) params.companyId = searchParams.companyId;

  let contracts: ContractRow[] = [];
  let totalPages = 0;
  let fetchError = false;

  try {
    const res = await api.get<PageResponse<ContractRow>>('/api/contracts', { params });
    contracts = res.data.content;
    totalPages = res.data.totalPages;
  } catch {
    fetchError = true;
  }

  return (
    <PageLayout title={PAGES.status.title} description={PAGES.status.description}>
      <AdStatusContent
        contracts={contracts}
        totalPages={totalPages}
        currentPage={Number(searchParams.page ?? 0)}
        fetchError={fetchError}
        searched={Boolean(searchParams.startDate)}
        initialFilters={{
          companyId: searchParams.companyId ?? '',
          companyName: searchParams.companyName ?? '',
          statuses,
          startDate,
          endDate,
        }}
      />
    </PageLayout>
  );
}
