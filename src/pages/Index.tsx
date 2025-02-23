
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { BottomNav } from '@/components/BottomNav';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white pb-16">
      <Header />
      <Hero />
      <Features />
      <BottomNav />
    </div>
  );
};

export default Index;
