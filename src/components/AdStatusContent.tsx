'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CompanyAutocomplete from './common/CompanyAutocomplete';
import DateRangePicker from './common/DateRangePicker';
import { Checkbox } from './ui/checkbox';
import Pagination from './common/Pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { AD_STATUS, COMMON, CONTRACT_STATUSES, CONTRACT_STATUS_LABEL } from '@/constants/text';
import { ErrorDialog } from './ContractDialogs';
import StatusMessage from './common/StatusMessage';

type StatusValue = (typeof CONTRACT_STATUSES)[number]['value'];

const INDIVIDUAL_STATUSES = CONTRACT_STATUSES.filter((s) => s.value !== 'ALL').map((s) => s.value);


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

interface InitialFilters {
  companyId: string;
  companyName: string;
  statuses: string[];
  startDate?: string;
  endDate?: string;
}

interface AdStatusContentProps {
  contracts: ContractRow[];
  totalPages: number;
  currentPage: number;
  fetchError?: boolean;
  searched?: boolean;
  initialFilters: InitialFilters;
}

export default function AdStatusContent({
  contracts,
  totalPages,
  currentPage,
  fetchError,
  searched,
  initialFilters,
}: AdStatusContentProps) {
  const router = useRouter();
  const [companyId, setCompanyId] = useState(initialFilters.companyId);
  const [companyName, setCompanyName] = useState(initialFilters.companyName);
  const [selectedStatuses, setSelectedStatuses] = useState<StatusValue[]>(
    initialFilters.statuses.length > 0
      ? (initialFilters.statuses as StatusValue[])
      : [...INDIVIDUAL_STATUSES],
  );
  const [startDate, setStartDate] = useState(initialFilters.startDate ?? '');
  const [endDate, setEndDate] = useState(initialFilters.endDate ?? '');
  const [errorDialogOpen, setErrorDialogOpen] = useState(
    (fetchError && searched) ?? false,
  );
  const [statusRequiredOpen, setStatusRequiredOpen] = useState(false);

  const allChecked = INDIVIDUAL_STATUSES.every((s) => selectedStatuses.includes(s));

  function handleStatusChange(value: StatusValue, checked: boolean) {
    if (value === 'ALL') {
      setSelectedStatuses(checked ? [...INDIVIDUAL_STATUSES] : []);
      return;
    }
    setSelectedStatuses(
      checked ? [...selectedStatuses, value] : selectedStatuses.filter((s) => s !== value),
    );
  }

  function buildSearchParams(targetPage: number) {
    const params = new URLSearchParams();
    if (companyId) {
      params.set('companyId', companyId);
      params.set('companyName', companyName);
    }
    params.set('statuses', selectedStatuses.join(','));
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    params.set('page', String(targetPage));
    return params.toString();
  }

  function handleSearch() {
    if (selectedStatuses.length === 0) {
      setStatusRequiredOpen(true);
      return;
    }
    router.push(`/status?${buildSearchParams(0)}`);
  }

  function handlePageChange(newPage: number) {
    router.push(`/status?${buildSearchParams(newPage)}`);
  }

  return (
    <div className="flex flex-col gap-4" style={{ minHeight: 'calc(30vh)' }}>
      <ErrorDialog
        open={errorDialogOpen}
        title={AD_STATUS.fetchErrorModal.title}
        message={COMMON.fetchError}
        onClose={() => setErrorDialogOpen(false)}
      />
      <ErrorDialog
        open={statusRequiredOpen}
        title={AD_STATUS.statusRequired.title}
        message={AD_STATUS.statusRequired.message}
        onClose={() => setStatusRequiredOpen(false)}
      />
      {/* 조회 필터 영역 */}
      <section className="flex-1 rounded-lg border bg-white p-4">
        <h2 className="mb-4 text-sm font-semibold text-gray-500">{AD_STATUS.filterTitle}</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <label className="w-20 shrink-0 text-sm text-gray-600">{AD_STATUS.companyLabel}</label>
            <div className="w-64">
              <CompanyAutocomplete
                value={companyId}
                initialName={companyName}
                onValueChange={(id, name) => {
                  setCompanyId(id);
                  setCompanyName(name);
                }}
                placeholder={AD_STATUS.companyPlaceholder}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-sm text-gray-600">{AD_STATUS.statusLabel}</span>
            <div className="flex items-center gap-4">
              {CONTRACT_STATUSES.map(({ value, label }) => (
                <label key={value} className="flex cursor-pointer items-center gap-1.5">
                  <Checkbox
                    checked={value === 'ALL' ? allChecked : selectedStatuses.includes(value)}
                    onCheckedChange={(checked) => handleStatusChange(value, !!checked)}
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
          <DateRangePicker
            startDate={initialFilters.startDate}
            endDate={initialFilters.endDate}
            onStartChange={setStartDate}
            onEndChange={setEndDate}
            startLabel={AD_STATUS.startDateLabel}
            endLabel={AD_STATUS.endDateLabel}
            placeholder={AD_STATUS.datePlaceholder}
            showNavigationButtons
            preserveEndDate
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            onClick={handleSearch}
          >
            {AD_STATUS.searchButton}
          </button>
        </div>
      </section>

      {/* 검색 결과 영역 */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-gray-500">{AD_STATUS.resultsTitle}</h2>
        {fetchError && !searched ? (
          <StatusMessage variant="error" />
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{AD_STATUS.tableHeaders.contractDate}</TableHead>
              <TableHead>{AD_STATUS.tableHeaders.contractNumber}</TableHead>
              <TableHead>{AD_STATUS.tableHeaders.company}</TableHead>
              <TableHead>{AD_STATUS.tableHeaders.productName}</TableHead>
              <TableHead>{AD_STATUS.tableHeaders.startDate}</TableHead>
              <TableHead>{AD_STATUS.tableHeaders.endDate}</TableHead>
              <TableHead className="text-right">{AD_STATUS.tableHeaders.amount}</TableHead>
              <TableHead>{AD_STATUS.tableHeaders.status}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-sm text-gray-400">
                  {AD_STATUS.emptyResults}
                </TableCell>
              </TableRow>
            ) : (
              contracts.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => router.push(`/results/${row.id}`)}
                >
                  <TableCell>{row.contractDate}</TableCell>
                  <TableCell>{row.contractNumber}</TableCell>
                  <TableCell>{row.companyName}</TableCell>
                  <TableCell>{row.productName}</TableCell>
                  <TableCell>{row.startDate}</TableCell>
                  <TableCell>{row.endDate}</TableCell>
                  <TableCell className="text-right">₩{row.amount.toLocaleString()}</TableCell>
                  <TableCell>{CONTRACT_STATUS_LABEL[row.status] ?? row.status}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        )}
        <div className="mt-4">
          <Pagination
            totalPages={Math.max(totalPages, 1)}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </section>
    </div>
  );
}
