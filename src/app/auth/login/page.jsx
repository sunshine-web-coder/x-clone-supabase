"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import FormInput from '@/components/ui/form-input';
import { loginSchema } from '@/components/FormValidation';
import { useState } from 'react';
import useAuthStore from '@/store/useAuthStore';

export default function LoginPage() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (data) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await login(data.email, data.password);

      if (result.error) {
        setError(result.error.message);
      } else {
        router.push('/home');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
          <h1 className="text-2xl font-bold text-[var(--white)] text-center">Login</h1>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-100 p-2 rounded">
              {error}
            </p>
          )}

          <FormInput 
            control={form.control} 
            name="email" 
            label="Email" 
            type="email" 
            placeholder="Enter your email"
            disabled={isLoading}
          />
          
          <FormInput 
            control={form.control} 
            name="password" 
            label="Password" 
            type="password" 
            placeholder="Enter your password"
            disabled={isLoading}
          />

          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            type="button" 
            className="w-full"
            disabled={isLoading}
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            <span className="text-[var(--black)]">Continue with Google</span>
          </Button>

          <p className="text-center text-[var(--white)] text-sm">
            Don't have an account?{' '}
            <Link 
              href="/auth/signup" 
              className="text-[var(--white)] hover:underline"
              tabIndex={isLoading ? -1 : 0}
            >
              Signup
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}