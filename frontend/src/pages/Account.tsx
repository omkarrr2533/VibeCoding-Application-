import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'
import { useEffect, useState } from 'react'

export default function Account(){
  const {user, logout, isAuth}=useAuth()
  const nav=useNavigate()
  const {data:orders}=useQuery({ queryKey:['orders'], queryFn: async()=>(await api.get('/orders/')).data, enabled: isAuth })
  const [edit,setEdit]=useState(false)
  const [form,setForm]=useState({first_name:user?.first_name||"", last_name:user?.last_name||""})

  useEffect(()=>{ if(user) setForm({first_name:user.first_name||"", last_name:user.last_name||""}) },[user])

  if(!isAuth) return <div className="p-12 text-center">Please <Link to="/login" className="underline">login</Link></div>

  const save= async()=>{
    await api.patch('/auth/me/', form)
    alert('Updated')
    setEdit(false)
  }

  return (
    <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-10">
      <h1 className="font-serif text-[32px]">My Account</h1>
      <div className="grid md:grid-cols-[320px_1fr] gap-8 mt-6">
        <div className="bg-white rounded-[22px] border border-obsidian/5 p-6">
          <div className="font-medium">{user?.first_name} {user?.last_name}</div>
          <div className="text-sm opacity-60">{user?.email} • {user?.username}</div>
          <div className="mt-6 space-y-2 text-sm">
            <Link to="/account" className="block bg-obsidian text-pearl rounded-full px-4 py-2 text-center">Dashboard</Link>
            <Link to="/wishlist" className="block border rounded-full px-4 py-2 text-center">Wishlist</Link>
            <Link to="/cart" className="block border rounded-full px-4 py-2 text-center">Bag</Link>
            <Link to="/track-order" className="block border rounded-full px-4 py-2 text-center">Track Order</Link>
            <button onClick={()=>{logout(); nav('/')}} className="w-full border border-red-200 text-red-600 rounded-full px-4 py-2">Logout</button>
          </div>
          <div className="mt-6 bg-ivory rounded-xl p-4">
            <div className="text-sm font-medium">Need help?</div>
            <div className="text-xs opacity-60 mt-1">Contact care@omsjewellers.example.com</div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[22px] border border-obsidian/5 p-6">
            <div className="flex justify-between items-center"><h3 className="font-medium">Profile</h3><button onClick={()=>setEdit(!edit)} className="text-sm underline">{edit?'Cancel':'Edit'}</button></div>
            {edit ? (
              <div className="mt-4 space-y-3">
                <input value={form.first_name} onChange={e=>setForm({...form,first_name:e.target.value})} placeholder="First name" className="w-full border rounded-full px-4 py-2.5" />
                <input value={form.last_name} onChange={e=>setForm({...form,last_name:e.target.value})} placeholder="Last name" className="w-full border rounded-full px-4 py-2.5" />
                <button onClick={save} className="bg-obsidian text-pearl rounded-full px-6 py-2">Save</button>
              </div>
            ) : (
              <div className="text-sm opacity-70 mt-3">Username: {user?.username} • Phone: {user?.phone||'—'}</div>
            )}
          </div>

          <div className="bg-white rounded-[22px] border border-obsidian/5 p-6">
            <h3 className="font-medium">Order History</h3>
            <div className="mt-4 space-y-3">
              {(orders?.results||orders||[]).length===0 && <div className="text-sm opacity-60">No orders yet. <Link to="/shop" className="underline">Start shopping</Link></div>}
              {(orders?.results||orders||[]).map((o:any)=>(
                <Link key={o.id} to={`/order/${o.id}`} className="flex justify-between items-center border border-obsidian/5 rounded-xl p-4 hover:bg-ivory">
                  <div><div className="font-medium text-sm">{o.order_number} • {o.status} • {o.payment_status}</div><div className="text-xs opacity-60">{new Date(o.created_at).toLocaleString()} • ₹{o.total}</div></div>
                  <span className="text-sm underline">View</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
