import React from 'react'
export function Card({ className='', ...props }) {
  return <div className={`bg-white rounded-2xl shadow border border-slate-200 ${className}`} {...props} />
}
export function CardContent({ className='', ...props }) {
  return <div className={`p-4 ${className}`} {...props} />
}
