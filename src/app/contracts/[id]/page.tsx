import PageLayout from '@/components/PageLayout';
import ContractDetailContent from '@/components/ContractDetailContent';
import { PAGES } from '@/constants/text';

interface ContractDetailPageProps {
  params: { id: string };
}

export default function ContractDetailPage({ params }: ContractDetailPageProps) {
  return (
    <>
      <PageLayout title={PAGES.contractDetail.title}>
        <ContractDetailContent id={Number(params.id)} />
      </PageLayout>
    </>
  );
}
