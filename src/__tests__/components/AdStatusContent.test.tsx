import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdStatusContent from '@/components/AdStatusContent';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// 복잡한 하위 컴포넌트는 단순 스텁으로 대체해 AdStatusContent 로직에 집중한다
vi.mock('@/components/common/CompanyAutocomplete', () => ({
  default: ({ onValueChange }: { onValueChange: (id: string, name: string) => void }) => (
    <button
      data-testid="company-autocomplete"
      onClick={() => onValueChange('10001', '테스트회사')}
    >
      업체 선택
    </button>
  ),
}));

vi.mock('@/components/common/DateRangePicker', () => ({
  default: ({
    onStartChange,
    onEndChange,
  }: {
    onStartChange: (v: string) => void;
    onEndChange: (v: string) => void;
  }) => (
    <div data-testid="date-range-picker">
      <input
        data-testid="start-date-input"
        onChange={(e) => onStartChange(e.target.value)}
        placeholder="시작일"
      />
      <input
        data-testid="end-date-input"
        onChange={(e) => onEndChange(e.target.value)}
        placeholder="종료일"
      />
    </div>
  ),
}));

const SAMPLE_CONTRACTS = [
  {
    id: 1,
    contractNumber: 'CT-0001',
    contractDate: '2026-03-01',
    companyName: '테스트회사',
    productName: '노출 보장형 광고',
    startDate: '2026-03-15',
    endDate: '2026-04-12',
    amount: 100000,
    status: 'PENDING',
  },
  {
    id: 2,
    contractNumber: 'CT-0002',
    contractDate: '2026-03-05',
    companyName: '광고법인',
    productName: '노출 보장형 광고',
    startDate: '2026-04-01',
    endDate: '2026-04-29',
    amount: 500000,
    status: 'IN_PROGRESS',
  },
];

const DEFAULT_PROPS = {
  contracts: SAMPLE_CONTRACTS,
  totalPages: 1,
  currentPage: 0,
  initialFilters: {
    companyId: '',
    companyName: '',
    statuses: [],
  },
};

describe('AdStatusContent', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('계약 목록이 없을 때 빈 상태 메시지를 표시한다', () => {
    render(<AdStatusContent {...DEFAULT_PROPS} contracts={[]} />);
    expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
  });

  it('계약 목록을 테이블로 렌더링한다', () => {
    render(<AdStatusContent {...DEFAULT_PROPS} />);
    expect(screen.getByText('CT-0001')).toBeInTheDocument();
    expect(screen.getByText('테스트회사')).toBeInTheDocument();
    expect(screen.getByText('CT-0002')).toBeInTheDocument();
    expect(screen.getByText('광고법인')).toBeInTheDocument();
    expect(screen.getByText('₩100,000')).toBeInTheDocument();
    // 체크박스 레이블과 테이블 셀에 동일한 텍스트가 존재하므로 getAllByText로 검사한다
    expect(screen.getAllByText('집행전').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('집행중').length).toBeGreaterThanOrEqual(1);
  });

  it('계약 행 클릭 시 상세 페이지로 이동한다', async () => {
    const user = userEvent.setup();
    render(<AdStatusContent {...DEFAULT_PROPS} />);
    await user.click(screen.getByText('CT-0001'));
    expect(mockPush).toHaveBeenCalledWith('/results/1');
  });

  it('totalPages > 0이면 페이지네이션을 표시한다', () => {
    render(<AdStatusContent {...DEFAULT_PROPS} totalPages={3} />);
    expect(screen.getByRole('button', { name: '이전' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음' })).toBeInTheDocument();
  });

  it('totalPages = 0이어도 페이지네이션이 표시된다', () => {
    render(<AdStatusContent {...DEFAULT_PROPS} totalPages={0} />);
    expect(screen.getByRole('button', { name: '이전' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음' })).toBeInTheDocument();
  });

  it('조회 버튼 클릭 시 /status 경로로 navigate한다', async () => {
    const user = userEvent.setup();
    render(<AdStatusContent {...DEFAULT_PROPS} />);
    await user.click(screen.getByRole('button', { name: '조회' }));
    expect(mockPush).toHaveBeenCalledWith(expect.stringMatching(/^\/status\?/));
  });

  it('조회 URL에 현재 선택된 상태 필터가 포함된다', async () => {
    const user = userEvent.setup();
    render(<AdStatusContent {...DEFAULT_PROPS} />);
    await user.click(screen.getByRole('button', { name: '조회' }));
    const calledUrl = mockPush.mock.calls[0][0] as string;
    expect(calledUrl).toContain('statuses=');
    expect(calledUrl).toContain('PENDING');
  });

  it('전체 체크박스 해제 후 조회 시 상태 미선택 다이얼로그가 표시된다', async () => {
    const user = userEvent.setup();
    render(<AdStatusContent {...DEFAULT_PROPS} />);

    // 전체 체크박스 = role="checkbox" 중 첫 번째 (ALL)
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]); // ALL 체크박스 해제

    await user.click(screen.getByRole('button', { name: '조회' }));
    expect(mockPush).not.toHaveBeenCalled();
    expect(screen.getByText('계약상태를 1개 이상 선택해주세요.')).toBeInTheDocument();
  });

  it('개별 상태 체크박스 선택 해제가 반영된다', async () => {
    const user = userEvent.setup();
    render(<AdStatusContent {...DEFAULT_PROPS} />);

    // PENDING 체크박스 = checkboxes[1]
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]); // PENDING 해제

    await user.click(screen.getByRole('button', { name: '조회' }));
    const calledUrl = mockPush.mock.calls[0][0] as string;
    expect(calledUrl).not.toContain('PENDING');
  });

  it('페이지 변경 시 URL에 page 파라미터가 업데이트된다', async () => {
    const user = userEvent.setup();
    render(<AdStatusContent {...DEFAULT_PROPS} totalPages={3} currentPage={0} />);
    await user.click(screen.getByRole('button', { name: '2' }));
    const calledUrl = mockPush.mock.calls[0][0] as string;
    const params = new URLSearchParams(calledUrl.replace('/status?', ''));
    expect(params.get('page')).toBe('1');
  });

  it('initialFilters에 companyId가 있으면 검색 URL에 포함된다', async () => {
    const user = userEvent.setup();
    render(
      <AdStatusContent
        {...DEFAULT_PROPS}
        initialFilters={{ companyId: '10001', companyName: '테스트회사', statuses: [] }}
      />,
    );
    await user.click(screen.getByRole('button', { name: '조회' }));
    const calledUrl = mockPush.mock.calls[0][0] as string;
    expect(calledUrl).toContain('companyId=10001');
    expect(calledUrl).toContain('companyName=%ED%85%8C%EC%8A%A4%ED%8A%B8%ED%9A%8C%EC%82%AC');
  });
});
