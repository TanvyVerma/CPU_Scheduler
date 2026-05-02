import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: 'accent' | 'green' | 'amber' | 'red' | 'blue' | 'cyan' | 'default';
  className?: string;
}

const colors = {
  accent:  'bg-[rgba(124,111,255,0.15)] text-[#b39dff] border-[rgba(124,111,255,0.3)]',
  green:   'bg-[rgba(14,207,142,0.15)]  text-[#0ecf8e] border-[rgba(14,207,142,0.3)]',
  amber:   'bg-[rgba(245,166,35,0.15)]  text-[#f5a623] border-[rgba(245,166,35,0.3)]',
  red:     'bg-[rgba(255,107,107,0.15)] text-[#ff6b6b] border-[rgba(255,107,107,0.3)]',
  blue:    'bg-[rgba(91,164,245,0.15)]  text-[#5ba4f5] border-[rgba(91,164,245,0.3)]',
  cyan:    'bg-[rgba(34,211,238,0.15)]  text-[#22d3ee] border-[rgba(34,211,238,0.3)]',
  default: 'bg-white/[0.06] text-[#7e85a0] border-white/[0.1]',
};

export default function Badge({ children, color = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-[6px] py-[2px]
        text-[9px] font-semibold tracking-[0.06em] uppercase
        rounded-[3px] border ${colors[color]} ${className}
      `}
    >
      {children}
    </span>
  );
}
