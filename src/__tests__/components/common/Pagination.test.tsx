import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '@/components/common/Pagination';

describe('Pagination', () => {
  function setup(overrides: Partial<React.ComponentProps<typeof Pagination>> = {}) {
    const props = {
      totalPages: 3,
      currentPage: 1,
      onPageChange: vi.fn(),
      ...overrides,
    };
    render(<Pagination {...props} />);
    return props;
  }

  it('이전, 다음, 페이지 번호 버튼을 렌더링한다', () => {
    setup();
    expect(screen.getByRole('button', { name: '이전' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
  });

  it('첫 페이지에서 이전 버튼이 비활성화된다', () => {
    setup({ currentPage: 0 });
    expect(screen.getByRole('button', { name: '이전' })).toBeDisabled();
  });

  it('첫 페이지가 아니면 이전 버튼이 활성화된다', () => {
    setup({ currentPage: 1 });
    expect(screen.getByRole('button', { name: '이전' })).not.toBeDisabled();
  });

  it('마지막 페이지에서 다음 버튼이 비활성화된다', () => {
    setup({ currentPage: 2, totalPages: 3 });
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
  });

  it('마지막 페이지가 아니면 다음 버튼이 활성화된다', () => {
    setup({ currentPage: 0, totalPages: 3 });
    expect(screen.getByRole('button', { name: '다음' })).not.toBeDisabled();
  });

  it('페이지 버튼 클릭 시 해당 페이지 인덱스로 onPageChange를 호출한다', async () => {
    const user = userEvent.setup();
    const { onPageChange } = setup({ currentPage: 0, totalPages: 3 });
    await user.click(screen.getByRole('button', { name: '2' }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('이전 버튼 클릭 시 currentPage - 1로 onPageChange를 호출한다', async () => {
    const user = userEvent.setup();
    const { onPageChange } = setup({ currentPage: 2, totalPages: 3 });
    await user.click(screen.getByRole('button', { name: '이전' }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('다음 버튼 클릭 시 currentPage + 1로 onPageChange를 호출한다', async () => {
    const user = userEvent.setup();
    const { onPageChange } = setup({ currentPage: 0, totalPages: 3 });
    await user.click(screen.getByRole('button', { name: '다음' }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('totalPages가 1이면 이전/페이지/다음 버튼 3개만 렌더링된다', () => {
    setup({ totalPages: 1, currentPage: 0 });
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });
});
