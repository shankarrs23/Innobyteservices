import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, User, Tag, ArrowLeft, Share2, ExternalLink, Heart, Edit, Zap, Eye, Database } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import CommentSection from '../components/CommentSection';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const { articles } = useNews();
  const { getPost, likePost } = useBlog();
  const { user } = useAuth();
  
  // Try to find the article in news first, then in blog posts
  const newsArticle = articles.find(a => a.id === id);
  const blogPost = id ? getPost(id) : null;
  
  const article = newsArticle || blogPost;
  const isNewsArticle = !!newsArticle;

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        {/* Cyber effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-red-400/20 rotate-45 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-cyan-400/20 animate-spin" style={{animationDuration: '20s'}}></div>
        </div>
        
        <div className="text-center glass-morph-dark border border-red-400/30 p-8 rounded-2xl relative z-10 max-w-md w-full mx-4">
          <div className="w-16 h-16 glass-morph-light border border-red-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="text-red-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold holographic mb-4 tracking-wider">DATA NOT FOUND</h1>
          <p className="text-gray-400 mb-8 tracking-wide">Neural transmission corrupted or does not exist in the network.</p>
          <Link
            to="/"
            className="cyber-button-primary inline-flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            <span className="tracking-wide">RETURN TO FEED</span>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('success', 'Neural transmission link copied to quantum clipboard.');
  };

  const handleLike = async () => {
    if (!user) {
      showToast('error', 'Neural link required to process feedback.');
      return;
    }
    
    if (!isNewsArticle) {
      try {
        await likePost(article.id);
        showToast('success', 'Neural feedback transmitted successfully.');
      } catch (error) {
        showToast('error', 'Failed to transmit neural feedback.');
      }
    }
  };

  const handleExternalLink = () => {
    if (isNewsArticle && article.url) {
      window.open(article.url, '_blank');
    }
  };

  const isAuthor = user && !isNewsArticle && article.author?.id === user.id;

  return (
    <div className="min-h-screen py-8 px-4 relative">
      {/* Cyber background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 border border-cyan-400/20 rotate-45 animate-pulse"></div>
        <div className="absolute top-60 right-20 w-16 h-16 border border-purple-400/20 animate-spin" style={{animationDuration: '30s'}}></div>
        <div className="absolute bottom-40 left-1/3 w-12 h-12 border border-pink-400/20 rotate-12 animate-bounce"></div>
        <div className="absolute top-1/4 right-0 w-full h-px bg-gradient-to-l from-transparent via-cyan-400/20 to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-400/20 to-transparent"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Navigation */}
        <div className="glass-morph-dark border border-cyan-400/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="cyber-button-ghost gap-2"
            >
              <ArrowLeft size={20} />
              <span className="tracking-wide">RETURN TO FEED</span>
            </Link>

            <div className="flex items-center gap-3">
              {/* Article Type Indicator */}
              <div className="flex items-center gap-2">
                {isNewsArticle ? (
                  <>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-blue-400 font-mono tracking-wide">EXTERNAL FEED</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400 font-mono tracking-wide">NEURAL TRANSMISSION</span>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="cyber-button-ghost p-2"
                  title="Share transmission"
                >
                  <Share2 size={18} />
                </button>

                {isNewsArticle && article.url && (
                  <button
                    onClick={handleExternalLink}
                    className="cyber-button-ghost p-2"
                    title="Open external source"
                  >
                    <ExternalLink size={18} />
                  </button>
                )}

                {isAuthor && (
                  <Link
                    to={`/edit-post/${article.id}`}
                    className="cyber-button-ghost p-2"
                    title="Edit transmission"
                  >
                    <Edit size={18} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="glass-morph-dark border border-purple-400/30 rounded-2xl overflow-hidden">
          {/* Hero Image */}
          {article.image && (
            <div className="relative">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              
              {/* Floating visual effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-4 w-8 h-8 border border-cyan-400/30 rotate-45 animate-pulse"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border border-purple-400/30 animate-spin" style={{animationDuration: '10s'}}></div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold holographic mb-6 leading-tight tracking-wider">
              {article.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8 font-mono">
              <div className="flex items-center gap-2">
                <User size={16} className="text-cyan-400" />
                <span className="tracking-wide">
                  {isNewsArticle ? (article.source || 'External Feed') : article.author?.name}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-purple-400" />
                <span className="tracking-wide">{formatDate(article.createdAt)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-pink-400" />
                <span className="tracking-wide">{article.readTime} min neural sync</span>
              </div>

              {!isNewsArticle && (
                <div className="flex items-center gap-2">
                  <Heart size={16} className="text-red-400" />
                  <span className="tracking-wide">{article.likes} neural feedback</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.map((tag, index) => (
                  <span key={index} className="cyber-tag">
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content Body */}
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 leading-relaxed text-lg">
                {isNewsArticle ? (
                  <div>
                    <p className="mb-6 text-cyan-400 font-medium tracking-wide">
                      EXTERNAL NEURAL FEED SUMMARY:
                    </p>
                    <p className="whitespace-pre-wrap">{article.content}</p>
                    {article.url && (
                      <div className="mt-8 p-4 glass-morph-light border border-blue-400/30 rounded-lg">
                        <p className="text-blue-400 font-medium mb-2 tracking-wide">ORIGINAL TRANSMISSION SOURCE:</p>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-mono break-all"
                        >
                          {article.url}
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{article.content}</div>
                )}
              </div>
            </div>

            {/* Interaction Bar */}
            <div className="mt-12 pt-8 border-t border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {!isNewsArticle && (
                    <button
                      onClick={handleLike}
                      disabled={!user}
                      className={`cyber-button-ghost gap-2 ${
                        article.liked ? 'text-pink-400 border-pink-400/50 bg-pink-400/10' : ''
                      }`}
                    >
                      <Heart size={18} className={article.liked ? 'fill-current' : ''} />
                      <span className="tracking-wide">
                        {article.liked ? 'FEEDBACK SENT' : 'SEND FEEDBACK'} ({article.likes})
                      </span>
                    </button>
                  )}

                  <button
                    onClick={handleShare}
                    className="cyber-button-ghost gap-2"
                  >
                    <Share2 size={18} />
                    <span className="tracking-wide">SHARE TRANSMISSION</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
                  <Eye size={16} />
                  <span className="tracking-wide">{article.views || 0} neural views</span>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section - Only for blog posts */}
        {!isNewsArticle && (
          <div className="mt-8">
            <CommentSection postId={article.id} />
          </div>
        )}

        {/* Related Articles Suggestions */}
        <div className="mt-12 glass-morph-dark border border-cyan-400/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-cyber mb-4 tracking-wider">RELATED NEURAL TRANSMISSIONS</h3>
          <p className="text-gray-400 text-center py-8 font-mono tracking-wide">
            Neural correlation algorithm initializing...
          </p>
        </div>
      </div>
    </div>
  );
}
