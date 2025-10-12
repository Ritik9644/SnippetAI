import { Search, Plus, Code, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { User } from '../../types';

interface HeaderProps {
  onNewSnippet: () => void;
  onSearch: (query: string) => Promise<void>;
  searchQuery: string;
  user: User;
  onSignOut: () => Promise<void>;
}

export function Header({ onNewSnippet, onSearch, searchQuery, user, onSignOut }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">IntelliCode</h1>
            </div>
            
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search snippets by meaning or keywords..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button onClick={onNewSnippet} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Snippet</span>
            </Button>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">{user.email}</span>
              <Button 
                onClick={onSignOut} 
                variant="outline" 
                size="sm"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}