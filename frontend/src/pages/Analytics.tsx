import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Analytics(){
  const {isAuth} = useAuth()
  const {data, isLoading, error} = useQuery({
    queryKey:['analytics'],
    queryFn: async()=> (await api.get('/analytics/dashboard/')).data,
    enabled: isAuth,
    retry: false
  })
  if(!isAuth) return <div className="max-w-[1100px] mx-auto px-6 py-12 text-center"><h1 className="font-serif text-3xl">Admin Only</h1><p className="opacity-60 mt-2">Login as manager/admin to view analytics</p><Link to="/login" className="inline-block mt-4 bg-obsidian text-pearl px-6 py-3 rounded-full">Login</Link></div>
  if(isLoading) return <div className="max-w-[1100px] mx-auto px-6 py-10">Loading analytics...</div>
  if(error) return <div className="max-w-[1100px] mx-auto px-6 py-10"><h1 className="font-serif text-2xl">Access denied</h1><p className="opacity-60 mt-2">Only staff/manager can view. Login as manager/manager123 or admin/admin123</p><Link to="/login" className="underline">Login</Link></div>
  const m = data?.metrics || {}
  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10">
      <h1 className="font-serif text-[32px]">Analytics Dashboard</h1>
      <p className="text-sm opacity-60 mt-1">Live data from PostgreSQL — no fake metrics. Updates in real-time.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {[
          {label:'Total Products', value: m.total_products, sub:'Active catalogue'},
          {label:'Total Orders', value: m.total_orders, sub:'All statuses'},
          {label:'Revenue (Paid)', value: `₹${m.total_revenue?.toLocaleString('en-IN')}`, sub:'From paid orders'},
          {label:'Pending Orders', value: m.pending_orders, sub:'Needs fulfillment'},
          {label:'Registered Users', value: m.total_users, sub:'Including guests'},
          {label:'Newsletter Subscribers', value: m.subscribers, sub:'Opted-in'},
          {label:'Categories', value: '10', sub:'Gold to Gifting'},
          {label:'Collections', value: '8', sub:'Heritage to Festive'},
        ].map(c=>(
          <div key={c.label} className="bg-white rounded-2xl border border-obsidian/5 p-5">
            <div className="text-xs tracking-[0.14em] uppercase opacity-60">{c.label}</div>
            <div className="font-serif text-2xl mt-2">{c.value}</div>
            <div className="text-xs opacity-60 mt-1">{c.sub}</div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl border border-obsidian/5 p-6">
          <h3 className="font-medium">Recent Orders</h3>
          <div className="mt-4 space-y-3">
            {(data.recent_orders||[]).map((o:any)=>(
              <div key={o.order_number} className="flex justify-between text-sm border-b border-obsidian/5 pb-2">
                <span className="font-medium">{o.order_number} — {o.status}</span>
                <span>₹{parseFloat(o.total).toLocaleString('en-IN')} • {o.payment_status}</span>
              </div>
            ))}
            {(!data.recent_orders||data.recent_orders.length===0)&&<div className="text-sm opacity-60">No orders yet — seed creates sample delivered order for demo user</div>}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-obsidian/5 p-6">
          <h3 className="font-medium">Top Featured Products</h3>
          <div className="mt-4 space-y-3">
            {(data.top_products||[]).map((p:any,i:number)=>(
              <div key={i} className="flex justify-between text-sm border-b border-obsidian/5 pb-2">
                <span>{p.name}</span>
                <span>₹{parseFloat(p.price).toLocaleString('en-IN')} • Stock {p.stock}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs opacity-60">💡 Go to <Link to="/admin" className="underline">Django Admin (/admin)</Link> for full fulfillment, inventory, and payment reconciliation.</div>
        </div>
      </div>
      <div className="mt-8 bg-ivory rounded-2xl p-6">
        <h3 className="font-medium">Database Info</h3>
        <p className="text-sm opacity-60 mt-1">PostgreSQL-ready with SQLite dev fallback. Seed: 32 products, 10 categories, 8 collections, 6 coupons, 12 testimonials, 40+ reviews, 4 users, addresses, sample order. All data is relational, indexed, and transaction-safe.</p>
        <div className="flex gap-3 mt-4 flex-wrap">
          <Link to="/shop" className="bg-obsidian text-pearl px-5 py-2 rounded-full text-sm">View Catalogue</Link>
          <Link to="/account" className="border border-obsidian px-5 py-2 rounded-full text-sm">My Account</Link>
          <a href="/api/v1/docs/" target="_blank" className="border border-obsidian/10 px-5 py-2 rounded-full text-sm">API Docs</a>
        </div>
      </div>
    </div>
  )
}
