'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { COMPANY_SEARCH_THRESHOLD, COMPANY_SEARCH_LIMIT } from '@/constants/search';
import { COMMON, COMPANY_AUTOCOMPLETE } from '@/constants/text';

interface Company {
  id: number;
  name: string;
}
interface CompanyCountResponse {
  count: number;
}
interface CompanySearchResponse {
  items: Company[];
  hasMore: boolean;
}

interface CompanyAutocompleteProps {
  value: string;
  initialName?: string;
  onValueChange: (id: string, name: string) => void;
  placeholder?: string;
}

export default function CompanyAutocomplete({
  value,
  initialName,
  onValueChange,
  placeholder,
}: CompanyAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [displayName, setDisplayName] = useState(initialName ?? '');
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [useServerSearch, setUseServerSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!value) setDisplayName('');
  }, [value]);

  // 최초 오픈 시 count 조회 후 모드 결정
  useEffect(() => {
    if (!open || initializedRef.current) return;
    initializedRef.current = true;

    setLoading(true);
    setError(false);
    axios
      .get<CompanyCountResponse>(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/count`)
      .then(({ data: { count } }) => {
        if (count >= COMPANY_SEARCH_THRESHOLD) {
          setUseServerSearch(true);
          setLoading(false);
        } else {
          return axios
            .get<CompanySearchResponse>(`${process.env.NEXT_PUBLIC_API_URL}/api/companies`)
            .then(({ data }) => {
              setAllCompanies(data.items);
              setCompanies(data.items);
            });
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [open]);

  // 클라이언트 모드: keyword 변경 시 메모리 필터링
  useEffect(() => {
    if (useServerSearch) return;
    const q = keyword.trim().toLowerCase();
    setCompanies(q ? allCompanies.filter((c) => c.name.toLowerCase().includes(q)) : allCompanies);
  }, [keyword, allCompanies, useServerSearch]);

  // 서버 모드: debounce + AbortController
  useEffect(() => {
    if (!useServerSearch) return;
    setError(false);
    if (!keyword.trim()) {
      setCompanies([]);
      setHasMore(false);
      return;
    }
    const timer = setTimeout(() => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      setLoading(true);
      axios
        .get<CompanySearchResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/companies?keyword=${encodeURIComponent(keyword)}&limit=${COMPANY_SEARCH_LIMIT}`,
          { signal: abortRef.current.signal },
        )
        .then(({ data }) => {
          setCompanies(data.items);
          setHasMore(data.hasMore);
        })
        .catch((err) => {
          if (!axios.isCancel(err)) {
            setCompanies([]);
            setHasMore(false);
            setError(true);
          }
        })
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword, useServerSearch]);

  function handleRetry() {
    setError(false);
    initializedRef.current = false;
    setKeyword('');
    setCompanies([]);
    setAllCompanies([]);
    // re-trigger init effect
    setOpen(false);
    setTimeout(() => setOpen(true), 0);
  }

  function handleSelect(company: Company) {
    onValueChange(String(company.id), company.name);
    setDisplayName(company.name);
    setKeyword('');
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'focus:ring-primary-border focus:border-primary-border flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1',
            value ? 'text-gray-900' : 'text-gray-400',
          )}
        >
          <span className="truncate">{value ? displayName : placeholder}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <div className="border-b border-gray-100 p-2">
          <input
            className="w-full text-sm outline-none placeholder:text-gray-400"
            placeholder={COMPANY_AUTOCOMPLETE.searchPlaceholder}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            autoFocus
          />
        </div>
        <ul className="max-h-48 overflow-y-auto py-1">
          {loading && <li className="px-3 py-2 text-sm text-gray-400">{COMMON.loading}</li>}
          {!loading && error && (
            <li className="flex flex-col items-center gap-1 px-3 py-3">
              <span className="text-sm text-red-500">{COMMON.fetchError}</span>
              <button
                type="button"
                className="text-xs text-blue-600 hover:underline"
                onClick={handleRetry}
              >
                {COMMON.retry}
              </button>
            </li>
          )}
          {!loading && !error && companies.length === 0 && (
            <li className="px-3 py-2 text-sm text-gray-400">
              {useServerSearch && !keyword.trim()
                ? COMPANY_AUTOCOMPLETE.typeToSearch
                : COMPANY_AUTOCOMPLETE.noResults}
            </li>
          )}
          {!loading &&
            companies.map((c) => (
              <li
                key={c.id}
                onClick={() => handleSelect(c)}
                className={cn(
                  'cursor-pointer px-3 py-2 text-sm hover:bg-gray-50',
                  value === String(c.id) && 'bg-gray-100 font-medium',
                )}
              >
                {c.name}({c.id})
              </li>
            ))}
          {!loading && hasMore && (
            <li className="border-t border-gray-100 px-3 py-2 text-xs text-gray-400">
              {COMPANY_AUTOCOMPLETE.refineSearch}
            </li>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
