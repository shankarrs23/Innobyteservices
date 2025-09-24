import { createContext, useContext, useState, ReactNode } from 'react';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  tags: string[];
  readTime: number;
  image?: string;
  published: boolean;
  likes: number;
  comments: Comment[];
}

export interface Comment {
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

interface BlogContextType {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  createPost: (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'comments'>) => Promise<BlogPost>;
  updatePost: (id: string, postData: Partial<BlogPost>) => Promise<BlogPost>;
  deletePost: (id: string) => Promise<void>;
  getPost: (id: string) => BlogPost | undefined;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'replies'>) => Promise<Comment>;
  updateComment: (postId: string, commentId: string, content: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  likeComment: (postId: string, commentId: string) => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export function BlogProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to calculate read time
  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Helper function to generate ID
  const generateId = (): string => {
    return `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const createPost = async (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'comments'>): Promise<BlogPost> => {
    setLoading(true);
    try {
      const newPost: BlogPost = {
        ...postData,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        readTime: calculateReadTime(postData.content),
        likes: 0,
        comments: []
      };

      setPosts(prev => [newPost, ...prev]);
      setError(null);
      return newPost;
    } catch (err) {
      setError('Failed to create post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (id: string, postData: Partial<BlogPost>): Promise<BlogPost> => {
    setLoading(true);
    try {
      setPosts(prev => prev.map(post => {
        if (post.id === id) {
          const updatedPost = {
            ...post,
            ...postData,
            updatedAt: new Date().toISOString(),
            readTime: postData.content ? calculateReadTime(postData.content) : post.readTime
          };
          return updatedPost;
        }
        return post;
      }));

      const updatedPost = posts.find(p => p.id === id);
      if (!updatedPost) throw new Error('Post not found');
      
      setError(null);
      return updatedPost;
    } catch (err) {
      setError('Failed to update post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      setPosts(prev => prev.filter(post => post.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPost = (id: string): BlogPost | undefined => {
    return posts.find(post => post.id === id);
  };

  const addComment = async (postId: string, commentData: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'replies'>): Promise<Comment> => {
    setLoading(true);
    try {
      const newComment: Comment = {
        ...commentData,
        id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: []
      };

      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      }));

      setError(null);
      return newComment;
    } catch (err) {
      setError('Failed to add comment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateComment = async (postId: string, commentId: string, content: string): Promise<void> => {
    setLoading(true);
    try {
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map(comment => {
              if (comment.id === commentId) {
                return { ...comment, content };
              }
              return comment;
            })
          };
        }
        return post;
      }));
      setError(null);
    } catch (err) {
      setError('Failed to update comment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (postId: string, commentId: string): Promise<void> => {
    setLoading(true);
    try {
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.filter(comment => comment.id !== commentId)
          };
        }
        return post;
      }));
      setError(null);
    } catch (err) {
      setError('Failed to delete comment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (postId: string): Promise<void> => {
    try {
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return { ...post, likes: post.likes + 1 };
        }
        return post;
      }));
    } catch (err) {
      setError('Failed to like post');
      throw err;
    }
  };

  const likeComment = async (postId: string, commentId: string): Promise<void> => {
    try {
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map(comment => {
              if (comment.id === commentId) {
                return { ...comment, likes: comment.likes + 1 };
              }
              return comment;
            })
          };
        }
        return post;
      }));
    } catch (err) {
      setError('Failed to like comment');
      throw err;
    }
  };

  return (
    <BlogContext.Provider 
      value={{ 
        posts,
        loading,
        error,
        createPost,
        updatePost,
        deletePost,
        getPost,
        addComment,
        updateComment,
        deleteComment,
        likePost,
        likeComment
      }}
    >
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
}
