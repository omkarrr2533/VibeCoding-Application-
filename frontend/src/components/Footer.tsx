import { Link } from 'react-router-dom'
import { useSiteSettings } from '../api/hooks'
export default function Footer(){
  const {data:site}=useSiteSettings()
  return (
    <footer className="bg-obsidian text-pearl">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="font-serif text-2xl tracking-[0.2em]">OM'S JEWELLERS</div>
            <p className="text-sm leading-relaxed text-pearl/70 max-w-sm">{site?.footer_description || "Contemporary Indian luxury jewellery celebrating heritage craftsmanship with modern design. Each piece crafted to honour your most meaningful moments."}</p>
            <div className="text-xs text-pearl/60 space-y-1">
              <div>{site?.address || "MG Road, Pune, Maharashtra 411001"}</div>
              <div>{site?.phone || "+91 98220 12345"} • {site?.email || "hello@omsjewellers.example.com"}</div>
              <div>{site?.business_hours || "10:00 AM - 8:30 PM (Mon-Sun)"}</div>
            </div>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.18em] uppercase text-champagne mb-4">Collections</h4>
            <ul className="space-y-2 text-sm text-pearl/70">
              <li><Link to="/shop" className="hover:text-pearl">Shop All</Link></li>
              <li><Link to="/shop?category=gold-jewellery" className="hover:text-pearl">Gold Jewellery</Link></li>
              <li><Link to="/shop?category=diamond-jewellery" className="hover:text-pearl">Diamond Jewellery</Link></li>
              <li><Link to="/shop?category=bridal" className="hover:text-pearl">Bridal</Link></li>
              <li><Link to="/collections" className="hover:text-pearl">Collections</Link></li>
              <li><Link to="/custom-inquiry" className="hover:text-pearl">Custom Jewellery</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.18em] uppercase text-champagne mb-4">Customer Care</h4>
            <ul className="space-y-2 text-sm text-pearl/70">
              <li><Link to="/care-guide" className="hover:text-pearl">Jewellery Care Guide</Link></li>
              <li><Link to="/shipping-returns" className="hover:text-pearl">Shipping & Returns</Link></li>
              <li><Link to="/faq" className="hover:text-pearl">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-pearl">Contact Us</Link></li>
              <li><Link to="/track-order" className="hover:text-pearl">Order Tracking</Link></li>
              <li><Link to="/wishlist" className="hover:text-pearl">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.18em] uppercase text-champagne mb-4">Stay in Touch</h4>
            <p className="text-sm text-pearl/70 mb-3">Join for early access to new collections & private appointments.</p>
            <NewsletterInline />
            <div className="flex gap-3 mt-6 text-xs tracking-widest uppercase text-pearl/50">
              <a href="#" className="hover:text-champagne">Instagram</a>
              <span>•</span><a href="#" className="hover:text-champagne">Facebook</a>
              <span>•</span><a href="#" className="hover:text-champagne">Pinterest</a>
            </div>
            <div className="mt-6 flex gap-2">
              <div className="h-6 w-10 rounded bg-white/10 border border-white/10" /><div className="h-6 w-10 rounded bg-white/10 border border-white/10" /><div className="h-6 w-10 rounded bg-white/10 border border-white/10" />
              <span className="text-[11px] text-pearl/50 ml-2">Secure checkout • Razorpay • UPI • Cards • Netbanking</span>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-xs text-pearl/50">
          <div>© {new Date().getFullYear()} Om's Jewellers. All rights reserved. • <Link to="/privacy" className="hover:text-pearl">Privacy</Link> • <Link to="/terms" className="hover:text-pearl">Terms</Link></div>
          <div>Crafted with heritage • Made in India • BIS Hallmarked where applicable</div>
        </div>
      </div>
    </footer>
  )
}

import { useState } from 'react'
import { api } from '../api/client'
function NewsletterInline(){
  const [email,setEmail]=useState("")
  const [msg,setMsg]=useState("")
  const submit= async(e:any)=>{
    e.preventDefault()
    try{
      await api.post('/newsletter/subscribe/',{email, consent_given:true})
      setMsg("Thank you for subscribing!")
      setEmail("")
    }catch(err:any){ setMsg(err.response?.data?.detail || "Subscribed or error") }
  }
  return (
    <form onSubmit={submit} className="flex gap-2">
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email" required type="email" className="flex-1 bg-white/10 border border-white/15 rounded-full px-4 py-2.5 text-sm placeholder:text-pearl/40 outline-none" />
      <button className="bg-champagne text-obsidian px-5 rounded-full text-sm font-medium">Join</button>
      {msg && <span className="sr-only">{msg}</span>}
    </form>
  )
}
