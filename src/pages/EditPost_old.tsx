import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Upload, Tag, X } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">Please log in to edit posts.</p>
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

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The post you're trying to edit doesn't exist.</p>
          <Link
            to="/my-posts"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            Back to My Posts
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      showToast('error', 'Please fix the errors before updating');
      return;
    }

    try {
      if (!id) throw new Error('Post ID is required');
      
      await updatePost(id, {
        ...formData,
        author: user
      });
      
      showToast('success', 'Post updated successfully!');
      navigate(`/post/${id}`);
    } catch (error) {
      showToast('error', 'Failed to update post. Please try again.');
    }
  };

  const handleSaveDraft = async () => {
    try {
      if (!id) throw new Error('Post ID is required');
      
      await updatePost(id, {
        ...formData,
        published: false,
        author: user
      });
      
      showToast('success', 'Changes saved as draft!');
    } catch (error) {
      showToast('error', 'Failed to save draft. Please try again.');
    }
  };

  const estimatedReadTime = Math.ceil(formData.content.split(' ').length / 200);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to={`/post/${id}`}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
            >
              <ArrowLeft size={20} />
              Back to Post
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all duration-200 ${
                isPreview
                  ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                  : 'text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Eye size={18} />
              {isPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>

        {isPreview ? (
          /* Preview Mode */
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {formData.image && (
              <img
                src={formData.image}
                alt={formData.title}
                className="w-full h-64 object-cover"
              />
            )}
            
            <div className="p-8">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-700 rounded-full"
                  >
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {formData.title}
              </h1>

              {/* Meta */}
              <div className="flex items-center gap-4 text-gray-600 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-medium">{user.name}</span>
                </div>
                <span>•</span>
                <span>{estimatedReadTime} min read</span>
                <span>•</span>
                <span className="text-orange-600 font-medium">Updated</span>
              </div>

              {/* Excerpt */}
              <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mb-6">
                <p className="text-gray-700 italic">
                  {formData.excerpt}
                </p>
              </div>

              {/* Content */}
              <div className="prose max-w-none">
                {formData.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph || <br />}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Publish Options */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Publish immediately (uncheck to save as draft)
                </span>
              </label>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Featured Image URL (Optional)
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <Upload size={18} />
                  Upload
                </button>
              </div>
              {formData.image && (
                <div className="mt-4">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Title */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Post Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 text-xl border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                  errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Post Excerpt *
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-200 ${
                  errors.excerpt ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.excerpt && (
                <p className="mt-2 text-sm text-red-600">{errors.excerpt}</p>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags * (Press Enter to add)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                  >
                    <Tag size={12} />
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-indigo-500 hover:text-indigo-700"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tags (e.g., React, JavaScript, Web Development)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
              {errors.tags && (
                <p className="mt-2 text-sm text-red-600">{errors.tags}</p>
              )}
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Post Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={20}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm leading-relaxed transition-all duration-200 ${
                  errors.content ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.content && (
                <p className="mt-2 text-sm text-red-600">{errors.content}</p>
              )}
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>{formData.content.length} characters</span>
                <span>~{estimatedReadTime} min read</span>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(`/post/${id}`)}
                className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Post'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}