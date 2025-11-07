import React, { useState } from 'react'
export function Tabs({ defaultValue, children, className='' }) {
  const [value, setValue] = useState(defaultValue)
  return <div className={className}>
    {React.Children.map(children, child => React.cloneElement(child, { value, setValue }))}
  </div>
}
export function TabsList({ children, value, setValue }) {
  return <div className="inline-flex rounded-2xl bg-slate-100 p-1 gap-1">
    {React.Children.map(children, child => React.cloneElement(child, { value, setValue }))}
  </div>
}
export function TabsTrigger({ children, tab, value, setValue }) {
  const active = value===tab
  return <button onClick={()=>setValue(tab)} className={`px-3 py-1.5 text-sm rounded-xl ${active?'bg-white shadow':'text-slate-600'}`}>{children}</button>
}
export function TabsContent({ children, when, value }) {
  if (value!==when) return null
  return <div>{children}</div>
}
