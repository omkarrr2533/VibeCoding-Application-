import { useState } from 'react'
import { api } from '../api/client'
export default function Tracking(){
  const [id,setId]=useState("")
  const [data,setData]=useState<any>(null)
  const [err,setErr]=useState("")
  const go= async()=>{
    try{ const {data}=await api.get(`/orders/${id}/tracking/`); setData(data); setErr("")}catch(e:any){ setErr('Order not found or not authorized') }
  }
  return (
    <div className="max-w-[720px] mx-auto px-6 py-12">
      <h1 className="font-serif text-[32px]">Order Tracking</h1>
      <p className="text-sm opacity-60 mt-2">Enter your order ID to track. Ownership is enforced — you can only track your own orders.</p>
      <div className="flex gap-3 mt-6">
        <input value={id} onChange={e=>setId(e.target.value)} placeholder="Order ID (e.g. 1)" className="flex-1 border border-obsidian/15 rounded-full px-4 py-3" />
        <button onClick={go} className="bg-obsidian text-pearl rounded-full px-7">Track</button>
      </div>
      {err && <div className="text-sm text-red-600 mt-3">{err}</div>}
      {data && (
        <div className="bg-white rounded-2xl border border-obsidian/5 p-6 mt-6">
          <div className="font-medium">Order {data.order.order_number} — {data.order.status} — {data.order.payment_status}</div>
          <div className="text-sm opacity-60 mt-1">Tracking: {data.tracking_number}</div>
          <div className="mt-4 space-y-3">
            {data.tracking.map((s:any,i:number)=> <div key={i} className="flex gap-3"><div className={`w-6 h-6 rounded-full flex items-center justify-center ${s.completed?'bg-emerald text-white':'bg-ivory border'}`}>{s.completed?'✓':'○'}</div><div className="text-sm">{s.label} — {s.status}</div></div>)}
          </div>
        </div>
      )}
    </div>
  )
}
