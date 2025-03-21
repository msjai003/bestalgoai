
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
    <article className="pro-card overflow-hidden shadow-lg">
      <div className="overflow-hidden">
        <img 
          className="w-full h-48 object-cover transition-transform duration-700 hover:scale-110 img-hover-shine image-hifi" 
          src={image}
          alt={imageAlt}
        />
      </div>
      <div className="p-6">
        <div className="text-gray-400 text-sm mb-2">{date}</div>
        <h2 className="text-xl font-bold text-white mb-2 transition-colors duration-300 hover:text-pink-400">{title}</h2>
        <p className="text-gray-400 mb-4">{excerpt}</p>
        <button className="text-[#FF00D4] font-medium flex items-center gap-2 group transition-all duration-300 hover:gap-3">
          Read More <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </article>
  );
};
