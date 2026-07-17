interface Props {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'danger' | 'success' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

const variants = {
  primary: 'bg-orange-500 hover:bg-orange-600 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  success: 'bg-emerald-500 hover:bg-emerald-600 text-white',
  secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-800',
  ghost: 'border border-slate-300 hover:bg-slate-100 text-slate-700',
};
const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({
  children, className = '', variant = 'primary', size = 'md',
  isLoading, disabled, type = 'button', onClick,
}: Props) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || isLoading}
    className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
  >
    {isLoading && (
      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    )}
    {children}
  </button>
);

export default Button;
