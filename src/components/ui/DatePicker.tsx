'use client';

import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: (date: Date) => boolean;
  defaultMonth?: Date;
}

export default function DatePicker({ value, onChange, placeholder, open: openProp, onOpenChange, disabled, defaultMonth }: DatePickerProps) {
  const [openInternal, setOpenInternal] = useState(false);
  const [month, setMonth] = useState<Date | undefined>(defaultMonth);

  useEffect(() => {
    if (defaultMonth) setMonth(defaultMonth);
  }, [defaultMonth]);

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : openInternal;
  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && defaultMonth) {
      setMonth(defaultMonth);
    }
    if (isControlled) {
      onOpenChange!(nextOpen);
    } else {
      setOpenInternal(nextOpen);
    }
  };

  const selected = value ? parseISO(value) : undefined;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex w-full items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-border focus:border-primary-border',
            value ? 'text-gray-900' : 'text-gray-400',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          {value ? format(selected!, 'yyyy-MM-dd') : placeholder}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          month={month}
          onMonthChange={setMonth}
          disabled={disabled}
          onSelect={(date) => {
            onChange(date ? format(date, 'yyyy-MM-dd') : '');
            handleOpenChange(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
