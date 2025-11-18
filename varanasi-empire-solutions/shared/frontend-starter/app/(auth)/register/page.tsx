import React from 'react';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata = {
  title: 'Sign Up - Varanasi Empire Solutions',
  description: 'Create a new account',
};

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="w-full px-4 sm:px-6">
        <RegisterForm />
      </div>
    </div>
  );
}
