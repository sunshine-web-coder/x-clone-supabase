// src/app/signup/page.js
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import FormInput from '@/components/ui/form-input';
import { signupSchema } from '@/components/FormValidation';
import { useState } from 'react';
import useAuthStore from '@/store/useAuthStore';

export default function SignupPage() {
  const [error, setError] = useState(null);
  const router = useRouter();
  const { signup } = useAuthStore();
  const [loading, setIsLoading] = useState(false)

  // ✅ Use `useForm` for validation and form state management
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      displayName: '',
      username: '',
      email: '',
      password: '',
    },
  });

  // ✅ Form submission handler
  const handleSignup = async (data) => {
    setIsLoading(true);
    setError(null);

    const { user, error } = await signup(data.displayName, data.username, data.email, data.password);

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push('/home'); // Redirect to home after successful signup
    }
  };

  return (
    <div className="w-full">
      {/* ✅ Ensure FormProvider wraps everything */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignup)} className="space-y-4">
          <h1 className="text-2xl font-bold text-[var(--white)] text-center">Sign Up</h1>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          {/* ✅ Form Inputs */}
          <FormInput control={form.control} name="displayName" label="Display Name" placeholder="Enter your name" />
          <FormInput control={form.control} name="username" label="Username" placeholder="Choose a username" />
          <FormInput control={form.control} name="email" label="Email" type="email" placeholder="Enter your email" />
          <FormInput control={form.control} name="password" label="Password" type="password" placeholder="Enter your password" />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button variant="outline" type="button" className="w-full">
            <FcGoogle className="mr-2 h-4 w-4" />
            <span className="text-[var(--black)]">Continue with Google</span>
          </Button>

          <p className="text-center text-[var(--white)] text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[var(--white)] hover:underline">
              Login
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
