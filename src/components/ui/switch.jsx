import React from 'react'
export function Switch({ checked, onCheckedChange }){
  return <label className="inline-flex items-center gap-2 cursor-pointer">
    <input type="checkbox" className="peer sr-only" checked={checked} onChange={e=>onCheckedChange(e.target.checked)} />
    <span className="w-10 h-6 rounded-full bg-slate-300 peer-checked:bg-black relative after:content-[''] after:w-5 after:h-5 after:bg-white after:rounded-full after:absolute after:top-0.5 after:left-0.5 peer-checked:after:translate-x-4 after:transition"></span>
  </label>
}
