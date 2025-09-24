import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag, ExternalLink } from 'lucide-react';
import { NewsArticle } from '../services/newsApi';
import { BlogPost } from '../context/BlogContext';

interface PostCardProps {
  post: NewsArticle | BlogPost;
}

export default function PostCard({ post }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Check if post is a NewsArticle (has url and source properties)
  const isNewsArticle = 'url' in post && 'source' in post;

  return (
    <article className="glass-morph-dark rounded-xl shadow-2xl hover:shadow-cyan-400/20 transform hover:-translate-y-2 transition-all duration-500 overflow-hidden group border border-cyan-400/20 hover:border-cyan-400/40 relative">
      {/* Holographic border effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10"></div>
      
      {/* Scan lines overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      {/* Image */}
      {post.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Floating particles effect */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-70"></div>
          <div className="absolute top-8 right-6 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-60"></div>
          <div className="absolute bottom-6 right-4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse opacity-50"></div>
        </div>
      )}

      <div className="p-6 relative z-10">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 rounded-full border border-cyan-400/30 hover:border-cyan-400/50 transition-colors duration-300 text-cyber backdrop-blur-sm"
            >
              <Tag size={10} className="animate-pulse" />
              {tag}
            </span>
          ))}
          {post.tags.length > 2 && (
            <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full border border-gray-600/30 text-cyber">
              +{post.tags.length - 2} more
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-100 mb-4 line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300 text-futuristic leading-tight">
          <Link to={`/post/${post.id}`} className="hover:neon-text">
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-300 mb-6 line-clamp-3 leading-relaxed text-futuristic">
          {post.excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-cyan-400/30"
                />
                <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-sm"></div>
              </div>
              <span className="font-medium text-futuristic">{post.author.name}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar size={14} className="text-cyan-400" />
              <span className="text-cyber">{formatDate(post.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Clock size={14} className="text-purple-400" />
            <span className="text-cyber">{post.readTime} min read</span>
          </div>
        </div>

        {/* Read More Button */}
        <div className="flex items-center justify-between mt-4">
          <Link
            to={`/post/${post.id}`}
            className="cyber-btn inline-flex items-center px-4 py-2 text-cyan-400 hover:text-white font-medium group/link bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/30 hover:border-cyan-300 rounded-lg transition-all duration-300 text-futuristic"
          >
            <span className="mr-2">ACCESS DATA</span>
            <svg 
              className="w-4 h-4 transition-transform group-hover/link:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          {/* Original Source Link - Only for News Articles */}
          {isNewsArticle && (
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-gray-400 hover:text-cyan-400 font-medium text-sm transition-colors duration-300 text-cyber"
            >
              <ExternalLink size={14} className="animate-pulse" />
              <span>SOURCE</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}