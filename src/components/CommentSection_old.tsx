import React, { useState } from 'react';
import { MessageCircle, Heart, Reply, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

export default function CommentSection({ postId, comments }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const { user } = useAuth();
  const { showToast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('error', 'Please login to comment');
      return;
    }
    if (!newComment.trim()) {
      showToast('error', 'Comment cannot be empty');
      return;
    }
    
    // Simulate adding comment
    showToast('success', 'Comment added successfully!');
    setNewComment('');
  };

  const handleEditComment = (commentId: string, currentContent: string) => {
    setEditingComment(commentId);
    setEditContent(currentContent);
  };

  const handleSaveEdit = (commentId: string) => {
    if (!editContent.trim()) {
      showToast('error', 'Comment cannot be empty');
      return;
    }
    // Simulate editing comment
    showToast('success', 'Comment updated successfully!');
    setEditingComment(null);
    setEditContent('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      // Simulate deleting comment
      showToast('success', 'Comment deleted successfully!');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="text-indigo-600" size={24} />
        <h3 className="text-2xl font-bold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a thoughtful comment..."
                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-200"
                rows={4}
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
          <p className="text-gray-600 text-center">
            <span className="font-medium">Please log in to join the conversation</span> and share your thoughts with the community.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No comments yet</p>
            <p className="text-gray-400">Be the first to start the conversation!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors duration-200">
              <div className="flex gap-4">
                <img
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{comment.author.name}</h4>
                      <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                    </div>
                    
                    {user && user.id === comment.author.id && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditComment(comment.id, comment.content)}
                          className="text-gray-500 hover:text-indigo-600 p-1 rounded transition-colors duration-200"
                          title="Edit comment"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-500 hover:text-red-600 p-1 rounded transition-colors duration-200"
                          title="Delete comment"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {editingComment === comment.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(comment.id)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingComment(null);
                            setEditContent('');
                          }}
                          className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors duration-200 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}