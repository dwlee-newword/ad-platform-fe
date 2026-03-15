import PageLayout from '@/components/PageLayout';
import AdStatusContent from '@/components/AdStatusContent';
import { PAGES } from '@/constants/text';

export default function AdStatusPage() {
  return (
    <PageLayout title={PAGES.status.title} description={PAGES.status.description}>
      <AdStatusContent />
    </PageLayout>
  );
}
