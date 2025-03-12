import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
});

export const signupSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters long' }).max(50, { message: 'Name must be at most 50 characters long' }),
  username: z.string()
  .min(3, { message: 'Username must be at least 3 characters long' })
  .max(20, { message: 'Username must be at most 20 characters long' })
  .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  // date_of_birth: z.date().max(new Date(), { message: 'Date of birth cannot be in the future' })
});
