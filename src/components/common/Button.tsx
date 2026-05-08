import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'danger' | 'success' | 'ghost';
  size?: 'xs' | 'sm' | 'md';
  children: ReactNode;
  fullWidth?: boolean;
}

const variants = {
  default: 'bg-[#151720] border border-white/[0.07] text-[#dde1f0] hover:bg-[#1d2030] hover:border-white/[0.13] hover:shadow-md',
  primary: 'bg-[#7c6fff] border border-[#7c6fff] text-white hover:bg-[#6a5ef5] hover:shadow-lg hover:shadow-[#7c6fff]/25',
  danger:  'bg-[rgba(255,107,107,0.1)] border border-[rgba(255,107,107,0.3)] text-[#ff6b6b] hover:bg-[rgba(255,107,107,0.18)] hover:border-[#ff6b6b] hover:shadow-md',
  success: 'bg-[rgba(14,207,142,0.12)] border border-[rgba(14,207,142,0.3)] text-[#0ecf8e] hover:bg-[rgba(14,207,142,0.2)] hover:border-[#0ecf8e] hover:shadow-md',
  ghost:   'bg-transparent border border-transparent text-[#7e85a0] hover:text-[#dde1f0] hover:bg-white/[0.04] hover:border-white/[0.07]',
};

const sizes = {
  xs: 'px-2.5 py-1.5 text-[10px] rounded-md',
  sm: 'px-3 py-2 text-[11px] rounded-md',
  md: 'px-4 py-2.5 text-[12px] rounded-lg',
};

export default function Button({
  variant = 'default',
  size = 'sm',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-1.5
        font-medium font-['Outfit'] transition-all duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-40 cursor-not-allowed hover:shadow-none' : 'cursor-pointer active:scale-95'}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
