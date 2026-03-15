import PageLayout from '@/components/PageLayout';
import AdContractsContent from '@/components/AdContractsContent';
import { PAGES } from '@/constants/text';

export default function AdContractsPage() {
  return (
    <PageLayout title={PAGES.contracts.title} description={PAGES.contracts.description}>
      <AdContractsContent />
    </PageLayout>
  );
}
