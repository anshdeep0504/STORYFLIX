import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { BookOpen, LogOut } from 'lucide-react';
import { useAuthStore } from './stores/authStore';
import { supabase } from './lib/supabase';
import { AuthForm } from './components/AuthForm';
import { StoryGenerator } from './components/StoryGenerator';
import { StoryCard } from './components/StoryCard';
import { useStoryStore } from './stores/storyStore';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  return user ? <>{children}</> : <Navigate to="/auth" />;
}

function App() {
  const { user, setUser, signOut } = useAuthStore();
  const { stories, fetchStories } = useStoryStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  useEffect(() => {
    if (user) {
      fetchStories();
    }
  }, [user, fetchStories]);

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Toaster position="top-center" />
        
        {/* Header */}
        <header className="bg-gradient-to-b from-gray-900 to-transparent p-6">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-red-600 text-4xl font-bold flex items-center gap-2">
              <BookOpen className="w-8 h-8" />
              StoryFlix
            </h1>
            {user && (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 text-gray-300 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          <Routes>
            <Route
              path="/auth"
              element={user ? <Navigate to="/" /> : <AuthForm />}
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <div className="space-y-12">
                    <StoryGenerator />
                    
                    {stories.length > 0 && (
                      <div>
                        <h2 className="text-2xl font-semibold mb-6">Your Stories</h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                          {stories.map((story) => (
                            <StoryCard key={story.id} story={story} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;