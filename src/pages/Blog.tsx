
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { BlogPost } from '@/components/BlogPost';
import { Button } from '@/components/ui/button';

const categories = [
  { id: 'all', name: 'All Posts', active: true },
  { id: 'strategy', name: 'Strategy', active: false },
  { id: 'market', name: 'Market Analysis', active: false },
  { id: 'news', name: 'News', active: false }
];

const posts = [
  {
    id: 1,
    title: 'Advanced Algo Trading Strategies for Indian Markets',
    excerpt: 'Discover how machine learning algorithms are revolutionizing trading in Indian stock markets...',
    date: 'March 15, 2025',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/06648f16e6-ec264beedb8b74d85936.png',
    imageAlt: 'modern trading dashboard with charts and data visualization, dark theme'
  },
  {
    id: 2,
    title: 'Risk Management in Automated Trading',
    excerpt: 'Essential risk management techniques for successful algorithmic trading...',
    date: 'March 12, 2025',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/92ae93934d-b47c5fc154c4257c63b9.png',
    imageAlt: 'financial technology concept with digital graphs and AI, dark theme'
  }
];

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white pb-16">
      <Header />
      <main className="pt-16 px-4">
        <section className="py-8">
          <h1 className="text-3xl font-bold mb-2">Trading Insights</h1>
          <p className="text-gray-400">Latest updates on algo trading strategies and market analysis</p>
        </section>

        <section className="mb-6">
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={category.active ? "default" : "secondary"}
                className={`whitespace-nowrap px-4 py-2 rounded-full ${
                  category.active
                    ? "bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/70 text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </section>

        <section className="space-y-6 pb-20">
          {posts.map((post) => (
            <BlogPost key={post.id} {...post} />
          ))}
        </section>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default BlogPage;
