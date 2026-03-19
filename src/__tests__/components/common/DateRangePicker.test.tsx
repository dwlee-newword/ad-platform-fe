import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { format, addDays, parseISO } from 'date-fns';
import DateRangePicker from '@/components/common/DateRangePicker';

// DatePicker를 단순 input으로 대체해 날짜 선택 로직을 직접 트리거한다
vi.mock('@/components/ui/DatePicker', () => ({
  default: ({
    value,
    onChange,
    'data-testid': testId,
  }: {
    value: string;
    onChange: (v: string) => void;
    disabled?: (date: Date) => boolean;
    'data-testid'?: string;
  }) => (
    <input
      data-testid={testId ?? 'date-picker'}
      value={value}
      readOnly
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

/**
 * DateRangePicker는 DatePicker를 두 개 렌더링한다.
 * 첫 번째가 시작일, 두 번째가 종료일이다.
 * vi.mock으로 DatePicker를 단순 input으로 교체했으므로 fireEvent.change로 값을 변경할 수 있다.
 */
function getStartInput() {
  return screen.getAllByTestId('date-picker')[0];
}

function getEndInput() {
  return screen.getAllByTestId('date-picker')[1];
}

describe('DateRangePicker', () => {
  it('마운트 시 onStartChange와 onEndChange가 초기값으로 호출된다', () => {
    const onStartChange = vi.fn();
    const onEndChange = vi.fn();
    const today = format(new Date(), 'yyyy-MM-dd');
    const defaultEnd = format(addDays(parseISO(today), 28), 'yyyy-MM-dd');

    render(<DateRangePicker onStartChange={onStartChange} onEndChange={onEndChange} />);

    expect(onStartChange).toHaveBeenCalledWith(today);
    expect(onEndChange).toHaveBeenCalledWith(defaultEnd);
  });

  it('startDate prop이 없으면 오늘 날짜를 기본값으로 렌더링한다', () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    render(<DateRangePicker onStartChange={vi.fn()} onEndChange={vi.fn()} />);
    expect(getStartInput()).toHaveValue(today);
  });

  it('기본 종료일은 시작일 + 28일이다', () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const expectedEnd = format(addDays(parseISO(today), 28), 'yyyy-MM-dd');
    render(<DateRangePicker onStartChange={vi.fn()} onEndChange={vi.fn()} />);
    expect(getEndInput()).toHaveValue(expectedEnd);
  });

  it('시작일 변경 시 종료일이 새 시작일 + 28일로 자동 업데이트된다', () => {
    const onStartChange = vi.fn();
    const onEndChange = vi.fn();
    render(<DateRangePicker onStartChange={onStartChange} onEndChange={onEndChange} />);

    const newStart = '2026-05-01';
    const expectedEnd = format(addDays(parseISO(newStart), 28), 'yyyy-MM-dd'); // 2026-05-29

    fireEvent.change(getStartInput(), { target: { value: newStart } });

    expect(onStartChange).toHaveBeenCalledWith(newStart);
    expect(onEndChange).toHaveBeenCalledWith(expectedEnd);
    expect(getEndInput()).toHaveValue(expectedEnd);
  });

  it('props로 초기 날짜를 주입할 수 있다', () => {
    render(
      <DateRangePicker
        startDate="2026-04-01"
        endDate="2026-04-29"
        onStartChange={vi.fn()}
        onEndChange={vi.fn()}
      />,
    );
    expect(getStartInput()).toHaveValue('2026-04-01');
    expect(getEndInput()).toHaveValue('2026-04-29');
  });

  it('종료일 변경 시 onEndChange가 호출된다', () => {
    const onEndChange = vi.fn();
    render(
      <DateRangePicker
        startDate="2026-04-01"
        endDate="2026-04-29"
        onStartChange={vi.fn()}
        onEndChange={onEndChange}
      />,
    );

    onEndChange.mockClear(); // 마운트 시 호출된 것 제거
    fireEvent.change(getEndInput(), { target: { value: '2026-05-10' } });

    expect(onEndChange).toHaveBeenCalledWith('2026-05-10');
  });

  it('startLabel과 endLabel이 있으면 레이블을 표시한다', () => {
    render(
      <DateRangePicker
        onStartChange={vi.fn()}
        onEndChange={vi.fn()}
        startLabel="계약 시작일"
        endLabel="계약 종료일"
      />,
    );
    expect(screen.getByText('계약 시작일')).toBeInTheDocument();
    expect(screen.getByText('계약 종료일')).toBeInTheDocument();
  });
});
