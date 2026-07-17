import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MdClose, MdPerson, MdLock, MdSave, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { profileService } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

// ======= Schemas =======
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Enter a valid phone number'),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm your new password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

// ======= Sub-components =======
const FormInput = ({
  label, error, type = 'text', placeholder, rightEl, ...rest
}: { label: string; error?: string; type?: string; placeholder?: string; rightEl?: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        {...rest}
        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition ${
          error ? 'border-red-400' : 'border-slate-200'
        } ${rightEl ? 'pr-10' : ''}`}
      />
      {rightEl && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>}
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// ======= Profile Tab =======
const ProfileTab = ({ onClose }: { onClose: () => void }) => {
  const { user, loginUser, token } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '', phone: user?.phone ?? '' },
  });

  const onSubmit = async (data: ProfileForm) => {
    try {
      const updated = await profileService.updateProfile(data);
      loginUser(token!, updated);
      toast.success('Profile updated successfully!');
      onClose();
    } catch {
      toast.error('Failed to update profile');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-bold">
          {user?.name?.[0]?.toUpperCase() ?? 'M'}
        </div>
        <div>
          <p className="font-semibold text-slate-800">{user?.name}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
            user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
          }`}>{user?.role}</span>
        </div>
      </div>

      <FormInput label="Full Name" placeholder="Your full name" error={errors.name?.message} {...register('name')} />
      <FormInput label="Email Address" type="email" placeholder="your@email.com" error={errors.email?.message} {...register('email')} />
      <FormInput label="Phone Number" placeholder="01xxxxxxxxx" error={errors.phone?.message} {...register('phone')} />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white rounded-xl py-2.5 font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        {isSubmitting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <MdSave />}
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

// ======= Password Tab =======
const PasswordTab = () => {
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordForm) => {
    try {
      await profileService.changePassword(data);
      toast.success('Password changed successfully!');
      reset();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to change password');
    }
  };

  const EyeBtn = ({ field }: { field: keyof typeof show }) => (
    <button type="button" onClick={() => setShow((s) => ({ ...s, [field]: !s[field] }))}
      className="text-slate-400 hover:text-slate-600 transition-colors">
      {show[field] ? <MdVisibilityOff className="text-lg" /> : <MdVisibility className="text-lg" />}
    </button>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-700 mb-2">
        <p className="font-semibold mb-1">Password Requirements:</p>
        <ul className="space-y-0.5 list-disc pl-4">
          <li>At least 6 characters long</li>
          <li>Different from your current password</li>
        </ul>
      </div>

      <FormInput
        label="Current Password" type={show.current ? 'text' : 'password'}
        placeholder="Enter current password" error={errors.currentPassword?.message}
        rightEl={<EyeBtn field="current" />} {...register('currentPassword')}
      />
      <FormInput
        label="New Password" type={show.new ? 'text' : 'password'}
        placeholder="Enter new password" error={errors.newPassword?.message}
        rightEl={<EyeBtn field="new" />} {...register('newPassword')}
      />
      <FormInput
        label="Confirm New Password" type={show.confirm ? 'text' : 'password'}
        placeholder="Confirm new password" error={errors.confirmPassword?.message}
        rightEl={<EyeBtn field="confirm" />} {...register('confirmPassword')}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white rounded-xl py-2.5 font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        {isSubmitting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <MdLock />}
        {isSubmitting ? 'Changing...' : 'Change Password'}
      </button>
    </form>
  );
};

// ======= Main Modal =======
interface Props { isOpen: boolean; onClose: () => void; }

const ProfileModal = ({ isOpen, onClose }: Props) => {
  const [tab, setTab] = useState<'profile' | 'password'>('profile');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Account Settings</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          {([
            { key: 'profile', label: 'Profile Info', icon: MdPerson },
            { key: 'password', label: 'Change Password', icon: MdLock },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === key
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="text-base" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {tab === 'profile' ? <ProfileTab onClose={onClose} /> : <PasswordTab />}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
