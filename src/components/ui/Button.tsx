import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'stamp' | 'outline-dark' | 'outline-ink' | 'solid' | 'ghost' | 'whatsapp'
  size?: 'md' | 'lg'
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

const variants: Record<string, string> = {
  stamp:
    'bg-accent text-asphalt rounded-full uppercase tracking-wide hover:bg-accent-dark active:scale-[0.97] shadow-[0_0_0_3px_rgba(255,107,26,0.25)]',
  'outline-dark':
    'border-2 border-cream/30 text-cream rounded-full hover:border-cream active:scale-[0.97]',
  'outline-ink':
    'border-2 border-ink/25 text-ink rounded-full hover:border-ink active:scale-[0.97]',
  solid:
    'bg-accent text-white rounded-md hover:bg-accent-dark active:scale-[0.98] shadow-sm',
  ghost:
    'bg-transparent text-ink border border-black/10 rounded-md hover:bg-black/5 active:scale-[0.98]',
  whatsapp:
    'bg-whatsapp text-white rounded-md hover:brightness-95 active:scale-[0.98] shadow-sm',
}

const sizes: Record<string, string> = {
  md: 'px-4 py-2 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export function Button({
  variant = 'solid',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
