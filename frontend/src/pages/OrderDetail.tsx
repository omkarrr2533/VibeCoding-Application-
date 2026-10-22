import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'
import { formatINR } from '../utils/format'

export default function OrderDetail(){
  const {id}=useParams()
  const {data:order}=useQuery({ queryKey:['order',id], queryFn: async()=>(await api.get(`/orders/${id}/`)).data, enabled: !!id })
  const {data:tracking}=useQuery({ queryKey:['tracking',id], queryFn: async()=>(await api.get(`/orders/${id}/tracking/`)).data, enabled: !!id })
  if(!order) return <div className="p-10">Loading...</div>
  return (
    <div className="max-w-[1000px] mx-auto px-6 md:px-10 py-10">
      <h1 className="font-serif text-[32px]">Order {order.order_number}</h1>
      <div className="text-sm opacity-60">{new Date(order.created_at).toLocaleString()} • {order.status} • Payment: {order.payment_status}</div>
      <div className="grid lg:grid-cols-[1fr_320px] gap-6 mt-6">
        <div className="bg-white rounded-[22px] border border-obsidian/5 p-6">
          <h3 className="font-medium">Items</h3>
          <div className="mt-4 space-y-3">
            {order.items.map((it:any)=>(
              <div key={it.id} className="flex justify-between border-b border-obsidian/5 py-3 text-sm"><span>{it.product_name} {it.variant_name && `(${it.variant_name})`} × {it.quantity}</span><span>{formatINR(it.unit_price)} → {formatINR(it.line_total)}</span></div>
            ))}
          </div>
          <div className="mt-6 space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
            <div className="flex justify-between"><span>Discount</span><span>-{formatINR(order.discount)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{formatINR(order.tax)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{formatINR(order.shipping)}</span></div>
            <div className="flex justify-between font-semibold border-t pt-3"><span>Total</span><span>{formatINR(order.total)}</span></div>
          </div>
          <div className="mt-6 text-sm">
            <div><span className="font-medium">Shipping:</span> {order.shipping_name}, {order.shipping_phone}, {order.shipping_email}</div>
            <div className="opacity-70 mt-1">{order.shipping_address}</div>
          </div>
          {order.status==='confirmed' && <div className="mt-6 bg-green-50 text-green-800 p-4 rounded-xl text-sm">Payment confirmed! Your order is being prepared. Track below.</div>}
        </div>
        <div className="bg-white rounded-[22px] border border-obsidian/5 p-6">
          <h3 className="font-medium">Tracking</h3>
          <div className="text-xs opacity-60">{tracking?.tracking_number}</div>
          <div className="mt-4 space-y-3">
            {(tracking?.tracking||[]).map((s:any,i:number)=>(
              <div key={i} className="flex gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${s.completed?'bg-emerald text-white':'bg-ivory border'}`}>{s.completed?'✓':'○'}</div>
                <div><div className={`text-sm ${s.completed?'font-medium':''}`}>{s.label}</div><div className="text-xs opacity-60">{s.status}</div></div>
              </div>
            ))}
          </div>
          <Link to="/shipping-returns" className="text-xs underline mt-4 block">Shipping & returns</Link>
        </div>
      </div>
      <Link to="/account" className="inline-block mt-6 underline">Back to account</Link>
    </div>
  )
}
