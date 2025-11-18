import React from 'react';
import { LoginForm } from '@/components/auth/login-form';

export const metadata = {
  title: 'Sign In - Varanasi Empire Solutions',
  description: 'Sign in to your account',
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="w-full px-4 sm:px-6">
        <LoginForm />
      </div>
    </div>
  );
}
