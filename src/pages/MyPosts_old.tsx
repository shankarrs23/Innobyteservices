import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Edit, Trash2, Plus, Search, Filter, Eye, EyeOff, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useBlog } from '../context/BlogContext';

export default function MyPosts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all'); // all, published, draft
  const { user } = useAuth();
  const { showToast } = useToast();
  const { posts, deletePost, likePost } = useBlog();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">Please log in to view your posts.</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  // Filter user's posts only
  const userPosts = posts.filter(post => post.author.id === user.id);

  const filteredPosts = userPosts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterBy === 'all' || 
        (filterBy === 'published' && post.published) ||
        (filterBy === 'draft' && !post.published);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'likes':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDeletePost = async (postId: string, postTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${postTitle}"? This action cannot be undone.`)) {
      try {
        await deletePost(postId);
        showToast('success', 'Post deleted successfully!');
      } catch (error) {
        showToast('error', 'Failed to delete post. Please try again.');
      }
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await likePost(postId);
      showToast('success', 'Post liked!');
    } catch (error) {
      showToast('error', 'Failed to like post. Please try again.');
    }
  };

  const publishedCount = userPosts.filter(post => post.published).length;
  const draftCount = userPosts.filter(post => !post.published).length;
  const totalLikes = userPosts.reduce((acc, post) => acc + post.likes, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Posts</h1>
            <p className="text-gray-600">Manage and track your published articles</p>
          </div>
          
          <Link
            to="/create-post"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold mt-4 md:mt-0"
          >
            <Plus size={20} />
            Create New Post
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Edit className="text-indigo-600" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{userPosts.length}</h3>
                <p className="text-gray-600">Total Posts</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{publishedCount}</h3>
                <p className="text-gray-600">Published</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <EyeOff className="text-yellow-600" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{draftCount}</h3>
                <p className="text-gray-600">Drafts</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{totalLikes}</h3>
                <p className="text-gray-600">Total Likes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search your posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="text-gray-500" size={18} />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Posts</option>
                  <option value="published">Published Only</option>
                  <option value="draft">Drafts Only</option>
                </select>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
                <option value="likes">Most Liked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts List */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
              <Edit className="text-indigo-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {searchTerm ? 'No posts found' : 'No posts yet'}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm 
                ? 'Try adjusting your search terms to find what you\'re looking for.'
                : 'Start sharing your thoughts and expertise with the world by creating your first post.'
              }
            </p>
            {!searchTerm && (
              <Link
                to="/create-post"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                <Plus size={20} />
                Create Your First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="md:flex">
                  {/* Image */}
                  {post.image && (
                    <div className="md:w-64 h-48 md:h-auto">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col h-full">
                      {/* Status Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {post.published ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                              <Eye size={12} />
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                              <EyeOff size={12} />
                              Draft
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        <Link 
                          to={`/post/${post.id}`}
                          className="hover:text-indigo-600 transition-colors duration-200"
                        >
                          {post.title}
                        </Link>
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 mb-4 line-clamp-2 flex-1">
                        {post.excerpt}
                      </p>

                      {/* Meta and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{post.readTime} min read</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart size={14} />
                            <span>{post.likes} likes</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleLikePost(post.id)}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                          >
                            <Heart size={16} />
                            Like
                          </button>
                          <Link
                            to={`/edit-post/${post.id}`}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                          >
                            <Edit size={16} />
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post.id, post.title)}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}