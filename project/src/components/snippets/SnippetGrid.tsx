import React from 'react';
import { Snippet } from '../../types';
import { SnippetCard } from './SnippetCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { FileText } from 'lucide-react';

interface SnippetGridProps {
  snippets: Snippet[];
  loading: boolean;
  onSnippetClick: (snippet: Snippet) => void;
  isSearchResults?: boolean;
}

export function SnippetGrid({ snippets, loading, onSnippetClick, isSearchResults }: SnippetGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (snippets.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isSearchResults ? 'No results found' : 'No snippets yet'}
        </h3>
        <p className="text-gray-600">
          {isSearchResults 
            ? 'Try adjusting your search terms or browse all snippets'
            : 'Create your first code snippet to get started'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {snippets.map((snippet) => (
        <SnippetCard
          key={snippet.id}
          snippet={snippet}
          onClick={() => onSnippetClick(snippet)}
        />
      ))}
    </div>
  );
}