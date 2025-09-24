import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Edit, Trash2, Plus, Search, Filter, Eye, EyeOff, Heart, Zap, Database, Cpu } from 'lucide-react';
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
          <h1 className="text-3xl font-bold holographic mb-4 tracking-wider">ACCESS DENIED</h1>
          <p className="text-gray-400 mb-8 tracking-wide">Neural link required to access personal data vault.</p>
          <Link
            to="/login"
            className="cyber-button-primary inline-flex items-center gap-2"
          >
            INITIATE CONNECTION
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

  const handleDeletePost = async (postId: string, postTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${postTitle}"? This action cannot be undone.`)) {
      try {
        await deletePost(postId);
        showToast('success', 'Neural data purged from network successfully.');
      } catch (error) {
        showToast('error', 'Data purge failed. Network protection protocols active.');
      }
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await likePost(postId);
    } catch (error) {
      showToast('error', 'Unable to process neural feedback at this time.');
    }
  };

  const stats = {
    total: userPosts.length,
    published: userPosts.filter(p => p.published).length,
    drafts: userPosts.filter(p => !p.published).length,
    totalLikes: userPosts.reduce((sum, post) => sum + post.likes, 0)
  };

  return (
    <div className="min-h-screen py-8 px-4 relative">
      {/* Cyber background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-16 h-16 border border-cyan-400/20 rotate-45 animate-pulse"></div>
        <div className="absolute top-60 right-10 w-20 h-20 border border-purple-400/20 animate-spin" style={{animationDuration: '25s'}}></div>
        <div className="absolute bottom-40 left-1/3 w-12 h-12 border border-pink-400/20 rotate-12 animate-bounce"></div>
        <div className="absolute top-1/3 right-0 w-full h-px bg-gradient-to-l from-transparent via-cyan-400/20 to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-400/20 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="glass-morph-dark border border-cyan-400/30 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold holographic mb-2 tracking-wider">NEURAL DATA VAULT</h1>
              <p className="text-gray-400 tracking-wide">Personal neural transmission archive</p>
            </div>
            
            <Link
              to="/create-post"
              className="cyber-button-primary gap-2 lg:self-start"
            >
              <Plus size={20} />
              <span className="tracking-wide">CREATE TRANSMISSION</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-morph-dark border border-cyan-400/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Database className="text-cyan-400" size={24} />
              <div>
                <p className="text-2xl font-bold text-cyan-400">{stats.total}</p>
                <p className="text-sm text-gray-400 tracking-wide">Total Records</p>
              </div>
            </div>
          </div>
          
          <div className="glass-morph-dark border border-green-400/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Zap className="text-green-400" size={24} />
              <div>
                <p className="text-2xl font-bold text-green-400">{stats.published}</p>
                <p className="text-sm text-gray-400 tracking-wide">Live Transmissions</p>
              </div>
            </div>
          </div>
          
          <div className="glass-morph-dark border border-yellow-400/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Cpu className="text-yellow-400" size={24} />
              <div>
                <p className="text-2xl font-bold text-yellow-400">{stats.drafts}</p>
                <p className="text-sm text-gray-400 tracking-wide">Cached Drafts</p>
              </div>
            </div>
          </div>
          
          <div className="glass-morph-dark border border-pink-400/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Heart className="text-pink-400" size={24} />
              <div>
                <p className="text-2xl font-bold text-pink-400">{stats.totalLikes}</p>
                <p className="text-sm text-gray-400 tracking-wide">Neural Feedback</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="glass-morph-dark border border-purple-400/30 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400/70" size={18} />
              <input
                type="text"
                placeholder="Search neural archives..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="cyber-input pl-10"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="cyber-input pr-10 appearance-none cursor-pointer"
              >
                <option value="newest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Neural Signature A-Z</option>
                <option value="likes">Feedback Rating</option>
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400/70 pointer-events-none" size={18} />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All Data', color: 'cyan' },
                { value: 'published', label: 'Live', color: 'green' },
                { value: 'draft', label: 'Cached', color: 'yellow' }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilterBy(filter.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-300 ${
                    filterBy === filter.value
                      ? `bg-${filter.color}-400/20 text-${filter.color}-400 border border-${filter.color}-400/50`
                      : 'bg-gray-400/10 text-gray-400 border border-gray-400/30 hover:bg-gray-400/20'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="glass-morph-dark border border-gray-400/30 rounded-2xl p-12 text-center">
            <Database className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-400 mb-2 tracking-wide">No Neural Data Found</h3>
            <p className="text-gray-500 mb-6 tracking-wide">
              {searchTerm || filterBy !== 'all' 
                ? 'No transmissions match your search criteria.'
                : 'Your neural vault is empty. Begin your first transmission.'}
            </p>
            {(!searchTerm && filterBy === 'all') && (
              <Link
                to="/create-post"
                className="cyber-button-primary gap-2"
              >
                <Plus size={20} />
                <span className="tracking-wide">CREATE FIRST TRANSMISSION</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="glass-morph-dark border border-cyan-400/30 rounded-2xl overflow-hidden group hover:border-cyan-400/50 transition-all duration-300"
              >
                {/* Status Indicator */}
                <div className="p-4 border-b border-cyan-400/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {post.published ? (
                        <>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-400 font-mono tracking-wide">LIVE TRANSMISSION</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <span className="text-xs text-yellow-400 font-mono tracking-wide">LOCAL CACHE</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 font-mono">
                      <Heart size={12} />
                      {post.likes}
                    </div>
                  </div>
                </div>

                {/* Image */}
                {post.image && (
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-cyber mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300 tracking-wide">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-mono">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.readTime} min read
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="cyber-tag text-xs">
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-gray-400 font-mono">+{post.tags.length - 3}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/post/${post.id}`}
                      className="cyber-button-ghost flex-1 text-center gap-2 text-xs"
                    >
                      <Eye size={14} />
                      <span className="tracking-wide">VIEW</span>
                    </Link>
                    
                    <Link
                      to={`/edit-post/${post.id}`}
                      className="cyber-button-ghost px-3 py-2"
                    >
                      <Edit size={14} />
                    </Link>
                    
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className="cyber-button-ghost px-3 py-2"
                    >
                      <Heart size={14} className={post.liked ? 'text-pink-400 fill-current' : ''} />
                    </button>
                    
                    <button
                      onClick={() => handleDeletePost(post.id, post.title)}
                      className="cyber-button-ghost px-3 py-2 text-red-400 border-red-400/30 hover:bg-red-400/10 hover:border-red-400/50"
                    >
                      <Trash2 size={14} />
                    </button>
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
