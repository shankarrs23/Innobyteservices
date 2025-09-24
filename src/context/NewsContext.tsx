import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NewsArticle, fetchTopHeadlines, fetchNewsByCategory, searchNews } from '../services/newsApi';

interface NewsContextType {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  selectedCategory: string;
  selectedCountry: string;
  searchTerm: string;
  lastUpdated: Date | null;
  refreshNews: () => Promise<void>;
  loadNewsByCategory: (category: string) => Promise<void>;
  loadNewsByCountry: (country: string) => Promise<void>;
  searchArticles: (query: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export function NewsProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [selectedCountry, setSelectedCountry] = useState('in');
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const handleError = (err: any) => {
    console.error('News API Error:', err);
    setError(err.message || 'Failed to fetch news. Please try again later.');
  };  const refreshNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const newsArticles = await fetchTopHeadlines(selectedCountry, 50);
      setArticles(newsArticles);
      setLastUpdated(new Date());
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };
  const loadNewsByCategory = async (category: string) => {
    setLoading(true);
    setError(null);
    setSelectedCategory(category);
    setSearchTerm(''); // Clear search when changing category
    try {
      const newsArticles = await fetchNewsByCategory(category, selectedCountry, 50);
      setArticles(newsArticles);
      setLastUpdated(new Date());
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const loadNewsByCountry = async (country: string) => {
    setLoading(true);
    setError(null);
    setSelectedCountry(country);
    setSearchTerm(''); // Clear search when changing country
    try {
      const newsArticles = await fetchTopHeadlines(country, 50);
      setArticles(newsArticles);
      setLastUpdated(new Date());
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };
  const searchArticles = async (query: string) => {
    if (!query.trim()) {
      refreshNews();
      return;
    }
    
    setLoading(true);
    setError(null);
    setSearchTerm(query);
    try {
      const newsArticles = await searchNews(query, selectedCountry, 50);
      setArticles(newsArticles);
      setLastUpdated(new Date());
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    refreshNews();
  };

  // Load initial news on mount
  useEffect(() => {
    refreshNews();
  }, []);

  // Listen for user login events to refresh news
  useEffect(() => {
    const handleUserLogin = () => {
      refreshNews();
    };

    window.addEventListener('userLoggedIn', handleUserLogin);
    return () => {
      window.removeEventListener('userLoggedIn', handleUserLogin);
    };
  }, []);

  // Auto-refresh news every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!searchTerm) {
        refreshNews();
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [searchTerm]);
  return (
    <NewsContext.Provider 
      value={{ 
        articles, 
        loading, 
        error, 
        selectedCategory, 
        selectedCountry,
        searchTerm,
        lastUpdated,
        refreshNews, 
        loadNewsByCategory, 
        loadNewsByCountry,
        searchArticles,
        setSearchTerm,
        clearSearch
      }}
    >
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
}
