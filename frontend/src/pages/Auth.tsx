import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

export function Login(){
  const [form,setForm]=useState({username:"", password:""})
  const [err,setErr]=useState("")
  const nav=useNavigate()
  const {login}=useAuth()
  const submit= async(e:any)=>{
    e.preventDefault()
    try{
      const {data}=await api.post('/auth/login/', form)
      login(data.access, data.refresh, data.user)
      nav('/account')
    }catch(err:any){ setErr(err.response?.data?.detail||'Login failed') }
  }
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12 bg-ivory">
      <form onSubmit={submit} className="bg-white rounded-[22px] p-8 w-full max-w-md shadow-luxury border border-obsidian/5 space-y-4">
        <h1 className="font-serif text-[28px]">Welcome back</h1>
        <p className="text-sm opacity-60">Sign in to your Om's account</p>
        {err && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl">{err}</div>}
        <input placeholder="Username or email" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required className="w-full border border-obsidian/15 rounded-full px-4 py-3" />
        <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required className="w-full border border-obsidian/15 rounded-full px-4 py-3" />
        <button className="w-full bg-obsidian text-pearl rounded-full py-3">Login</button>
        <div className="text-sm text-center opacity-70">No account? <Link to="/register" className="underline">Create one</Link></div>
        <div className="text-xs opacity-60 text-center">Demo: demo / demo12345</div>
      </form>
    </div>
  )
}
export function Register(){
  const [form,setForm]=useState({username:"",email:"",password:"",first_name:"",last_name:"",phone:""})
  const [err,setErr]=useState("")
  const [ok,setOk]=useState("")
  const nav=useNavigate()
  const submit= async(e:any)=>{
    e.preventDefault()
    try{
      await api.post('/auth/register/', form)
      setOk('Account created! Please login.')
      setTimeout(()=> nav('/login'), 1200)
    }catch(err:any){ setErr(JSON.stringify(err.response?.data)||'Failed') }
  }
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12 bg-ivory">
      <form onSubmit={submit} className="bg-white rounded-[22px] p-8 w-full max-w-md shadow-luxury border border-obsidian/5 space-y-3">
        <h1 className="font-serif text-[28px]">Create account</h1>
        {err && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl break-all">{err}</div>}
        {ok && <div className="bg-green-50 text-green-700 text-sm p-3 rounded-xl">{ok}</div>}
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="First name" value={form.first_name} onChange={e=>setForm({...form,first_name:e.target.value})} className="border border-obsidian/15 rounded-full px-4 py-3" />
          <input placeholder="Last name" value={form.last_name} onChange={e=>setForm({...form,last_name:e.target.value})} className="border border-obsidian/15 rounded-full px-4 py-3" />
        </div>
        <input placeholder="Username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required className="w-full border border-obsidian/15 rounded-full px-4 py-3" />
        <input placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required className="w-full border border-obsidian/15 rounded-full px-4 py-3" />
        <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="w-full border border-obsidian/15 rounded-full px-4 py-3" />
        <input placeholder="Password (min 8)" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required className="w-full border border-obsidian/15 rounded-full px-4 py-3" />
        <button className="w-full bg-obsidian text-pearl rounded-full py-3">Create Account</button>
        <div className="text-sm text-center opacity-70">Already have account? <Link to="/login" className="underline">Login</Link></div>
      </form>
    </div>
  )
}
