import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, User, Tag, ArrowLeft, Share2, ExternalLink, Heart, Edit } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or may have expired.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            Back to Home
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
    showToast('success', 'Article link copied to clipboard!');
  };

  const handleLike = async () => {
    if (isNewsArticle) {
      showToast('success', 'Thanks for liking this article!');
    } else if (blogPost) {
      try {
        await likePost(blogPost.id);
        showToast('success', 'Post liked!');
      } catch (error) {
        showToast('error', 'Failed to like post. Please try again.');
      }
    }
  };

  const handleReadOriginal = () => {
    if (isNewsArticle && 'url' in article) {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  const canEdit = user && blogPost && blogPost.author.id === user.id;

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      {article.image && (
        <div className="relative h-96 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          
          {/* Back Button */}
          <Link
            to="/"
            className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg hover:bg-white transition-all duration-200 shadow-lg"
          >
            <ArrowLeft size={20} />
            Back to News
          </Link>

          {/* Action Buttons */}
          <div className="absolute top-8 right-8 flex gap-3">
            <button
              onClick={handleShare}
              className="p-3 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg hover:bg-white transition-all duration-200 shadow-lg"
              title="Share article"
            >
              <Share2 size={20} />
            </button>
            {canEdit && (
              <Link
                to={`/edit-post/${blogPost.id}`}
                className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-lg"
                title="Edit post"
              >
                <Edit size={20} />
              </Link>
            )}
            {isNewsArticle && (
              <button
                onClick={handleReadOriginal}
                className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-lg"
                title="Read original article"
              >
                <ExternalLink size={20} />
              </button>
            )}
            <button
              onClick={handleLike}
              className="p-3 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg hover:bg-white transition-all duration-200 shadow-lg"
              title="Like article"
            >
              <Heart size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Article Header */}
        <header className="mb-8">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-lg"
              />
              <div>
                <div className="flex items-center gap-2 text-base font-semibold text-gray-900">
                  <User size={16} />
                  {article.author.name}
                </div>
                <div className="text-sm text-gray-500">
                  {isNewsArticle ? `Source: ${article.source}` : 'Blog Post'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(article.createdAt)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{article.readTime} min read</span>
            </div>

            {blogPost && (
              <div className="flex items-center gap-2">
                <Heart size={16} />
                <span>{blogPost.likes} likes</span>
              </div>
            )}

            {blogPost && !blogPost.published && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                Draft
              </span>
            )}
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg prose-indigo max-w-none">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            {/* Overview Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {isNewsArticle ? 'Article Overview' : 'Article Content'}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {article.excerpt}
              </p>
            </div>

            {/* Full Content for Blog Posts */}
            {blogPost && article.content && (
              <div className="mb-8">
                <div className="text-gray-700 leading-relaxed prose max-w-none">
                  {article.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph || <br />}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Content Preview for News Articles */}
            {isNewsArticle && article.content && article.content.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Content Preview</h3>
                <div className="text-gray-700 leading-relaxed">
                  {article.content.length > 500 
                    ? `${article.content.substring(0, 500)}...` 
                    : article.content}
                </div>
              </div>
            )}

            {/* Call to Action for News Articles */}
            {isNewsArticle && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Want to read the full article?</h3>
                    <p className="text-gray-600">Visit the original source for the complete story and more details.</p>
                  </div>
                  <button
                    onClick={handleReadOriginal}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                  >
                    <ExternalLink size={20} />
                    Read Original Article
                  </button>
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Source Information - Only for News Articles */}
        {isNewsArticle && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8 border border-indigo-100">
            <div className="flex items-start gap-4">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-lg"
              />
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Source: {isNewsArticle ? article.source : 'Blog Post'}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {isNewsArticle 
                    ? `This article was originally published by ${article.source}. Click "Read Original Article" to view the complete story on their website.`
                    : 'This is a blog post published on our platform.'
                  }
                </p>
                {isNewsArticle && (
                  <div className="flex gap-3 mt-4">
                    <button 
                      onClick={handleReadOriginal}
                      className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                    >
                      Visit Source Website
                    </button>
                    <button className="text-gray-500 hover:text-gray-600 font-medium text-sm">
                      More from {article.source}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Comments Section - Only for Blog Posts */}
        {blogPost && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Comments ({blogPost.comments.length})</h3>
            <CommentSection postId={blogPost.id} comments={blogPost.comments} />
          </div>
        )}

        {/* Related Articles */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {isNewsArticle ? 'Related News' : 'Related Posts'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(isNewsArticle ? articles : [])
              .filter(a => a.id !== article.id && a.tags.some(tag => article.tags.includes(tag)))
              .slice(0, 2)
              .map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  to={`/post/${relatedArticle.id}`}
                  className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                >
                  {relatedArticle.image && (
                    <img
                      src={relatedArticle.image}
                      alt={relatedArticle.title}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
                    />
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
                      {relatedArticle.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {relatedArticle.readTime} min read • {isNewsArticle && 'source' in relatedArticle ? relatedArticle.source : 'Blog Post'}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
          {(isNewsArticle ? articles : []).filter(a => a.id !== article.id && a.tags.some(tag => article.tags.includes(tag))).length === 0 && (
            <p className="text-gray-500 text-center py-4">No related articles found.</p>
          )}
        </div>

        {/* Back to Top / Navigation */}
        <div className="text-center">
          <Link
            to={isNewsArticle ? "/" : "/my-posts"}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            {isNewsArticle ? 'Back to All News' : 'Back to My Posts'}
          </Link>
        </div>
      </div>
    </div>
  );
}