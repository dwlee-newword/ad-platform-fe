import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  TodayWarningDialog,
  ConfirmDialog,
  SuccessDialog,
  ErrorDialog,
} from '@/components/ContractDialogs';

describe('TodayWarningDialog', () => {
  it('닫혀 있을 때 렌더링되지 않는다', () => {
    render(<TodayWarningDialog open={false} onCancel={vi.fn()} onConfirm={vi.fn()} />);
    expect(screen.queryByText('광고 집행일이 오늘입니다')).not.toBeInTheDocument();
  });

  it('열렸을 때 제목과 설명을 표시한다', () => {
    render(<TodayWarningDialog open={true} onCancel={vi.fn()} onConfirm={vi.fn()} />);
    expect(screen.getByText('광고 집행일이 오늘입니다')).toBeInTheDocument();
    expect(screen.getByText(/계약 즉시 광고가 집행됩니다/)).toBeInTheDocument();
  });

  it('취소 버튼 클릭 시 onCancel이 호출된다', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<TodayWarningDialog open={true} onCancel={onCancel} onConfirm={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: '취소' }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('계속 버튼 클릭 시 onConfirm이 호출된다', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<TodayWarningDialog open={true} onCancel={vi.fn()} onConfirm={onConfirm} />);
    await user.click(screen.getByRole('button', { name: '계속' }));
    expect(onConfirm).toHaveBeenCalled();
  });
});

describe('ConfirmDialog', () => {
  it('열렸을 때 제목을 표시한다', () => {
    render(
      <ConfirmDialog open={true} submitting={false} onCancel={vi.fn()} onConfirm={vi.fn()} />,
    );
    expect(screen.getByText('계약을 진행하시겠습니까?')).toBeInTheDocument();
  });

  it('submitting 중에는 버튼이 비활성화되고 로딩 텍스트를 표시한다', () => {
    render(
      <ConfirmDialog open={true} submitting={true} onCancel={vi.fn()} onConfirm={vi.fn()} />,
    );
    expect(screen.getByText('불러오는 중...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '취소' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '불러오는 중...' })).toBeDisabled();
  });

  it('취소 버튼 클릭 시 onCancel이 호출된다', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<ConfirmDialog open={true} submitting={false} onCancel={onCancel} onConfirm={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: '취소' }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('확인 버튼 클릭 시 onConfirm이 호출된다', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog open={true} submitting={false} onCancel={vi.fn()} onConfirm={onConfirm} />,
    );
    await user.click(screen.getByRole('button', { name: '확인' }));
    expect(onConfirm).toHaveBeenCalled();
  });
});

describe('SuccessDialog', () => {
  it('업체명과 시작일을 표시한다', () => {
    render(
      <SuccessDialog
        open={true}
        companyName="테스트회사"
        startDate="2026-03-15"
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText(/테스트회사으로 계약 생성에 성공했습니다/)).toBeInTheDocument();
    expect(screen.getByText(/2026-03-15부터 광고 집행될 예정입니다/)).toBeInTheDocument();
  });

  it('닫기 버튼 클릭 시 onClose가 호출된다', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <SuccessDialog
        open={true}
        companyName="테스트회사"
        startDate="2026-03-15"
        onClose={onClose}
      />,
    );
    await user.click(screen.getByRole('button', { name: '닫기' }));
    expect(onClose).toHaveBeenCalled();
  });
});

describe('ErrorDialog', () => {
  it('열렸을 때 에러 제목과 메시지를 표시한다', () => {
    render(<ErrorDialog open={true} title="계약 등록 실패" message="중복 계약이 존재합니다." onClose={vi.fn()} />);
    expect(screen.getByText('계약 등록 실패')).toBeInTheDocument();
    expect(screen.getByText('중복 계약이 존재합니다.')).toBeInTheDocument();
  });

  it('닫기 버튼 클릭 시 onClose가 호출된다', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ErrorDialog open={true} title="오류" message="오류 발생" onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: '닫기' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('닫혀 있을 때 렌더링되지 않는다', () => {
    render(<ErrorDialog open={false} title="계약 등록 실패" message="오류 발생" onClose={vi.fn()} />);
    expect(screen.queryByText('계약 등록 실패')).not.toBeInTheDocument();
  });
});
