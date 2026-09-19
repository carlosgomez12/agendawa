import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Input({ label, id, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      <input
        id={id}
        className={`rounded-md border border-neutral-200 bg-white px-3.5 py-2.5 text-[15px] text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 ${className}`}
        {...props}
      />
    </div>
  )
}
