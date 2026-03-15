import PageLayout from '@/components/PageLayout';
import { PAGES } from '@/constants/text';

export default function Home() {
  return <PageLayout title={PAGES.home.title} description={PAGES.home.description} />;
}
