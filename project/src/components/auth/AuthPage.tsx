import React, { useState } from 'react';
import { AuthForm } from './AuthForm';
import { useAuth } from '../../hooks/useAuth';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleAuth = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <AuthForm
      mode={mode}
      onSubmit={handleAuth}
      onToggleMode={toggleMode}
      loading={loading}
    />
  );
}