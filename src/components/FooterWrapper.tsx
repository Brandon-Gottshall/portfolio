import { getLastCommitDate } from '@/lib/git-info';
import Footer from './Footer';

export default async function FooterWrapper() {
  const lastUpdated = getLastCommitDate();
  
  return (
    <footer className="bg-gray-dark pt-1">
      <div className="container mx-auto">
        <Footer lastUpdated={lastUpdated} />
      </div>
    </footer>
  );
} 