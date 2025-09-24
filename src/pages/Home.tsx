import { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Clock, BookOpen, RefreshCw, Loader, Globe } from 'lucide-react';
import PostCard from '../components/PostCard';
import { useNews } from '../context/NewsContext';
import { useBlog } from '../context/BlogContext';
import { NEWS_CATEGORIES, NEWS_COUNTRIES } from '../services/newsApi';

export default function Home() {
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [contentType, setContentType] = useState<'news' | 'blogs' | 'all'>('news');
  
  const { 
    articles, 
    loading, 
    error, 
    selectedCategory, 
    selectedCountry,
    lastUpdated,
    refreshNews, 
    loadNewsByCategory, 
    loadNewsByCountry,
    searchArticles,
    clearSearch
  } = useNews();

  const { posts: blogPosts } = useBlog();

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearchTerm.trim() && contentType === 'news') {
        searchArticles(localSearchTerm);
      } else if (!localSearchTerm.trim() && contentType === 'news') {
        clearSearch();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localSearchTerm, contentType]);

  // Combine and filter content based on type
  const getFilteredContent = () => {
    let content = [];
    
    if (contentType === 'news') {
      content = articles;
    } else if (contentType === 'blogs') {
      content = blogPosts.filter(post => post.published);
    } else {
      // Combine both news and published blog posts
      content = [...articles, ...blogPosts.filter(post => post.published)];
    }

    // Apply search filter for blog posts
    if (localSearchTerm.trim() && (contentType === 'blogs' || contentType === 'all')) {
      content = content.filter(item => 
        item.title.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(localSearchTerm.toLowerCase())
      );
    }

    // Apply tag filter
    if (selectedTag) {
      content = content.filter(item => item.tags.includes(selectedTag));
    }

    // Sort content
    return content.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'readTime':
          return a.readTime - b.readTime;
        default:
          return 0;
      }
    });
  };

  const filteredContent = getFilteredContent();
  
  // Get all unique tags from both sources
  const allTags = Array.from(new Set([
    ...articles.flatMap(post => post.tags),
    ...blogPosts.filter(post => post.published).flatMap(post => post.tags)
  ]));

  return (
    <div className="min-h-screen cyber-grid">
      {/* Matrix Background */}
      <div className="matrix-bg">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="matrix-char"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              fontSize: `${12 + Math.random() * 8}px`,
            }}
          >
            {String.fromCharCode(0x30A0 + Math.random() * 96)}
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-cyber-dark via-cyber-gray to-cyber-light overflow-hidden scan-lines">
        <div className="absolute inset-0 circuit-bg opacity-30"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full mix-blend-screen filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full mix-blend-screen filter blur-xl opacity-30 animate-float-reverse"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-neon-green to-neon-blue rounded-full mix-blend-screen filter blur-xl opacity-30 animate-float"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 px-6 py-3 glass-morph-neon rounded-full text-neon-blue text-sm font-cyber mb-8 animate-pulse-neon">
            <div className="w-3 h-3 bg-neon-green rounded-full animate-neon-pulse shadow-neon"></div>
            <TrendingUp size={16} className="animate-float" />
            <span className="holographic">LIVE NEURAL FEED</span>
            <span className="text-white/80">from {NEWS_COUNTRIES.find(c => c.code === selectedCountry)?.name || 'Global Network'}</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-cyber font-black mb-8 leading-tight">
            <span className="neon-text-blue block mb-4">NEURAL</span>
            <span className="holographic block text-7xl md:text-9xl">FEED</span>
          </h1>
          
          <p className="text-xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed font-futuristic">
            Interface with the global information matrix. 
            <span className="text-neon-blue">Real-time neural data streams</span> from 
            <span className="holographic font-semibold"> {NEWS_COUNTRIES.find(c => c.code === selectedCountry)?.name || 'your selected node'}</span> 
            and quantum-encrypted networks worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="cyber-btn cyber-btn-primary px-10 py-4 rounded-lg font-cyber text-lg transform hover:scale-105 transition-all duration-300 shadow-cyber">
              <span className="flex items-center gap-3 justify-center">
                <BookOpen size={24} className="animate-float" />
                INITIALIZE FEED
              </span>
            </button>
            
            {/* Enhanced Country Switcher */}
            <div className="hud-element flex items-center gap-4 px-8 py-4 glass-morph-dark rounded-lg">
              <Globe className="text-neon-blue animate-float" size={24} />
              <select
                value={selectedCountry}
                onChange={(e) => loadNewsByCountry(e.target.value)}
                className="bg-transparent text-neon-blue border-none outline-none cursor-pointer font-cyber text-lg"
              >
                {NEWS_COUNTRIES.map(country => (
                  <option key={country.code} value={country.code} className="bg-cyber-dark text-white">
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Search and Filter Section */}
      <section className="py-12 px-4 bg-cyber-dark relative">
        <div className="absolute inset-0 scan-lines opacity-50"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="glass-morph-dark rounded-2xl p-8 border border-neon-blue/20">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Enhanced Search */}
              <div className="relative flex-1 max-w-md group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neon-blue group-focus-within:animate-float" size={20} />
                <input
                  type="text"
                  placeholder="NEURAL SEARCH INTERFACE..."
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-cyber-gray/50 border border-neon-blue/30 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-neon-blue transition-all duration-300 text-white placeholder-white/50 font-mono data-stream"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-neon-blue/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Enhanced Filters */}
              <div className="flex gap-6 items-center flex-wrap">
                {/* Content Type Filter */}
                <div className="hud-element flex items-center gap-3 px-4 py-3 rounded-lg">
                  <BookOpen className="text-neon-purple animate-float" size={20} />
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value as 'news' | 'blogs' | 'all')}
                    className="bg-transparent text-neon-blue border-none outline-none cursor-pointer font-cyber"
                  >
                    <option value="news" className="bg-cyber-dark">NEURAL FEED</option>
                    <option value="blogs" className="bg-cyber-dark">USER LOGS</option>
                    <option value="all" className="bg-cyber-dark">ALL DATA</option>
                  </select>
                </div>

                {/* Enhanced Country Filter */}
                {(contentType === 'news' || contentType === 'all') && (
                  <div className="hud-element flex items-center gap-3 px-4 py-3 rounded-lg">
                    <Globe className="text-neon-green animate-float" size={20} />
                    <select
                      value={selectedCountry}
                      onChange={(e) => loadNewsByCountry(e.target.value)}
                      className="bg-transparent text-neon-blue border-none outline-none cursor-pointer font-cyber"
                    >
                      {NEWS_COUNTRIES.map(country => (
                        <option key={country.code} value={country.code} className="bg-cyber-dark">{country.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Enhanced Tag Filter */}
                <div className="hud-element flex items-center gap-3 px-4 py-3 rounded-lg">
                  <Filter className="text-neon-pink animate-float" size={20} />
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="bg-transparent text-neon-blue border-none outline-none cursor-pointer font-cyber"
                  >
                    <option value="" className="bg-cyber-dark">ALL TOPICS</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag} className="bg-cyber-dark">{tag.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                {/* Enhanced Sort Filter */}
                <div className="hud-element flex items-center gap-3 px-4 py-3 rounded-lg">
                  <Clock className="text-neon-green animate-float" size={20} />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-neon-blue border-none outline-none cursor-pointer font-cyber"
                  >
                    <option value="newest" className="bg-cyber-dark">LATEST</option>
                    <option value="oldest" className="bg-cyber-dark">ARCHIVE</option>
                    <option value="readTime" className="bg-cyber-dark">QUICK ACCESS</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Content Grid */}
      <section className="py-16 px-4 bg-cyber-gray relative">
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          {loading && contentType === 'news' ? (
            <div className="text-center py-20">
              <div className="glass-morph-neon inline-flex items-center gap-4 px-8 py-6 rounded-2xl">
                <div className="loading-spinner"></div>
                <span className="text-neon-blue font-cyber text-lg loading-dots">NEURAL SYNC IN PROGRESS</span>
              </div>
            </div>
          ) : error && contentType === 'news' ? (
            <div className="text-center py-20">
              <div className="glass-morph-dark rounded-2xl p-12 border border-neon-pink/30">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center border-2 border-neon-pink animate-neon-pulse">
                  <RefreshCw className="text-neon-pink animate-float" size={32} />
                </div>
                <h3 className="text-2xl font-cyber text-neon-pink mb-4">NEURAL FEED DISRUPTION</h3>
                <p className="text-white/70 max-w-md mx-auto mb-8 font-futuristic">{error}</p>
                <button
                  onClick={refreshNews}
                  className="cyber-btn cyber-btn-secondary px-6 py-3 rounded-lg font-cyber"
                >
                  REINITIALIZE CONNECTION
                </button>
              </div>
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="text-center py-20">
              <div className="glass-morph-dark rounded-2xl p-12 border border-neon-blue/30">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center border-2 border-neon-blue animate-neon-glow">
                  <Search className="text-neon-blue animate-float" size={32} />
                </div>
                <h3 className="text-2xl font-cyber text-neon-blue mb-4">
                  NO {contentType === 'news' ? 'NEURAL DATA' : contentType === 'blogs' ? 'USER LOGS' : 'CONTENT'} DETECTED
                </h3>
                <p className="text-white/70 max-w-md mx-auto font-futuristic">
                  Adjust neural parameters or modify search algorithms to locate target information.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="glass-morph-dark rounded-2xl p-8 mb-12 border border-neon-blue/20">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-4xl font-cyber text-white mb-2">
                      {contentType === 'news' ? (
                        <span className="holographic">NEURAL FEED</span>
                      ) : contentType === 'blogs' ? (
                        <span className="holographic">USER LOGS</span>
                      ) : (
                        <span className="holographic">FULL SPECTRUM</span>
                      )}
                    </h2>
                    <div className="flex items-center gap-4 text-neon-blue font-mono">
                      <span>
                        [{filteredContent.length}] {contentType === 'news' ? 'DATA STREAMS' : contentType === 'blogs' ? 'LOG ENTRIES' : 'RECORDS'} ACTIVE
                      </span>
                      {lastUpdated && contentType === 'news' && (
                        <span className="text-white/50">
                          LAST SYNC: {lastUpdated.toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {/* Enhanced Refresh Button */}
                    {(contentType === 'news' || contentType === 'all') && (
                      <button
                        onClick={refreshNews}
                        disabled={loading}
                        className="cyber-btn cyber-btn-primary flex items-center gap-3 px-6 py-3 rounded-lg font-cyber disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RefreshCw className={`${loading ? 'animate-spin' : 'animate-float'}`} size={18} />
                        {loading ? 'SYNCING...' : 'NEURAL SYNC'}
                      </button>
                    )}
                    
                    {/* Enhanced Category Filter */}
                    {(contentType === 'news' || contentType === 'all') && (
                      <div className="flex gap-3 flex-wrap">
                        <button
                          onClick={() => loadNewsByCategory('general')}
                          className={`px-4 py-2 rounded-lg text-sm font-cyber transition-all duration-300 ${
                            selectedCategory === 'general' 
                              ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue shadow-neon' 
                              : 'glass-morph text-white/70 hover:text-neon-blue hover:border-neon-blue/50'
                          }`}
                        >
                          GENERAL
                        </button>
                        {NEWS_CATEGORIES.filter(cat => cat !== 'general').map(category => (
                          <button
                            key={category}
                            onClick={() => loadNewsByCategory(category)}
                            className={`px-4 py-2 rounded-lg text-sm font-cyber transition-all duration-300 capitalize ${
                              selectedCategory === category 
                                ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple shadow-neon' 
                                : 'glass-morph text-white/70 hover:text-neon-purple hover:border-neon-purple/50'
                            }`}
                          >
                            {category.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
                {filteredContent.map((post) => (
                  <div key={post.id} className="animate-float" style={{ animationDelay: `${Math.random() * 2}s` }}>
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Enhanced Newsletter Section */}
      <section className="py-24 px-4 bg-cyber-dark relative overflow-hidden">
        <div className="absolute inset-0 circuit-bg opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-neon-pink to-neon-green rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float-reverse"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="glass-morph-neon rounded-3xl p-12 border border-neon-blue/20">
            <h2 className="text-5xl font-cyber text-white mb-6">
              <span className="holographic">NEURAL UPLINK</span>
            </h2>
            <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed font-futuristic">
              Subscribe to our quantum-encrypted data stream for real-time updates on neural feeds, 
              technological singularities, and exclusive content delivered directly to your consciousness.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 max-w-lg mx-auto mb-8">
              <div className="flex-1 relative group">
                <input
                  type="email"
                  placeholder="NEURAL.ID@MATRIX.NET"
                  className="w-full px-6 py-4 bg-cyber-gray/50 border border-neon-blue/30 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-neon-blue transition-all duration-300 text-white placeholder-white/50 font-mono"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-neon-blue/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              <button className="cyber-btn cyber-btn-success px-8 py-4 rounded-lg font-cyber text-lg transform hover:scale-105 transition-all duration-300 shadow-cyber-lg">
                UPLINK NOW
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-sm text-white/50 font-mono">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
              <span>QUANTUM ENCRYPTED • NO SPAM PROTOCOLS • INSTANT DISCONNECTION</span>
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}