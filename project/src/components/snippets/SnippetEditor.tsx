import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Save, Trash2, ArrowLeft, Sparkles } from 'lucide-react';
import { Snippet } from '../../types';

interface SnippetEditorProps {
  snippet?: Snippet;
  onSave: (title: string, code: string, language: string) => Promise<void>;
  onDelete?: () => Promise<void>;
  onCancel: () => void;
  saving?: boolean;
}

const PROGRAMMING_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'sql', label: 'SQL' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'bash', label: 'Bash' },
];

export function SnippetEditor({ snippet, onSave, onDelete, onCancel, saving }: SnippetEditorProps) {
  const [title, setTitle] = useState(snippet?.title || '');
  const [code, setCode] = useState(snippet?.code || '');
  const [language, setLanguage] = useState(snippet?.language || 'javascript');
  const [explanation, setExplanation] = useState(snippet?.explanation || '');

  useEffect(() => {
    if (snippet) {
      setTitle(snippet.title);
      setCode(snippet.code);
      setLanguage(snippet.language);
      setExplanation(snippet.explanation || '');
    }
  }, [snippet]);

  const handleSave = async () => {
    if (!title.trim() || !code.trim()) {
      return;
    }
    await onSave(title, code, language);
  };

  const isEditing = Boolean(snippet?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Edit Snippet' : 'New Snippet'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            {isEditing && onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={onDelete}
                className="flex items-center space-x-1"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={saving || !title.trim() || !code.trim()}
              className="flex items-center space-x-2"
            >
              {saving ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4" />}
              <span>Save</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Code Editor Column */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    label="Snippet Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a descriptive title..."
                  />
                </div>
                <div className="w-48">
                  <Select
                    label="Language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    options={PROGRAMMING_LANGUAGES}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="light"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineHeight: 1.5,
                  fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", Consolas, monospace',
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                }}
              />
            </div>
          </div>
        </div>

        {/* Explanation Panel */}
        <div className="w-96 p-6 bg-gray-50 border-l border-gray-200">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
            <div className="flex items-center space-x-3 p-6 pb-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Explanation</h3>
                <p className="text-xs text-gray-500">Powered by Google Gemini</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {explanation ? (
                <div className="ai-explanation prose prose-sm prose-gray max-w-none text-gray-700 leading-relaxed break-words overflow-wrap-anywhere">
                  <div className="whitespace-pre-wrap">
                    {explanation.split('\n').map((line, index) => {
                      // Handle different markdown elements for better formatting
                      if (line.startsWith('## ')) {
                        return (
                          <h2 key={index} className="text-lg font-semibold text-gray-900 mt-6 mb-3 first:mt-0 border-b border-gray-200 pb-2">
                            {line.replace('## ', '')}
                          </h2>
                        );
                      } else if (line.startsWith('### ')) {
                        return (
                          <h3 key={index} className="text-base font-semibold text-gray-800 mt-4 mb-2">
                            {line.replace('### ', '')}
                          </h3>
                        );
                      } else if (line.startsWith('*   **') || line.startsWith('- **')) {
                        // Handle bullet points with bold text
                        const cleanLine = line.replace(/^[\*\-\s]+/, '');
                        return (
                          <div key={index} className="ml-4 mb-2 pl-2 border-l-2 border-purple-200">
                            <span className="text-gray-700">{cleanLine}</span>
                          </div>
                        );
                      } else if (line.startsWith('*   ') || line.startsWith('- ')) {
                        // Handle regular bullet points
                        const cleanLine = line.replace(/^[\*\-\s]+/, '');
                        return (
                          <div key={index} className="ml-4 mb-1 pl-2">
                            <span className="text-gray-600">• {cleanLine}</span>
                          </div>
                        );
                      } else if (line.startsWith('```')) {
                        // Handle code blocks
                        return (
                          <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-3 font-mono text-sm overflow-x-auto">
                            <div className="text-gray-500 text-xs mb-2 font-semibold">CODE</div>
                            <pre className="whitespace-pre-wrap text-gray-800">{line.replace('```', '')}</pre>
                          </div>
                        );
                      } else if (line.trim() === '') {
                        // Handle empty lines
                        return <div key={index} className="h-2"></div>;
                      } else if (line.startsWith('**') && line.endsWith('**')) {
                        // Handle bold text
                        const cleanLine = line.replace(/\*\*/g, '');
                        return (
                          <div key={index} className="font-semibold text-gray-800 mb-2">
                            {cleanLine}
                          </div>
                        );
                      } else {
                        // Handle regular paragraphs
                        return (
                          <p key={index} className="mb-3 text-gray-700 leading-relaxed">
                            {line}
                          </p>
                        );
                      }
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                  <p className="text-gray-500 text-sm">
                    AI explanation will appear here after saving your snippet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}