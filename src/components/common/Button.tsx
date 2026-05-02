import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'danger' | 'success' | 'ghost';
  size?: 'xs' | 'sm' | 'md';
  children: ReactNode;
  fullWidth?: boolean;
}

const variants = {
  default: 'bg-[#151720] border border-white/[0.07] text-[#dde1f0] hover:bg-[#1d2030] hover:border-white/[0.13]',
  primary: 'bg-[#7c6fff] border border-[#7c6fff] text-white hover:bg-[#6a5ef5]',
  danger:  'bg-[rgba(255,107,107,0.1)] border border-[rgba(255,107,107,0.3)] text-[#ff6b6b] hover:bg-[rgba(255,107,107,0.18)]',
  success: 'bg-[rgba(14,207,142,0.12)] border border-[rgba(14,207,142,0.3)] text-[#0ecf8e] hover:bg-[rgba(14,207,142,0.2)]',
  ghost:   'bg-transparent border border-transparent text-[#7e85a0] hover:text-[#dde1f0] hover:bg-white/[0.04]',
};

const sizes = {
  xs: 'px-2 py-1 text-[10px] rounded-[4px]',
  sm: 'px-[10px] py-[4px] text-[11px] rounded-[5px]',
  md: 'px-3 py-[6px] text-[12px] rounded-[6px]',
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
        font-medium font-['Outfit'] transition-all duration-150
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
