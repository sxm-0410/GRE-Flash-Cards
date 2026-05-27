import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      // Check if user explicitly asked to be kept signed in
      const keepMeSignedIn = localStorage.getItem('keepMeSignedIn') === 'true';
      
      // sessionStorage is cleared when the tab/window is closed. 
      // If we don't have a tab session, and they didn't ask to be kept signed in, we sign them out.
      const hasTabSession = sessionStorage.getItem('tabSessionActive') === 'true';

      if (!keepMeSignedIn && !hasTabSession) {
        // They closed the browser and didn't want to stay signed in. Clear it out.
        await supabase.auth.signOut();
      }

      // Mark this tab as active for the duration of this window
      sessionStorage.setItem('tabSessionActive', 'true');

      // Now check the actual supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    localStorage.removeItem('keepMeSignedIn');
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

