import React from 'react';
import { Calendar, Code2 } from 'lucide-react';
import { Snippet } from '../../types';

interface SnippetCardProps {
  snippet: Snippet;
  onClick: () => void;
}

const languageColors: Record<string, string> = {
  javascript: 'bg-yellow-100 text-yellow-800',
  typescript: 'bg-blue-100 text-blue-800',
  python: 'bg-green-100 text-green-800',
  java: 'bg-orange-100 text-orange-800',
  cpp: 'bg-purple-100 text-purple-800',
  csharp: 'bg-indigo-100 text-indigo-800',
  go: 'bg-cyan-100 text-cyan-800',
  rust: 'bg-red-100 text-red-800',
  php: 'bg-violet-100 text-violet-800',
  ruby: 'bg-pink-100 text-pink-800',
};

export function SnippetCard({ snippet, onClick }: SnippetCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getLanguageColor = (language: string) => {
    return languageColors[language.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-gray-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {snippet.title}
        </h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLanguageColor(snippet.language)}`}>
          {snippet.language}
        </span>
      </div>

      {snippet.explanation && (
        <div className="text-gray-600 text-sm mb-4 leading-relaxed break-words">
          <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-purple-200">
            <div className="text-xs text-purple-600 font-semibold mb-1 uppercase tracking-wide">AI Explanation</div>
            <p className="text-gray-700">
              {truncateText(snippet.explanation.replace(/## .*/g, '').replace(/\*\*/g, ''), 120)}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <Code2 className="h-3 w-3" />
          <span>{snippet.code.split('\n').length} lines</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3" />
          <span>Updated {formatDate(snippet.updated_at)}</span>
        </div>
      </div>
    </div>
  );
}