import PageLayout from '@/components/PageLayout';
import ContractResultContent from '@/components/ContractResultContent';
import { PAGES } from '@/constants/text';

interface ContractResultPageProps {
  params: { id: string };
  searchParams: { from?: string };
}

export default function ContractResultPage({ params, searchParams }: ContractResultPageProps) {
  return (
    <>
      <PageLayout title={PAGES.contractResult.title}>
        <ContractResultContent id={Number(params.id)} from={searchParams.from} />
      </PageLayout>
    </>
  );
}
