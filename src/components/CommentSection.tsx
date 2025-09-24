import React, { useState } from 'react';
import { MessageCircle, Heart, Reply, MoreVertical, Edit, Trash2, Send, Feather, Star } from 'lucide-react';
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
  liked?: boolean;
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: string;
  comments?: Comment[];
}

export default function CommentSection({ postId, comments = [] }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
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
      showToast('error', 'Please sign in to share your thoughts');
      return;
    }
    if (!newComment.trim()) {
      showToast('error', 'Please write something before posting');
      return;
    }

    // Simulate comment submission
    showToast('success', 'Your thoughts have been shared with the community');
    setNewComment('');
  };

  const handleEditComment = (commentId: string, currentContent: string) => {
    setEditingComment(commentId);
    setEditContent(currentContent);
  };

  const handleSaveEdit = (commentId: string) => {
    if (!editContent.trim()) {
      showToast('error', 'Please write something before saving');
      return;
    }
    
    showToast('success', 'Your comment has been updated successfully');
    setEditingComment(null);
    setEditContent('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      showToast('success', 'Comment has been removed');
    }
  };

  const handleLikeComment = (commentId: string) => {
    showToast('success', 'Thank you for sharing your appreciation');
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const handleSubmitReply = (commentId: string) => {
    if (!replyContent.trim()) {
      showToast('error', 'Please write a response');
      return;
    }

    showToast('success', 'Your response has been shared');
    setReplyingTo(null);
    setReplyContent('');
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`card-rustic ${isReply ? 'ml-8 mt-3' : 'mb-4'} group relative`}>
      {/* Rustic glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-600/5 via-orange-500/5 to-yellow-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
      
      {/* Comment Header */}
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={comment.author.avatar}
              alt={comment.author.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-600/50 group-hover:ring-amber-500/70 transition-all duration-300"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-stone-900 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full bg-amber-400/10 blur-sm"></div>
          </div>
          <div>
            <h4 className="font-medium text-amber-200 tracking-wide font-serif group-hover:text-amber-300 transition-colors duration-300">{comment.author.name}</h4>
            <p className="text-xs text-amber-200/60 font-serif">{formatDate(comment.createdAt)}</p>
          </div>
        </div>

        {user && comment.author.id === user.id && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleEditComment(comment.id, comment.content)}
              className="btn-ghost-rustic p-1 text-xs"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => handleDeleteComment(comment.id)}
              className="btn-ghost-rustic p-1 text-xs text-red-400 border-red-400/30 hover:bg-red-400/10"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Comment Content */}
      {editingComment === comment.id ? (
        <div className="space-y-3 relative z-10">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="input-rustic resize-none"
            rows={3}
            placeholder="Edit your thoughts..."
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleSaveEdit(comment.id)}
              className="btn-primary-rustic text-xs gap-1"
            >
              <Send size={12} />
              <span className="tracking-wide font-serif">Update</span>
            </button>
            <button
              onClick={() => setEditingComment(null)}
              className="btn-ghost-rustic text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="relative z-10">
          <p className="text-amber-100/90 leading-relaxed mb-4 font-serif">{comment.content}</p>
          
          {/* Comment Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLikeComment(comment.id)}
              className={`btn-ghost-rustic text-xs gap-1 ${
                comment.liked ? 'text-red-400 border-red-400/50 bg-red-400/10' : ''
              }`}
            >
              <Heart size={12} className={comment.liked ? 'fill-current' : ''} />
              <span className="tracking-wide font-serif">{comment.likes} Love</span>
            </button>

            {!isReply && user && (
              <button
                onClick={() => handleReply(comment.id)}
                className="btn-ghost-rustic text-xs gap-1"
              >
                <Reply size={12} />
                <span className="tracking-wide font-serif">Reply</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reply Form */}
      {replyingTo === comment.id && (
        <div className="mt-4 space-y-3 relative z-10">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="input-rustic resize-none"
            rows={2}
            placeholder="Share your thoughts..."
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleSubmitReply(comment.id)}
              className="btn-primary-rustic text-xs gap-1"
            >
              <Send size={12} />
              <span className="tracking-wide font-serif">Reply</span>
            </button>
            <button
              onClick={() => setReplyingTo(null)}
              className="btn-ghost-rustic text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  return (
    <div className="card-rustic relative group">
      {/* Warm glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-600/5 via-orange-500/5 to-yellow-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="relative">
          <MessageCircle className="text-amber-400" size={28} />
          <div className="absolute inset-0 text-amber-400 opacity-50 blur-sm">
            <MessageCircle size={28} />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-elegant tracking-wider font-rustic">Community Thoughts</h3>
          <p className="text-amber-200/70 text-sm tracking-wide font-serif">
            {comments.length} thoughtful contributions shared
          </p>
        </div>
      </div>

      {/* New Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8 relative z-10">
          <div className="flex gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-600/50"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-stone-900 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full bg-amber-400/10 blur-sm"></div>
            </div>
            <div className="flex-1 space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="input-rustic resize-none"
                rows={3}
                placeholder="Share your thoughts with the community..."
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-amber-200/60 font-serif">
                  Writing as: {user.name}
                </span>
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="btn-primary-rustic gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Feather size={16} />
                  <span className="tracking-wide font-serif">Share Thoughts</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-6 card-rustic border border-amber-600/30 rounded-xl text-center relative group">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-600/5 via-orange-500/5 to-yellow-600/5 opacity-50"></div>
          <Star className="mx-auto text-amber-400 mb-3 relative z-10" size={32} />
          <h4 className="text-lg font-semibold text-amber-300 mb-2 tracking-wide font-rustic relative z-10">Join the Conversation</h4>
          <p className="text-amber-200/70 text-sm tracking-wide font-serif relative z-10">
            Please sign in to share your thoughts with the community
          </p>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4 relative z-10">
          {comments.map(comment => renderComment(comment))}
        </div>
      ) : (
        <div className="text-center py-12 relative z-10">
          <div className="relative inline-block mb-4">
            <MessageCircle className="text-amber-200/50" size={48} />
            <div className="absolute inset-0 text-amber-200/30 opacity-30 blur-sm">
              <MessageCircle size={48} />
            </div>
          </div>
          <h4 className="text-lg font-semibold text-amber-200/70 mb-2 tracking-wide font-rustic">No Comments Yet</h4>
          <p className="text-amber-200/50 text-sm tracking-wide font-serif">
            Be the first to share your thoughts on this story
          </p>
        </div>
      )}

      {/* Community Activity Indicator */}
      <div className="mt-8 pt-6 border-t border-amber-700/30 relative z-10">
        <div className="flex items-center justify-center gap-2 text-xs text-amber-200/60 font-serif">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="tracking-wide">Community Active • Live Discussion</span>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
