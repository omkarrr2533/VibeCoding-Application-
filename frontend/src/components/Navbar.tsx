import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react'
import { useCart, useCollections } from '../api/hooks'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Home', to:'/' },
  { label: 'Shop All', to:'/shop' },
  { label: 'Collections', to:'/collections' },
  { label: 'Gold', to:'/shop?material=Gold' },
  { label: 'Diamond', to:'/shop?material=Diamond' },
  { label: 'Bridal', to:'/shop?category=bridal' },
  { label: 'Our Story', to:'/about' },
  { label: 'Contact', to:'/contact' },
]

export default function Navbar(){
  const [scrolled,setScrolled]=useState(false)
  const [open,setOpen]=useState(false)
  const [mega,setMega]=useState(false)
  const [q,setQ]=useState("")
  const {data:cart}=useCart()
  const {data:coll}=useCollections()
  const {isAuth, user, logout}=useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const isHome = loc.pathname === '/'
  useEffect(()=>{
    const onScroll=()=> setScrolled(window.scrollY>12)
    window.addEventListener('scroll', onScroll)
    return ()=>window.removeEventListener('scroll', onScroll)
  },[])
  const count = cart?.total_items ?? cart?.items?.length ?? 0

  const headerBg = scrolled || !isHome ? 'bg-pearl/95 backdrop-blur-xl shadow-[0_1px_20px_rgba(0,0,0,0.06)]' : 'bg-transparent'
  const textCls = scrolled || !isHome ? 'text-obsidian' : 'text-pearl'

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-500 border-b ${scrolled||!isHome ? 'border-obsidian/5' : 'border-white/10'} ${headerBg}`}>
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-[68px] flex items-center justify-between gap-6">
          {/* left nav desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.slice(0,4).map(l=>(
              <NavLink key={l.label} to={l.to} className={({isActive})=>`text-[11px] tracking-[0.14em] uppercase font-medium relative group ${textCls} ${isActive?'opacity-100':'opacity-80 hover:opacity-100'}`}>
                {l.label}
                <span className="absolute left-0 -bottom-1 w-0 h-px bg-champagne group-hover:w-full transition-all duration-300" />
              </NavLink>
            ))}
            <div onMouseEnter={()=>setMega(true)} onMouseLeave={()=>setMega(false)} className={`relative cursor-pointer text-[11px] tracking-[0.14em] uppercase font-medium flex items-center gap-1 ${textCls} opacity-80 hover:opacity-100`}>
              Collections <ChevronDown size={14} className={`transition ${mega?'rotate-180':''}`}/>
              <AnimatePresence>
                {mega && (
                  <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}} className="absolute top-full left-0 mt-4 w-[560px] bg-pearl text-obsidian rounded-2xl shadow-luxury overflow-hidden border border-obsidian/5 p-6 grid grid-cols-3 gap-4">
                    {(coll?.results||[]).slice(0,6).map((c:any)=>(
                      <Link key={c.slug} to={`/collections/${c.slug}`} className="group">
                        <div className="h-28 rounded-xl overflow-hidden bg-ivory relative">
                          <img src={`https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop`} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          <div className="absolute bottom-2 left-3 text-pearl text-sm font-serif">{c.title}</div>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* logo */}
          <Link to="/" className="flex-1 lg:flex-none flex justify-center lg:justify-start">
            <div className={`text-center leading-none ${textCls}`}>
              <div className="font-serif text-[22px] md:text-[26px] tracking-[0.22em] font-[600]">OM'S JEWELLERS</div>
              <div className="text-[9px] tracking-[0.34em] uppercase opacity-60 -mt-1">Pune • Since 1998</div>
            </div>
          </Link>

          {/* right */}
          <div className={`hidden lg:flex items-center gap-5 ${textCls}`}>
            {navLinks.slice(5).map(l=>(
              <NavLink key={l.label} to={l.to} className="text-[11px] tracking-[0.14em] uppercase font-medium opacity-80 hover:opacity-100">{l.label}</NavLink>
            ))}
            <NavLink to="/analytics" className="text-[11px] tracking-[0.14em] uppercase font-medium opacity-80 hover:opacity-100">Analytics</NavLink>
          </div>

          {/* actions */}
          <div className={`flex items-center gap-3 md:gap-4 ${textCls}`}>
            <div className="hidden md:flex items-center gap-1 bg-white/10 backdrop-blur rounded-full px-3 py-1.5 border border-white/20">
              <Search size={16} className="opacity-60"/>
              <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=> e.key==='Enter' && q && nav(`/search?q=${encodeURIComponent(q)}`)} placeholder="Search" className="bg-transparent outline-none text-sm placeholder:opacity-60 w-24 lg:w-28" />
            </div>
            <Link to={isAuth?"/account":"/login"} className="opacity-80 hover:opacity-100"><User size={18} /></Link>
            <Link to="/wishlist" className="opacity-80 hover:opacity-100"><Heart size={18} /></Link>
            <Link to="/cart" className="relative opacity-90 hover:opacity-100">
              <ShoppingBag size={19} />
              {count>0 && <span className="absolute -top-2 -right-2 bg-champagne text-obsidian text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{count}</span>}
            </Link>
            <button onClick={()=>setOpen(v=>!v)} className="lg:hidden"><Menu size={20} /></button>
          </div>
        </div>

        {/* mobile drawer */}
        <AnimatePresence>
          {open && (
            <motion.div initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring', damping:26}} className="fixed inset-0 bg-pearl z-50 lg:hidden overflow-y-auto">
              <div className="flex items-center justify-between px-6 h-[68px] border-b border-obsidian/10">
                <div className="font-serif text-lg tracking-[0.2em]">OM'S JEWELLERS</div>
                <button onClick={()=>setOpen(false)} className="p-2"><X/></button>
              </div>
              <div className="px-6 py-6 space-y-4">
                <div className="flex gap-2">
                  <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search jewellery" className="flex-1 border border-obsidian/15 rounded-full px-4 py-3 bg-white" />
                  <button onClick={()=> q && (nav(`/search?q=${q}`), setOpen(false))} className="bg-obsidian text-pearl rounded-full px-6">Search</button>
                </div>
                {navLinks.map(l=> <Link key={l.label} to={l.to} onClick={()=>setOpen(false)} className="block py-3 text-sm tracking-[0.12em] uppercase border-b border-obsidian/5">{l.label}</Link>)}
                {!isAuth ? (
                  <div className="flex gap-3 pt-4"><Link to="/login" className="flex-1 bg-obsidian text-pearl py-3 rounded-full text-center">Login</Link><Link to="/register" className="flex-1 border border-obsidian py-3 rounded-full text-center">Register</Link></div>
                ): (
                  <div className="pt-4"><p className="text-sm opacity-60">Hi, {user?.first_name||user?.username}</p><button onClick={()=>{logout(); setOpen(false)}} className="underline text-sm">Logout</button></div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
