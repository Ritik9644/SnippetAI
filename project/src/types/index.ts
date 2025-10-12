export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  explanation?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface SearchResult extends Snippet {
  similarity_score?: number;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}