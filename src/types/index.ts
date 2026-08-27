export type Category = 'poem' | 'story' | 'micro_poem' | 'prose_poetry' | 'uncategorized' | 'other';
export type Language = 'bn' | 'en';
export type Theme = 'light' | 'sepia' | 'dark';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role?: string;
  bio?: string | null;
  avatarUrl?: string | null;
  createdAt?: string | Date;
}

export interface Author {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

export interface AuthorProfile extends Author {
  role?: string;
  createdAt?: string | Date;
  worksCount: number;
  followersCount: number;
  followingCount: number;
  is_following: boolean;
}

export interface Comment {
  id: string;
  literatureId: string;
  content: string;
  guestName?: string | null;
  user?: User | null;
  createdAt: string | Date;
}

export interface Literature {
  id: string;
  authorId: string;
  author: Author;
  title: string;
  slug: string;
  content: string;
  category: Category;
  language: Language;
  readingTimeMin: number;
  viewsCount: number;
  createdAt: string | Date;
  likesCount: number;
  commentsCount: number;
  is_liked: boolean;
  comments?: Comment[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LiteratureListResponse {
  items: Literature[];
  pagination: Pagination;
}

export interface LoginCredentials {
  identifier?: string;
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
  bio?: string;
  avatarUrl?: string;
  role?: string;
}

export interface CreateLiteratureInput {
  title: string;
  content: string;
  category: Category;
  language: Language;
  readingTimeMin?: number;
}
