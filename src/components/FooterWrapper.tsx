import { getLastCommitDate } from '@/lib/git-info';
import Footer from './Footer';

export default async function FooterWrapper() {
  const lastUpdated = getLastCommitDate();
  
  return <Footer lastUpdated={lastUpdated} />;
} 