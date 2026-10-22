import axios from 'axios'

const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(cfg=>{
  const token = localStorage.getItem('access_token')
  if(token) cfg.headers.Authorization = `Bearer ${token}`
  const sessionKey = localStorage.getItem('session_key')
  if(sessionKey) cfg.headers['X-Session-Key'] = sessionKey
  else {
    const sk = localStorage.getItem('session_key') || ('sk_'+Math.random().toString(36).slice(2))
    localStorage.setItem('session_key', sk)
    cfg.headers['X-Session-Key'] = sk
  }
  return cfg
})

api.interceptors.response.use(r=>r, async err=>{
  if(err.response?.status===401){
    // try refresh? for now clear
  }
  return Promise.reject(err)
})
