import React, { useState } from 'react';
import { MessageCircle, Heart, Reply, MoreVertical, Edit, Trash2, Send, Brain, Zap } from 'lucide-react';
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
      showToast('error', 'Neural link required to transmit feedback');
      return;
    }
    if (!newComment.trim()) {
      showToast('error', 'Neural feedback cannot be empty');
      return;
    }

    // Simulate comment submission
    showToast('success', 'Neural feedback transmitted to the collective');
    setNewComment('');
  };

  const handleEditComment = (commentId: string, currentContent: string) => {
    setEditingComment(commentId);
    setEditContent(currentContent);
  };

  const handleSaveEdit = (commentId: string) => {
    if (!editContent.trim()) {
      showToast('error', 'Neural feedback cannot be empty');
      return;
    }
    
    showToast('success', 'Neural feedback updated successfully');
    setEditingComment(null);
    setEditContent('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this neural feedback?')) {
      showToast('success', 'Neural feedback purged from the network');
    }
  };

  const handleLikeComment = (commentId: string) => {
    showToast('success', 'Neural resonance transmitted');
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const handleSubmitReply = (commentId: string) => {
    if (!replyContent.trim()) {
      showToast('error', 'Neural response cannot be empty');
      return;
    }

    showToast('success', 'Neural response transmitted');
    setReplyingTo(null);
    setReplyContent('');
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`glass-morph-dark border border-cyan-400/20 rounded-xl p-4 ${isReply ? 'ml-8 mt-3' : 'mb-4'}`}>
      {/* Comment Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={comment.author.avatar}
              alt={comment.author.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-400/50"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
          </div>
          <div>
            <h4 className="font-medium text-cyan-400 tracking-wide">{comment.author.name}</h4>
            <p className="text-xs text-gray-500 font-mono">{formatDate(comment.createdAt)}</p>
          </div>
        </div>

        {user && comment.author.id === user.id && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleEditComment(comment.id, comment.content)}
              className="cyber-button-ghost p-1 text-xs"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => handleDeleteComment(comment.id)}
              className="cyber-button-ghost p-1 text-xs text-red-400 border-red-400/30 hover:bg-red-400/10"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Comment Content */}
      {editingComment === comment.id ? (
        <div className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="cyber-input resize-none"
            rows={3}
            placeholder="Modify neural feedback..."
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleSaveEdit(comment.id)}
              className="cyber-button-primary text-xs gap-1"
            >
              <Send size={12} />
              <span className="tracking-wide">UPDATE</span>
            </button>
            <button
              onClick={() => setEditingComment(null)}
              className="cyber-button-ghost text-xs"
            >
              CANCEL
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-gray-300 leading-relaxed mb-4">{comment.content}</p>
          
          {/* Comment Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLikeComment(comment.id)}
              className={`cyber-button-ghost text-xs gap-1 ${
                comment.liked ? 'text-pink-400 border-pink-400/50 bg-pink-400/10' : ''
              }`}
            >
              <Heart size={12} className={comment.liked ? 'fill-current' : ''} />
              <span className="tracking-wide">{comment.likes} RESONANCE</span>
            </button>

            {!isReply && user && (
              <button
                onClick={() => handleReply(comment.id)}
                className="cyber-button-ghost text-xs gap-1"
              >
                <Reply size={12} />
                <span className="tracking-wide">RESPOND</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reply Form */}
      {replyingTo === comment.id && (
        <div className="mt-4 space-y-3">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="cyber-input resize-none"
            rows={2}
            placeholder="Transmit neural response..."
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleSubmitReply(comment.id)}
              className="cyber-button-primary text-xs gap-1"
            >
              <Send size={12} />
              <span className="tracking-wide">TRANSMIT RESPONSE</span>
            </button>
            <button
              onClick={() => setReplyingTo(null)}
              className="cyber-button-ghost text-xs"
            >
              CANCEL
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
    <div className="glass-morph-dark border border-cyan-400/30 rounded-2xl p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="relative">
          <MessageCircle className="text-cyan-400" size={28} />
          <div className="absolute inset-0 text-cyan-400 opacity-50 blur-sm">
            <MessageCircle size={28} />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold holographic tracking-wider">NEURAL FEEDBACK</h3>
          <p className="text-gray-400 text-sm tracking-wide">
            {comments.length} collective transmissions received
          </p>
        </div>
      </div>

      {/* New Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-400/50"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
            </div>
            <div className="flex-1 space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="cyber-input resize-none"
                rows={3}
                placeholder="Share your neural feedback with the collective..."
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-mono">
                  Neural signature: {user.name}
                </span>
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="cyber-button-primary gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Brain size={16} />
                  <span className="tracking-wide">TRANSMIT FEEDBACK</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-6 glass-morph-light border border-purple-400/30 rounded-xl text-center">
          <Brain className="mx-auto text-purple-400 mb-3" size={32} />
          <h4 className="text-lg font-semibold text-purple-400 mb-2 tracking-wide">NEURAL LINK REQUIRED</h4>
          <p className="text-gray-400 text-sm tracking-wide">
            Establish a neural connection to participate in collective feedback
          </p>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map(comment => renderComment(comment))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="relative inline-block mb-4">
            <MessageCircle className="text-gray-400" size={48} />
            <div className="absolute inset-0 text-gray-400 opacity-30 blur-sm">
              <MessageCircle size={48} />
            </div>
          </div>
          <h4 className="text-lg font-semibold text-gray-400 mb-2 tracking-wide">NO NEURAL FEEDBACK</h4>
          <p className="text-gray-500 text-sm tracking-wide">
            Be the first to transmit feedback to the collective
          </p>
        </div>
      )}

      {/* Neural Activity Indicator */}
      <div className="mt-8 pt-6 border-t border-gray-700/50">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-mono">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="tracking-wide">NEURAL NETWORK ACTIVE • REAL-TIME SYNCHRONIZATION</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
