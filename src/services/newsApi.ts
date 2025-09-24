// News API Service
const NEWS_API_KEY = '256504c301339000b73b6b3755c3d7ee';
const NEWS_API_BASE_URL = 'https://gnews.io/api/v4';

export interface NewsArticle {
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
  url: string;
  source: string;
}

export interface NewsApiResponse {
  totalArticles: number;
  articles: any[];
}

export interface NewsApiArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

// Helper function to calculate read time
const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.split(' ').length;
  return Math.ceil(words / wordsPerMinute);
};

// Helper function to generate avatar URL
const generateAvatarUrl = (authorName: string): string => {
  const colors = ['indigo', 'purple', 'pink', 'blue', 'green', 'yellow', 'red'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName || 'Anonymous')}&background=${randomColor}&color=white&size=150`;
};

// Helper function to extract category/tags from content
const extractTags = (title: string, description: string, sourceName: string): string[] => {
  const tags = ['News'];
  
  // Add source as a tag
  if (sourceName) {
    tags.push(sourceName);
  }
  
  // Extract tags based on keywords in title and description
  const content = (title + ' ' + description).toLowerCase();
  
  // Indian specific tags
  if (content.includes('india') || content.includes('indian') || content.includes('delhi') || content.includes('mumbai') || content.includes('bangalore') || content.includes('chennai') || content.includes('kolkata') || content.includes('hyderabad')) {
    tags.push('India');
  }
  if (content.includes('bollywood') || content.includes('cricket') || content.includes('ipl')) {
    tags.push('Entertainment');
  }
  if (content.includes('modi') || content.includes('parliament') || content.includes('bjp') || content.includes('congress')) {
    tags.push('Politics');
  }
  
  // General tags
  if (content.includes('tech') || content.includes('technology') || content.includes('ai') || content.includes('artificial intelligence') || content.includes('startup')) {
    tags.push('Technology');
  }
  if (content.includes('business') || content.includes('economy') || content.includes('finance') || content.includes('market') || content.includes('rupee') || content.includes('sensex') || content.includes('nifty')) {
    tags.push('Business');
  }
  if (content.includes('science') || content.includes('research') || content.includes('study') || content.includes('isro')) {
    tags.push('Science');
  }
  if (content.includes('health') || content.includes('medical') || content.includes('medicine') || content.includes('covid') || content.includes('vaccine')) {
    tags.push('Health');
  }
  if (content.includes('sport') || content.includes('football') || content.includes('basketball') || content.includes('soccer') || content.includes('cricket') || content.includes('hockey')) {
    tags.push('Sports');
  }
  if (content.includes('entertainment') || content.includes('movie') || content.includes('music') || content.includes('celebrity') || content.includes('film')) {
    tags.push('Entertainment');
  }
  if (content.includes('politics') || content.includes('government') || content.includes('election') || content.includes('minister')) {
    tags.push('Politics');
  }
  
  return [...new Set(tags)]; // Remove duplicates
};

// Transform News API article to our BlogPost format
const transformNewsArticle = (article: NewsApiArticle): NewsArticle => {
  const authorName = article.source.name || 'Unknown Source';
  const content = article.content || article.description || '';
  const excerpt = article.description || content.substring(0, 200) + '...';
  
  return {
    id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: article.title,
    content: content,
    excerpt: excerpt,
    author: {
      id: `author-${authorName.replace(/\s+/g, '').toLowerCase()}`,
      name: authorName,
      avatar: generateAvatarUrl(authorName)
    },
    createdAt: article.publishedAt,
    updatedAt: article.publishedAt,
    tags: extractTags(article.title, article.description || '', article.source.name),
    readTime: calculateReadTime(content),
    image: article.image || undefined,
    url: article.url,
    source: article.source.name
  };
};

// Fetch top headlines
export const fetchTopHeadlines = async (country: string = 'in', pageSize: number = 20): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(
      `${NEWS_API_BASE_URL}/top-headlines?country=${country}&max=${pageSize}&apikey=${NEWS_API_KEY}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data: NewsApiResponse = await response.json();
    
    return data.articles
      .filter(article => article.title && article.title !== '[Removed]' && article.source && article.source.name)
      .map(transformNewsArticle);
  } catch (error) {
    console.error('Error fetching top headlines:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error - please check your internet connection and try again');
    }
    throw error;
  }
};

// Fetch news by category
export const fetchNewsByCategory = async (category: string, country: string = 'in', pageSize: number = 20): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(
      `${NEWS_API_BASE_URL}/top-headlines?country=${country}&category=${category}&max=${pageSize}&apikey=${NEWS_API_KEY}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data: NewsApiResponse = await response.json();
    
    return data.articles
      .filter(article => article.title && article.title !== '[Removed]' && article.source && article.source.name)
      .map(transformNewsArticle);
  } catch (error) {
    console.error('Error fetching news by category:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error - please check your internet connection and try again');
    }
    throw error;
  }
};

// Search news articles
export const searchNews = async (query: string, country: string = 'in', pageSize: number = 20): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(
      `${NEWS_API_BASE_URL}/search?q=${encodeURIComponent(query)}&country=${country}&max=${pageSize}&apikey=${NEWS_API_KEY}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data: NewsApiResponse = await response.json();
    
    return data.articles
      .filter(article => article.title && article.title !== '[Removed]' && article.source && article.source.name)
      .map(transformNewsArticle);
  } catch (error) {
    console.error('Error searching news:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error - please check your internet connection and try again');
    }
    throw error;
  }
};

// Available categories for news
export const NEWS_CATEGORIES = [
  'general',
  'business',
  'entertainment',
  'health',
  'science',
  'sports',
  'technology'
];

// Available countries for news
export const NEWS_COUNTRIES = [
  { code: 'in', name: 'India' },
  { code: 'us', name: 'United States' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'ca', name: 'Canada' },
  { code: 'au', name: 'Australia' },
  { code: 'de', name: 'Germany' },
  { code: 'fr', name: 'France' },
  { code: 'jp', name: 'Japan' }
];
