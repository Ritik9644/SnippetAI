import React, { useState } from 'react';
import { Header } from '../layout/Header';
import { SnippetGrid } from '../snippets/SnippetGrid';
import { semanticSearch } from '../../lib/ai';
import { Snippet, User } from '../../types';

interface DashboardProps {
  snippets: Snippet[];
  onEditSnippet: (snippet: Snippet) => void;
  onNewSnippet: () => void;
  user: User;
  loading: boolean;
  onSignOut: () => Promise<void>;
}

export function Dashboard({ snippets, onEditSnippet, onNewSnippet, user, loading, onSignOut }: DashboardProps) {
  const [searchResults, setSearchResults] = useState<Snippet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      // Try semantic search first
      const semanticResults = await semanticSearch(query);
      if (semanticResults.length > 0) {
        setSearchResults(semanticResults);
      } else {
        // Fallback to local text search
        const results = snippets.filter(snippet => 
          snippet.title.toLowerCase().includes(query.toLowerCase()) ||
          snippet.code.toLowerCase().includes(query.toLowerCase()) ||
          snippet.explanation?.toLowerCase().includes(query.toLowerCase()) ||
          snippet.language.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to local search on error
      const results = snippets.filter(snippet => 
        snippet.title.toLowerCase().includes(query.toLowerCase()) ||
        snippet.code.toLowerCase().includes(query.toLowerCase()) ||
        snippet.explanation?.toLowerCase().includes(query.toLowerCase()) ||
        snippet.language.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } finally {
      setSearching(false);
    }
  };

  const displaySnippets = searchQuery ? searchResults : snippets;
  const isSearchMode = searchQuery.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onNewSnippet={onNewSnippet}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        user={user}
        onSignOut={onSignOut}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isSearchMode ? 'Search Results' : 'Your Code Snippets'}
          </h2>
          <p className="text-gray-600">
            {isSearchMode 
              ? `Found ${searchResults.length} snippet${searchResults.length === 1 ? '' : 's'} matching "${searchQuery}"`
              : `You have ${snippets.length} snippet${snippets.length === 1 ? '' : 's'} in your library`
            }
          </p>
        </div>

        <SnippetGrid
          snippets={displaySnippets}
          loading={loading || searching}
          onSnippetClick={onEditSnippet}
          isSearchResults={isSearchMode}
        />
      </main>
    </div>
  );
}