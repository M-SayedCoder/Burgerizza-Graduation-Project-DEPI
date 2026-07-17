import { z } from 'zod';

// ─── Auth Schemas ────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Full name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
});

// ─── Checkout Schema ─────────────────────────────────────────────

export const checkoutSchema = z.object({
  deliveryAddress: z.string().min(1, 'Delivery address is required'),
  notes: z.string().optional(),
});

// ─── Profile Schema ──────────────────────────────────────────────

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  bio: z.string().max(200, 'Bio must be under 200 characters').optional(),
});

// ─── Address Schema ──────────────────────────────────────────────

export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  postCode: z.string().optional(),
  apartment: z.string().optional(),
  label: z.enum(['home', 'work', 'other']),
});

// ─── Reservation Schema ──────────────────────────────────────────

export const reservationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z
    .string()
    .min(1, 'Phone is required')
    .min(7, 'Enter a valid phone number'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  guests: z
    .coerce.number()
    .min(1, 'At least 1 guest')
    .max(20, 'Maximum 20 guests'),
  notes: z.string().optional(),
});

// ─── Inferred Types ──────────────────────────────────────────────

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
export type AddressFormValues = z.infer<typeof addressSchema>;
export type ReservationFormValues = z.infer<typeof reservationSchema>;
