import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'react-hot-toast';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(false); // Default to signup view
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ password: '' });
  const { signIn, signUp } = useAuthStore();

  const validatePassword = () => {
    if (password.length < 6) {
      setErrors({ password: 'Password must be at least 6 characters long' });
      return false;
    }
    setErrors({ password: '' });
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success('Welcome back!');
      } else {
        await signUp(email, password);
        toast.success('Account created successfully! Please sign in.');
        setIsLogin(true); // Switch to login view after successful signup
        setEmail(''); // Clear form
        setPassword('');
      }
    } catch (error: any) {
      if (error.message === 'User already registered') {
        toast.error('This email is already registered. Please sign in instead.');
        setIsLogin(true);
      } else if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password. Please try again.');
      } else if (error.message.includes('weak_password')) {
        setErrors({ password: 'Password must be at least 6 characters long' });
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-gray-900 p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword();
            }}
            className={`w-full bg-gray-800 rounded-lg px-4 py-2 focus:ring-2 ${
              errors.password ? 'ring-2 ring-red-500' : 'focus:ring-red-600'
            }`}
            required
          />
          {errors.password && (
            <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.password}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
        >
          {isLogin ? (
            <>
              <LogIn className="w-5 h-5" /> Sign In
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" /> Sign Up
            </>
          )}
        </button>
      </form>
      <button
        onClick={() => {
          setIsLogin(!isLogin);
          setErrors({ password: '' });
          setEmail('');
          setPassword('');
        }}
        className="w-full text-center mt-4 text-gray-400 hover:text-white transition-colors"
      >
        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
      </button>
    </div>
  );
}