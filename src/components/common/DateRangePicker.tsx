'use client';

import { useState, useEffect } from 'react';
import { format, addDays, addMonths, addYears, parseISO } from 'date-fns';
import DatePicker from '../ui/DatePicker';
import { DATE_NAVIGATION } from '@/constants/text';

interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  placeholder?: string;
  disablePastStart?: boolean;
  startLabel?: string;
  endLabel?: string;
  showNavigationButtons?: boolean;
  preserveEndDate?: boolean;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  placeholder,
  disablePastStart = false,
  startLabel,
  endLabel,
  showNavigationButtons = false,
  preserveEndDate = false,
}: DateRangePickerProps) {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const defaultStart = startDate || todayStr;
  const defaultEnd = endDate || format(addDays(parseISO(defaultStart), 28), 'yyyy-MM-dd');

  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [endDefaultMonth, setEndDefaultMonth] = useState<Date | undefined>(undefined);

  useEffect(() => {
    onStartChange(start);
    onEndChange(end);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startDateDisabled = (date: Date) => {
    if (disablePastStart) return date < parseISO(todayStr);
    return false;
  };

  const endDateDisabled = (date: Date) => {
    const minEndDate = addDays(parseISO(start), 28);
    return date < minEndDate;
  };

  function applyStartChange(value: string, openEndPicker: boolean) {
    const minEndDate = addDays(parseISO(value), 28);
    const currentEnd = parseISO(end);
    setStart(value);
    onStartChange(value);

    if (!preserveEndDate || currentEnd < minEndDate) {
      const newEnd = format(minEndDate, 'yyyy-MM-dd');
      setEnd(newEnd);
      onEndChange(newEnd);
    }
    // 종료일 캘린더를 선택 가능한 최초 월로 이동
    setEndDefaultMonth(minEndDate);
    if (openEndPicker) {
      setEndDateOpen(true);
    }
  }

  function handleStartChange(value: string) {
    applyStartChange(value, true);
  }

  function handleEndChange(value: string) {
    setEnd(value);
    onEndChange(value);
  }

  function navigateDate(
    target: 'start' | 'end',
    amount: number,
    unit: 'month' | 'year',
  ) {
    const current = parseISO(target === 'start' ? start : end);
    const fn = unit === 'month' ? addMonths : addYears;
    const newDate = fn(current, amount);
    const newValue = format(newDate, 'yyyy-MM-dd');

    if (target === 'start') {
      applyStartChange(newValue, false);
    } else {
      handleEndChange(newValue);
    }
  }

  const navButtonClass =
    'rounded border border-gray-300 px-1.5 py-0.5 text-xs text-gray-600 hover:bg-gray-100';

  function renderNavButtons(target: 'start' | 'end') {
    if (!showNavigationButtons) return null;
    return (
      <div className="flex items-center gap-1">
        <button type="button" className={navButtonClass} onClick={() => navigateDate(target, -1, 'year')}>
          {DATE_NAVIGATION.backYear}
        </button>
        <button type="button" className={navButtonClass} onClick={() => navigateDate(target, -1, 'month')}>
          {DATE_NAVIGATION.backMonth}
        </button>
        <button type="button" className={navButtonClass} onClick={() => navigateDate(target, 1, 'month')}>
          {DATE_NAVIGATION.forwardMonth}
        </button>
        <button type="button" className={navButtonClass} onClick={() => navigateDate(target, 1, 'year')}>
          {DATE_NAVIGATION.forwardYear}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {startLabel && <span className="w-20 shrink-0 text-sm text-gray-600">{startLabel}</span>}
        <div className="w-40">
          <DatePicker
            value={start}
            onChange={handleStartChange}
            disabled={startDateDisabled}
            placeholder={placeholder}
          />
        </div>
        {renderNavButtons('start')}
      </div>
      <div className="flex items-center gap-3">
        {endLabel && <span className="w-20 shrink-0 text-sm text-gray-600">{endLabel}</span>}
        <div className="w-40">
          <DatePicker
            value={end}
            onChange={handleEndChange}
            open={endDateOpen}
            onOpenChange={setEndDateOpen}
            disabled={endDateDisabled}
            defaultMonth={endDefaultMonth}
            placeholder={placeholder}
          />
        </div>
        {renderNavButtons('end')}
      </div>
    </div>
  );
}
