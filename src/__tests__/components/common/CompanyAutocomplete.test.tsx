import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import CompanyAutocomplete from '@/components/common/CompanyAutocomplete';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

// Radix Popover를 단순한 open/close 방식으로 대체해 jsdom 환경에서 안정적으로 동작하게 한다
vi.mock('@/components/ui/popover', () => ({
  Popover: ({
    children,
    open,
    onOpenChange,
  }: {
    children: React.ReactNode[];
    open: boolean;
    onOpenChange: (v: boolean) => void;
  }) => {
    const childArray = Array.isArray(children) ? children : [children];
    return (
      <div>
        <span data-testid="popover-trigger" onClick={() => onOpenChange(!open)}>
          {childArray[0]}
        </span>
        {open && <div data-testid="popover-content">{childArray[1]}</div>}
      </div>
    );
  },
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  PopoverContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const COMPANIES = [
  { id: 10001, name: '회사A' },
  { id: 10002, name: '회사B' },
  { id: 10003, name: '테스트법인' },
];

describe('CompanyAutocomplete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAxios.isCancel = vi.fn(() => false) as typeof axios.isCancel;
  });

  it('value가 없으면 placeholder를 표시한다', () => {
    render(
      <CompanyAutocomplete value="" onValueChange={vi.fn()} placeholder="업체를 선택하세요" />,
    );
    expect(screen.getByText('업체를 선택하세요')).toBeInTheDocument();
  });

  it('value와 initialName이 있으면 선택된 업체명을 표시한다', () => {
    render(
      <CompanyAutocomplete
        value="10001"
        initialName="회사A"
        onValueChange={vi.fn()}
        placeholder="업체를 선택하세요"
      />,
    );
    expect(screen.getByText('회사A')).toBeInTheDocument();
  });

  describe('클라이언트 모드 (업체 수 < 임계값)', () => {
    beforeEach(() => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: { count: 3 } })
        .mockResolvedValueOnce({ data: { items: COMPANIES, hasMore: false } });
    });

    it('드롭다운 오픈 시 전체 업체 목록을 로드한다', async () => {
      const user = userEvent.setup();
      render(
        <CompanyAutocomplete value="" onValueChange={vi.fn()} placeholder="업체를 선택하세요" />,
      );

      await user.click(screen.getByTestId('popover-trigger'));

      await waitFor(() => {
        expect(screen.getByText('회사A(10001)')).toBeInTheDocument();
        expect(screen.getByText('회사B(10002)')).toBeInTheDocument();
        expect(screen.getByText('테스트법인(10003)')).toBeInTheDocument();
      });
    });

    it('키워드 입력 시 클라이언트 사이드로 목록을 필터링한다', async () => {
      const user = userEvent.setup();
      render(<CompanyAutocomplete value="" onValueChange={vi.fn()} />);

      await user.click(screen.getByTestId('popover-trigger'));
      await waitFor(() => expect(screen.getByText('회사A(10001)')).toBeInTheDocument());

      await user.type(screen.getByPlaceholderText('업체명 검색...'), '테스트');

      expect(screen.queryByText('회사A(10001)')).not.toBeInTheDocument();
      expect(screen.getByText('테스트법인(10003)')).toBeInTheDocument();
    });

    it('업체 선택 시 onValueChange가 id와 name으로 호출된다', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<CompanyAutocomplete value="" onValueChange={onValueChange} />);

      await user.click(screen.getByTestId('popover-trigger'));
      await waitFor(() => expect(screen.getByText('회사A(10001)')).toBeInTheDocument());

      await user.click(screen.getByText('회사A(10001)'));

      expect(onValueChange).toHaveBeenCalledWith('10001', '회사A');
    });

    it('검색어가 없을 때 전체 목록을 표시한다', async () => {
      const user = userEvent.setup();
      render(<CompanyAutocomplete value="" onValueChange={vi.fn()} />);

      await user.click(screen.getByTestId('popover-trigger'));
      await waitFor(() => expect(screen.getByText('회사A(10001)')).toBeInTheDocument());

      await user.type(screen.getByPlaceholderText('업체명 검색...'), '회사');
      // 회사A, 회사B는 매칭, 테스트법인은 제외
      expect(screen.getByText('회사A(10001)')).toBeInTheDocument();
      expect(screen.getByText('회사B(10002)')).toBeInTheDocument();
      expect(screen.queryByText('테스트법인(10003)')).not.toBeInTheDocument();
    });
  });

  describe('서버 검색 모드 (업체 수 >= 임계값)', () => {
    beforeEach(() => {
      mockedAxios.get.mockResolvedValueOnce({ data: { count: 25 } });
    });

    it('키워드 미입력 시 검색 안내 메시지를 표시한다', async () => {
      const user = userEvent.setup();
      render(<CompanyAutocomplete value="" onValueChange={vi.fn()} />);

      await user.click(screen.getByTestId('popover-trigger'));

      await waitFor(() => {
        expect(screen.getByText('업체명을 입력하여 검색하세요')).toBeInTheDocument();
      });
    });

    it('키워드 입력 시 서버에 검색 요청을 보낸다', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { items: [{ id: 10001, name: '회사A' }], hasMore: false },
      });

      const user = userEvent.setup();
      render(<CompanyAutocomplete value="" onValueChange={vi.fn()} />);

      await user.click(screen.getByTestId('popover-trigger'));
      await waitFor(() =>
        expect(screen.getByText('업체명을 입력하여 검색하세요')).toBeInTheDocument(),
      );

      await user.type(screen.getByPlaceholderText('업체명 검색...'), '회사');

      await waitFor(
        () => {
          expect(screen.getByText('회사A(10001)')).toBeInTheDocument();
        },
        { timeout: 600 },
      );
    });

    it('hasMore가 true이면 결과 축소 안내 메시지를 표시한다', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          items: [{ id: 10001, name: '회사A' }],
          hasMore: true,
        },
      });

      const user = userEvent.setup();
      render(<CompanyAutocomplete value="" onValueChange={vi.fn()} />);

      await user.click(screen.getByTestId('popover-trigger'));
      await waitFor(() =>
        expect(screen.getByText('업체명을 입력하여 검색하세요')).toBeInTheDocument(),
      );

      await user.type(screen.getByPlaceholderText('업체명 검색...'), '회사');

      await waitFor(
        () => {
          expect(
            screen.getByText('검색어를 구체적으로 입력하면 결과를 좁힐 수 있습니다'),
          ).toBeInTheDocument();
        },
        { timeout: 600 },
      );
    });
  });

  it('value prop이 빈 문자열로 변경되면 표시명이 초기화된다', async () => {
    const { rerender } = render(
      <CompanyAutocomplete value="10001" initialName="회사A" onValueChange={vi.fn()} />,
    );
    expect(screen.getByText('회사A')).toBeInTheDocument();

    rerender(<CompanyAutocomplete value="" onValueChange={vi.fn()} placeholder="업체를 선택하세요" />);
    expect(screen.getByText('업체를 선택하세요')).toBeInTheDocument();
  });
});
