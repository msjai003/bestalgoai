
import { ArrowRight } from 'lucide-react';

interface BlogPostProps {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  imageAlt: string;
}

export const BlogPost = ({ title, excerpt, date, image, imageAlt }: BlogPostProps) => {
  return (
    <article className="bg-gray-800/50 rounded-xl overflow-hidden shadow-lg border border-gray-700">
      <img 
        className="w-full h-48 object-cover" 
        src={image}
        alt={imageAlt}
      />
      <div className="p-4">
        <div className="text-gray-400 text-sm mb-2">{date}</div>
        <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-400 mb-4">{excerpt}</p>
        <button className="text-[#FF00D4] font-medium flex items-center gap-2">
          Read More <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
};
