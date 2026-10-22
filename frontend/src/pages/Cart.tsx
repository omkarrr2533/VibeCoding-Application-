import { Link, useNavigate } from 'react-router-dom'
import { useCart, useUpdateCart, useRemoveCart } from '../api/hooks'
import { formatINR } from '../utils/format'
import { useState } from 'react'
import { api } from '../api/client'
import { toast } from '../components/Toaster'

export default function Cart(){
  const {data:cart, isLoading}=useCart()
  const upd=useUpdateCart()
  const rem=useRemoveCart()
  const [coupon,setCoupon]=useState("")
  const [discount,setDiscount]=useState(0)
  const [couponMsg,setCouponMsg]=useState("")
  const nav=useNavigate()

  if(isLoading) return <div className="p-10">Loading bag...</div>
  const items=cart?.items||[]
  if(items.length===0) return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-16 text-center">
      <h1 className="font-serif text-3xl">Your bag is empty</h1>
      <p className="opacity-60 mt-2">Discover pieces crafted for your milestones.</p>
      <Link to="/shop" className="inline-block mt-6 bg-obsidian text-pearl px-7 py-3 rounded-full">Explore Collection</Link>
    </div>
  )
  const subtotal = items.reduce((s:any, i:any)=> s+ parseFloat(i.line_total),0)
  const shipping = subtotal>5000?0:99
  const tax = (subtotal - discount) * 0.03
  const total = subtotal - discount + tax + shipping

  const applyCoupon= async()=>{
    try{
      const {data}=await api.post('/coupons/validate/',{code: coupon, subtotal})
      setDiscount(parseFloat(data.discount))
      setCouponMsg(`Coupon applied: -${formatINR(data.discount)}`)
      toast('Coupon applied')
    }catch(err:any){ setCouponMsg(err.response?.data?.detail||'Invalid coupon'); setDiscount(0)}
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-10">
      <h1 className="font-serif text-[32px]">Shopping Bag <span className="text-sm font-sans opacity-60">({cart.total_items} items)</span></h1>
      <div className="grid lg:grid-cols-[1fr_380px] gap-8 mt-6">
        <div className="space-y-4">
          {items.map((it:any)=>(
            <div key={it.id} className="bg-white rounded-2xl p-4 flex gap-4 border border-obsidian/5">
              <Link to={`/product/${it.product_slug}`}><img src={it.product_image||'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'} alt={it.product_name} className="w-24 h-24 rounded-xl object-cover" /></Link>
              <div className="flex-1">
                <Link to={`/product/${it.product_slug}`} className="font-medium">{it.product_name}</Link>
                <div className="text-xs opacity-60">{it.variant_name || it.product_sku}</div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-obsidian/10 rounded-full overflow-hidden text-sm">
                    <button onClick={()=>upd.mutate({id:it.id, quantity: Math.max(1,it.quantity-1)})} className="px-3 py-1.5">−</button>
                    <span className="px-3">{it.quantity}</span>
                    <button onClick={()=>upd.mutate({id:it.id, quantity: it.quantity+1})} className="px-3 py-1.5">+</button>
                  </div>
                  <button onClick={()=>rem.mutate(it.id)} className="text-xs underline opacity-60">Remove</button>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatINR(it.unit_price)}</div>
                <div className="text-xs opacity-60">× {it.quantity} = {formatINR(it.line_total)}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-[22px] border border-obsidian/5 p-6 h-fit lg:sticky lg:top-[88px]">
          <h3 className="font-medium">Order Summary</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
            <div className="flex justify-between text-emerald"><span>Discount</span><span>-{formatINR(discount)}</span></div>
            <div className="flex justify-between"><span>GST (3%)</span><span>{formatINR(tax)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping===0?'Complimentary':formatINR(shipping)}</span></div>
            <div className="border-t pt-3 flex justify-between font-semibold text-base"><span>Total</span><span>{formatINR(total)}</span></div>
          </div>
          <div className="mt-4 flex gap-2">
            <input value={coupon} onChange={e=>setCoupon(e.target.value)} placeholder="Coupon (WELCOME10)" className="flex-1 border border-obsidian/10 rounded-full px-4 py-2.5 text-sm" />
            <button onClick={applyCoupon} className="bg-ivory border border-obsidian/10 rounded-full px-5 text-sm">Apply</button>
          </div>
          {couponMsg && <div className="text-xs mt-2 opacity-70">{couponMsg}</div>}
          <button onClick={()=>nav('/checkout', {state:{coupon, discount}})} className="w-full bg-obsidian text-pearl rounded-full py-3.5 mt-6">Proceed to Checkout</button>
          <div className="text-xs opacity-60 text-center mt-3">Secure checkout • Razorpay test mode</div>
        </div>
      </div>
    </div>
  )
}
