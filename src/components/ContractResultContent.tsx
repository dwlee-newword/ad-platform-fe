'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import api from '@/lib/api';
import { format } from 'date-fns';
import { Button } from './ui/button';
import { COMMON, CONTRACT_DETAIL, CONTRACT_RESULT, CONTRACT_STATUS_LABEL } from '@/constants/text';

import StatusMessage from './common/StatusMessage';
import { CancelContractDialog, ErrorDialog } from './ContractDialogs';

interface Contract {
  id: number;
  contractNumber: string;
  companyName: string;
  productName: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: string;
}

interface ContractResultContentProps {
  id: number;
  from?: string;
}

export default function ContractResultContent({ id, from }: ContractResultContentProps) {
  const router = useRouter();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelErrorOpen, setCancelErrorOpen] = useState(false);

  const isCancellable = contract !== null && ['PENDING', 'IN_PROGRESS'].includes(contract.status);

  async function handleCancelConfirm() {
    setCancelling(true);
    try {
      await api.post(`/api/contracts/${id}/cancel`);
      const res = await api.get<Contract>(`/api/contracts/${id}`);
      setContract(res.data);
      setCancelOpen(false);
    } catch (err) {
      setCancelOpen(false);
      if (axios.isAxiosError(err)) {
        setCancelError(err.response?.data?.message ?? COMMON.systemError);
      } else {
        setCancelError(COMMON.systemError);
      }
      setCancelErrorOpen(true);
    } finally {
      setCancelling(false);
    }
  }

  function handleBack() {
    if (from === 'contracts') {
      router.push('/contracts');
    } else {
      router.back();
    }
  }

  useEffect(() => {
    api
      .get<Contract>(`/api/contracts/${id}`)
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError(CONTRACT_DETAIL.notFound);
        } else {
          setError(COMMON.fetchError);
        }
      })
      .then((res) => {
        if (res) setContract(res.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <StatusMessage variant="loading" />;
  }

  if (error || !contract) {
    return <StatusMessage variant="error" message={error ?? COMMON.fetchError} />;
  }

  return (
    <>
      <CancelContractDialog
        open={cancelOpen}
        cancelling={cancelling}
        onCancel={() => setCancelOpen(false)}
        onConfirm={handleCancelConfirm}
      />
      <ErrorDialog
        open={cancelErrorOpen}
        title={CONTRACT_RESULT.cancelErrorModal.title}
        message={cancelError}
        onClose={() => setCancelErrorOpen(false)}
      />
      <div className="mt-4 w-[40%]">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-5 p-6">
            <Field label={CONTRACT_DETAIL.fields.contractNumber}>{contract.contractNumber}</Field>
            <Field label={CONTRACT_DETAIL.fields.company}>{contract.companyName}</Field>
            <Field label={CONTRACT_DETAIL.fields.productName}>{contract.productName}</Field>
            <Field label={CONTRACT_DETAIL.fields.period}>
              {format(new Date(contract.startDate), 'yyyy년 MM월 dd일')} ~{' '}
              {format(new Date(contract.endDate), 'yyyy년 MM월 dd일')}
            </Field>
            <Field label={CONTRACT_DETAIL.fields.amount}>
              {contract.amount.toLocaleString('ko-KR')}
            </Field>
            <Field label={CONTRACT_DETAIL.fields.status}>
              {CONTRACT_STATUS_LABEL[contract.status] ?? contract.status}
            </Field>
            <div className="flex justify-between pt-2">
              <Button
                type="button"
                variant="destructive"
                disabled={!isCancellable}
                onClick={() => setCancelOpen(true)}
              >
                {CONTRACT_RESULT.cancel}
              </Button>
              <Button type="button" variant="outline" onClick={handleBack}>
                {COMMON.back}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-sm text-gray-900">{children}</span>
    </div>
  );
}
