import React from 'react'
export function Button({ className = '', variant='default', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm shadow-sm transition active:scale-[.99]'
  const variants = {
    default: 'bg-black text-white hover:opacity-90',
    secondary: 'bg-white text-black border border-slate-200 hover:bg-slate-50',
    ghost: 'bg-transparent text-black'
  }
  return <button className={`${base} ${variants[variant]||variants.default} ${className}`} {...props} />
}
