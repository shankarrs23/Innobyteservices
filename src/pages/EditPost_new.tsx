import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Upload, Tag, X, Zap, Brain, Cpu, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useBlog } from '../context/BlogContext';

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: [] as string[],
    image: '',
    published: true
  });
  const [newTag, setNewTag] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const { user } = useAuth();
  const { showToast } = useToast();
  const { getPost, updatePost, loading } = useBlog();
  const navigate = useNavigate();

  const post = id ? getPost(id) : undefined;

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        tags: [...post.tags],
        image: post.image || '',
        published: post.published
      });
    }
  }, [post]);

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
            <Brain className="text-red-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold holographic mb-4 tracking-wider">ACCESS DENIED</h1>
          <p className="text-gray-400 mb-8 tracking-wide">Neural link required to modify transmission data.</p>
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

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        {/* Cyber effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-yellow-400/20 rotate-45 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-cyan-400/20 animate-spin" style={{animationDuration: '20s'}}></div>
        </div>
        
        <div className="text-center glass-morph-dark border border-yellow-400/30 p-8 rounded-2xl relative z-10 max-w-md w-full mx-4">
          <div className="w-16 h-16 glass-morph-light border border-yellow-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="text-yellow-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold holographic mb-4 tracking-wider">DATA NOT FOUND</h1>
          <p className="text-gray-400 mb-8 tracking-wide">Neural transmission does not exist in the network.</p>
          <Link
            to="/my-posts"
            className="cyber-button-primary inline-flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            <span className="tracking-wide">RETURN TO VAULT</span>
          </Link>
        </div>
      </div>
    );
  }

  if (post.author?.id !== user.id) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        {/* Cyber effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-red-400/20 rotate-45 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-cyan-400/20 animate-spin" style={{animationDuration: '20s'}}></div>
        </div>
        
        <div className="text-center glass-morph-dark border border-red-400/30 p-8 rounded-2xl relative z-10 max-w-md w-full mx-4">
          <div className="w-16 h-16 glass-morph-light border border-red-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="text-red-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold holographic mb-4 tracking-wider">UNAUTHORIZED ACCESS</h1>
          <p className="text-gray-400 mb-8 tracking-wide">Neural signature mismatch. Access to this transmission denied.</p>
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(newTag.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag.trim()]
        }));
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 100) {
      newErrors.content = 'Content must be at least 100 characters';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    } else if (formData.excerpt.length < 50) {
      newErrors.excerpt = 'Excerpt must be at least 50 characters';
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('error', 'Error: Please fix validation issues before data transmission');
      return;
    }

    try {
      await updatePost(post.id, {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        tags: formData.tags,
        image: formData.image,
        published: formData.published
      });

      showToast('success', `Neural data ${formData.published ? 'updated and transmitted' : 'updated in local cache'} successfully!`);
      navigate(`/post/${post.id}`);
    } catch (error) {
      showToast('error', 'Data update failed. Network synchronization error.');
    }
  };

  const handleSaveDraft = async () => {
    if (!formData.title.trim()) {
      showToast('error', 'Error: Neural signature required before local storage');
      return;
    }

    try {
      await updatePost(post.id, {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || 'Draft neural data',
        tags: formData.tags,
        image: formData.image,
        published: false
      });

      showToast('success', 'Neural data cached locally. Transmission pending.');
      navigate('/my-posts');
    } catch (error) {
      showToast('error', 'Local cache update failed. Please retry.');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 relative">
      {/* Cyber background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 border border-purple-400/20 rotate-45 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 border border-cyan-400/20 animate-spin" style={{animationDuration: '15s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-24 h-24 border border-pink-400/20 rotate-12 animate-bounce"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"></div>
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="glass-morph-dark border border-purple-400/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/my-posts"
                className="cyber-button-ghost p-2 hover:bg-purple-400/10"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold holographic tracking-wider">NEURAL DATA MODIFICATION</h1>
                <p className="text-gray-400 tracking-wide">Reconfigure existing neural transmission</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className={`cyber-button-ghost gap-2 ${isPreview ? 'bg-purple-400/20 border-purple-400/50' : ''}`}
              >
                <Eye size={18} />
                <span className="tracking-wide">{isPreview ? 'EDIT' : 'PREVIEW'}</span>
              </button>
            </div>
          </div>
        </div>

        {!isPreview ? (
          /* Edit Mode */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="glass-morph-dark border border-cyan-400/30 rounded-2xl p-6">
                  <label className="block text-sm font-medium text-cyber mb-3 tracking-wide">
                    NEURAL SIGNATURE
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`cyber-input text-lg ${errors.title ? 'border-red-400/50 bg-red-400/5' : ''}`}
                    placeholder="Modify neural transmission title..."
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1 font-mono">
                      <span className="w-4 h-4 rounded-full bg-red-400/20 flex items-center justify-center text-xs border border-red-400/30">!</span>
                      ERROR: {errors.title}
                    </p>
                  )}
                </div>

                {/* Content */}
                <div className="glass-morph-dark border border-purple-400/30 rounded-2xl p-6">
                  <label className="block text-sm font-medium text-cyber mb-3 tracking-wide">
                    NEURAL DATA STREAM
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={16}
                    className={`cyber-input resize-none ${errors.content ? 'border-red-400/50 bg-red-400/5' : ''}`}
                    placeholder="Modify neural data transmission..."
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.content && (
                      <p className="text-sm text-red-400 flex items-center gap-1 font-mono">
                        <span className="w-4 h-4 rounded-full bg-red-400/20 flex items-center justify-center text-xs border border-red-400/30">!</span>
                        ERROR: {errors.content}
                      </p>
                    )}
                    <span className="text-xs text-gray-500 font-mono ml-auto">
                      {formData.content.length} characters processed
                    </span>
                  </div>
                </div>

                {/* Excerpt */}
                <div className="glass-morph-dark border border-pink-400/30 rounded-2xl p-6">
                  <label className="block text-sm font-medium text-cyber mb-3 tracking-wide">
                    DATA PREVIEW EXCERPT
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    rows={3}
                    className={`cyber-input resize-none ${errors.excerpt ? 'border-red-400/50 bg-red-400/5' : ''}`}
                    placeholder="Modify neural summary for network preview..."
                  />
                  {errors.excerpt && (
                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1 font-mono">
                      <span className="w-4 h-4 rounded-full bg-red-400/20 flex items-center justify-center text-xs border border-red-400/30">!</span>
                      ERROR: {errors.excerpt}
                    </p>
                  )}
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Update Controls */}
              <div className="glass-morph-dark border border-cyan-400/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-cyber mb-4 tracking-wide">UPDATE CONTROLS</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                      className="h-4 w-4 text-cyan-400 focus:ring-cyan-500 border-cyan-400/30 rounded bg-transparent"
                    />
                    <label htmlFor="published" className="text-sm text-gray-400 tracking-wide">
                      Transmit to public network
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      onClick={handleSubmit}
                      className="cyber-button-primary w-full gap-2"
                    >
                      <Zap size={18} />
                      <span className="tracking-wide">
                        {loading ? 'UPDATING...' : 'UPDATE TRANSMISSION'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      disabled={loading}
                      className="cyber-button-ghost w-full gap-2"
                    >
                      <Save size={18} />
                      <span className="tracking-wide">SAVE TO CACHE</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="glass-morph-dark border border-purple-400/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-cyber mb-4 tracking-wide">VISUAL DATA</h3>
                
                <div className="space-y-4">
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="cyber-input"
                    placeholder="Visual data stream URL..."
                  />
                  
                  <button
                    type="button"
                    className="cyber-button-ghost w-full gap-2"
                  >
                    <Upload size={18} />
                    <span className="tracking-wide">UPDATE VISUAL DATA</span>
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="glass-morph-dark border border-pink-400/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-cyber mb-4 tracking-wide">NEURAL TAGS</h3>
                
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={handleAddTag}
                      className="cyber-input"
                      placeholder="Modify classification tags..."
                    />
                    {errors.tags && (
                      <p className="mt-2 text-sm text-red-400 flex items-center gap-1 font-mono">
                        <span className="w-4 h-4 rounded-full bg-red-400/20 flex items-center justify-center text-xs border border-red-400/30">!</span>
                        ERROR: {errors.tags}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="cyber-tag group"
                      >
                        <Tag size={12} />
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-pink-400 hover:text-pink-300 transition-colors duration-200"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Preview Mode */
          <div className="glass-morph-dark border border-cyan-400/30 rounded-2xl p-8">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold holographic mb-4 tracking-wider">
                  {formData.title || 'Neural Signature Preview'}
                </h1>
                <p className="text-gray-400 text-lg tracking-wide">
                  {formData.excerpt || 'Neural data preview will appear here...'}
                </p>
                <div className="flex justify-center gap-2 mt-4">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="cyber-tag">
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {formData.image && (
                <div className="mb-8">
                  <img
                    src={formData.image}
                    alt="Neural visual data"
                    className="w-full rounded-lg border border-cyan-400/30"
                  />
                </div>
              )}

              <div className="prose prose-invert max-w-none">
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {formData.content || 'Neural data stream content will appear here...'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
