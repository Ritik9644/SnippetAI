import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { generateCodeExplanation } from '../lib/ai';
import { Snippet } from '../types';

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return url && key && url !== 'https://placeholder.supabase.co' && key !== 'placeholder-key';
};

// Check if Gemini API is configured
const isGeminiConfigured = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  return apiKey && apiKey !== 'your_gemini_api_key_here';
};

export function useSnippets(userId?: string) {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSnippets = async () => {
    if (!userId || !isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('snippets')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSnippets(data || []);
    } catch (error) {
      console.error('Error fetching snippets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, [userId]);

  const createSnippet = async (title: string, code: string, language: string): Promise<Snippet> => {
    if (!userId) throw new Error('User not authenticated');
    
    if (!isSupabaseConfigured()) {
      // Create mock snippet when Supabase is not configured
      let explanation = '';

      try {
        explanation = await generateCodeExplanation(code, language);
      } catch (error) {
        console.error('Failed to generate explanation:', error);
        explanation = 'AI explanation unavailable - Supabase not configured.';
      }

      const mockSnippet: Snippet = {
        id: `mock-${Date.now()}`,
        title,
        code,
        language,
        explanation,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: userId,
      };
      setSnippets(prev => [mockSnippet, ...prev]);
      return mockSnippet;
    }

    try {
      // Generate AI explanation
      let explanation = '';
      try {
        explanation = await generateCodeExplanation(code, language);
      } catch (error) {
        console.error('Failed to generate explanation:', error);
        explanation = 'AI explanation generation failed.';
      }

      const { data, error } = await supabase
        .from('snippets')
        .insert([{
          title,
          code,
          language,
          explanation,
          user_id: userId,
        }])
        .select()
        .single();

      if (error) throw error;

      const newSnippet = data as Snippet;
      setSnippets(prev => [newSnippet, ...prev]);
      return newSnippet;
    } catch (error) {
      console.error('Error creating snippet:', error);
      throw error;
    }
  };

  const updateSnippet = async (id: string, updates: Partial<Snippet>): Promise<Snippet> => {
    if (!isSupabaseConfigured()) {
      // Update mock snippet with new explanation if code changed
      let explanation = updates.explanation;
      if (updates.code || updates.language) {
        const snippet = snippets.find(s => s.id === id);
        if (snippet) {
          try {
            explanation = await generateCodeExplanation(
              updates.code || snippet.code,
              updates.language || snippet.language
            );
          } catch (error) {
            console.error('Failed to generate explanation:', error);
            explanation = 'AI explanation generation failed.';
          }
        }
      }

      const updatedSnippet = snippets.find(s => s.id === id);
      if (!updatedSnippet) throw new Error('Snippet not found');

      const newSnippet = { ...updatedSnippet, ...updates, explanation, updated_at: new Date().toISOString() };

      setSnippets(prev => prev.map(snippet =>
        snippet.id === id ? newSnippet : snippet
      ));

      return newSnippet;
    }

    try {
      // If code or language changed, regenerate explanation
      let explanation = updates.explanation;
      if (updates.code || updates.language) {
        const snippet = snippets.find(s => s.id === id);
        if (snippet) {
          try {
            explanation = await generateCodeExplanation(
              updates.code || snippet.code,
              updates.language || snippet.language
            );
          } catch (error) {
            console.error('Failed to generate explanation:', error);
            explanation = 'AI explanation generation failed.';
          }
        }
      }

      const { data, error } = await supabase
        .from('snippets')
        .update({ ...updates, explanation, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedSnippet = data as Snippet;
      setSnippets(prev => prev.map(snippet =>
        snippet.id === id ? updatedSnippet : snippet
      ));

      return updatedSnippet;
    } catch (error) {
      console.error('Error updating snippet:', error);
      throw error;
    }
  };

  const deleteSnippet = async (id: string): Promise<void> => {
    if (!isSupabaseConfigured()) {
      // Delete mock snippet
      setSnippets(prev => prev.filter(snippet => snippet.id !== id));
      return;
    }

    try {
      const { error } = await supabase
        .from('snippets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSnippets(prev => prev.filter(snippet => snippet.id !== id));
    } catch (error) {
      console.error('Error deleting snippet:', error);
      throw error;
    }
  };

  return {
    snippets,
    loading,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    refetch: fetchSnippets,
  };
}