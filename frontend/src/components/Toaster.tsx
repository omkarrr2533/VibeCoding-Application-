import { useEffect, useState } from 'react'
export function useToast(){
  const [msgs,setMsgs]=useState<string[]>([])
  const push=(m:string)=>{ setMsgs(s=>[...s,m]); setTimeout(()=> setMsgs(s=> s.slice(1)), 3000) }
  return {msgs,push}
}
export function Toaster(){
  // listens to custom event
  const [msgs,setMsgs]=useState<string[]>([])
  useEffect(()=>{
    const h=(e:any)=>{ setMsgs(s=>[...s, e.detail]); setTimeout(()=> setMsgs(s=> s.slice(1)), 3200) }
    window.addEventListener('toast', h as any)
    return ()=> window.removeEventListener('toast', h as any)
  },[])
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2">
      {msgs.map((m,i)=> <div key={i} className="bg-obsidian text-pearl px-5 py-3 rounded-full shadow-luxury text-sm">{m}</div>)}
    </div>
  )
}
export const toast=(msg:string)=> window.dispatchEvent(new CustomEvent('toast',{detail:msg}))
