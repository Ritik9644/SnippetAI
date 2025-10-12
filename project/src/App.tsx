import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useSnippets } from './hooks/useSnippets';
import { AuthPage } from './components/auth/AuthPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { SnippetEditor } from './components/snippets/SnippetEditor';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { Snippet } from './types';

type View = 'dashboard' | 'editor';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { snippets, loading: snippetsLoading, createSnippet, updateSnippet, deleteSnippet } = useSnippets(user?.id);
  
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [editingSnippet, setEditingSnippet] = useState<Snippet | undefined>();
  const [saving, setSaving] = useState(false);

  console.log('App render:', { user, authLoading, currentView });

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading IntelliCode...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!user) {
    return <AuthPage />;
  }

  const handleNewSnippet = () => {
    setEditingSnippet(undefined);
    setCurrentView('editor');
  };

  const handleEditSnippet = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setCurrentView('editor');
  };

  const handleSaveSnippet = async (title: string, code: string, language: string) => {
    setSaving(true);
    try {
      let savedSnippet: Snippet;
      if (editingSnippet) {
        savedSnippet = await updateSnippet(editingSnippet.id, { title, code, language });
      } else {
        savedSnippet = await createSnippet(title, code, language);
      }
      setEditingSnippet(savedSnippet);
    } catch (error) {
      console.error('Failed to save snippet:', error);
      alert('Failed to save snippet. Please check your connection.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSnippet = async () => {
    if (!editingSnippet) return;
    
    if (confirm('Are you sure you want to delete this snippet?')) {
      try {
        await deleteSnippet(editingSnippet.id);
        setCurrentView('dashboard');
        setEditingSnippet(undefined);
      } catch (error) {
        console.error('Failed to delete snippet:', error);
        alert('Failed to delete snippet. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setCurrentView('dashboard');
    setEditingSnippet(undefined);
  };

  if (currentView === 'editor') {
    return (
      <SnippetEditor
        snippet={editingSnippet}
        onSave={handleSaveSnippet}
        onDelete={editingSnippet ? handleDeleteSnippet : undefined}
        onCancel={handleCancel}
        saving={saving}
      />
    );
  }

  return (
    <Dashboard
      snippets={snippets}
      onEditSnippet={handleEditSnippet}
      onNewSnippet={handleNewSnippet}
      user={user}
      loading={snippetsLoading}
      onSignOut={signOut}
    />
  );
}

export default App;