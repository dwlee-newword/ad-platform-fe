'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import axios from 'axios';
import api from '@/lib/api';
import { Button } from './ui/button';
import { COMMON, CONTRACT_DETAIL, CONTRACT_FORM } from '@/constants/text';
import StatusMessage from './common/StatusMessage';

const USER_ERROR_CODES = ['DUPLICATE_CONTRACT', 'PRODUCT_NOT_FOUND'];
import { TodayWarningDialog, ConfirmDialog, ErrorDialog, SuccessDialog } from './ContractDialogs';
import CompanyAutocomplete from './common/CompanyAutocomplete';
import { Textarea } from './ui/textarea';
import DateRangePicker from './common/DateRangePicker';

interface Product {
  id: number;
  name: string;
  description: string;
}

interface ContractDetailContentProps {
  id: number;
}

export default function ContractDetailContent({ id }: ContractDetailContentProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [todayWarningOpen, setTodayWarningOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [successData, setSuccessData] = useState<{
    contractId: number;
    companyName: string;
    startDate: string;
  } | null>(null);

  const [companyId, setCompanyId] = useState<string>('');
  const today = format(new Date(), 'yyyy-MM-dd');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [amount, setAmount] = useState('');

  function handleAmountChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const digits = e.target.value.replace(/[^0-9]/g, '');
    if (digits === '') {
      setAmount('');
      return;
    }
    setAmount(Number(digits).toLocaleString('ko-KR'));
  }

  const amountNumber = Number(amount.replace(/,/g, ''));
  const amountError =
    amount !== '' && (amountNumber < 10_000 || amountNumber > 1_000_000)
      ? CONTRACT_FORM.errors.amountRange
      : null;

  const isSubmittable =
    companyId !== '' &&
    product !== null &&
    startDate !== '' &&
    endDate !== '' &&
    amount !== '' &&
    amountError === null;

  async function handleSubmit() {
    if (!product) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { data } = await api.post<{ id: number; companyName: string; startDate: string }>(
        '/api/contracts',
        {
          companyId: Number(companyId),
          productId: product.id,
          startDate,
          endDate,
          amount: amountNumber,
        },
      );
      setConfirmOpen(false);
      setSuccessData({
        contractId: data.id,
        companyName: data.companyName,
        startDate: format(new Date(data.startDate), 'yyyy년 MM월 dd일'),
      });
    } catch (err) {
      setConfirmOpen(false);
      if (axios.isAxiosError(err)) {
        const code = err.response?.data?.code;
        if (code && USER_ERROR_CODES.includes(code)) {
          setSubmitError(err.response!.data.message);
        } else {
          setSubmitError(COMMON.systemError);
        }
      } else {
        setSubmitError(COMMON.systemError);
      }
      setErrorModalOpen(true);
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    api
      .get<Product>(`/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError(CONTRACT_FORM.errors.productNotFound);
        } else {
          setError(COMMON.fetchError);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <StatusMessage variant="loading" />;
  }

  if (error || !product) {
    return <StatusMessage variant="error" message={error ?? CONTRACT_FORM.errors.productNotFound} />;
  }

  return (
    <>
      <TodayWarningDialog
        open={todayWarningOpen}
        onCancel={() => setTodayWarningOpen(false)}
        onConfirm={() => {
          setTodayWarningOpen(false);
          setConfirmOpen(true);
        }}
      />
      <ConfirmDialog
        open={confirmOpen}
        submitting={submitting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleSubmit}
      />
      <ErrorDialog
        open={errorModalOpen}
        title={CONTRACT_FORM.submitErrorModal.title}
        message={submitError}
        onClose={() => setErrorModalOpen(false)}
      />
      <SuccessDialog
        open={successData !== null}
        companyName={successData?.companyName ?? ''}
        startDate={successData?.startDate ?? ''}
        onClose={() => {
          const id = successData!.contractId;
          setSuccessData(null);
          router.push(`/results/${id}?from=contracts`);
        }}
      />
      <div className="flex min-h-[calc(100vh-160px)] flex-col">
        <div className="mt-4 flex w-[40%] flex-col gap-6">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-5 p-6">
              {/* 업체명 */}
              <Field label={CONTRACT_FORM.fields.company}>
                <CompanyAutocomplete
                  value={companyId}
                  onValueChange={(id) => setCompanyId(id)}
                  placeholder={CONTRACT_FORM.placeholders.company}
                />
              </Field>

              {/* 상품 */}
              <Field label={CONTRACT_FORM.fields.product}>
                <Textarea
                  readOnly
                  value={product.name}
                  rows={1}
                  className="min-h-0 resize-none bg-gray-50 text-gray-700 focus-visible:ring-0"
                />
              </Field>

              {/* 계약 기간 */}
              <Field label={CONTRACT_DETAIL.periodLabel}>
                <DateRangePicker
                  onStartChange={setStartDate}
                  onEndChange={setEndDate}
                  placeholder={CONTRACT_FORM.placeholders.date}
                  disablePastStart
                />
              </Field>

              {/* 계약 금액 */}
              <Field label={CONTRACT_FORM.fields.amount}>
                <Textarea
                  value={amount}
                  onChange={handleAmountChange}
                  rows={1}
                  placeholder={CONTRACT_FORM.placeholders.amount}
                  className="min-h-0 resize-none"
                />
                {amountError && <p className="text-xs text-red-500">{amountError}</p>}
              </Field>
            </div>
            {/* 계약 버튼 */}
            <div className="flex justify-end border-gray-200 px-6 py-4">
              <Button
                type="button"
                disabled={!isSubmittable || submitting}
                onClick={() =>
                  startDate === today ? setTodayWarningOpen(true) : setConfirmOpen(true)
                }
              >
                {CONTRACT_FORM.submit}
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
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}
