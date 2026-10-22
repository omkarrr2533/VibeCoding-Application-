import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useCart } from '../api/hooks'
import { formatINR } from '../utils/format'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

declare global { interface Window{ Razorpay:any } }

export default function Checkout(){
  const {data:cart}=useCart()
  const {isAuth}=useAuth()
  const nav=useNavigate()
  const loc=useLocation() as any
  const initialCoupon=loc.state?.coupon||""
  const items=cart?.items||[]
  const subtotal=items.reduce((s:any,i:any)=> s+ parseFloat(i.line_total),0)
  const discount=loc.state?.discount||0
  const shipping=subtotal>5000?0:99
  const tax=(subtotal - discount)*0.03
  const total=subtotal - discount + tax + shipping

  const [form,setForm]=useState({shipping_name:"", shipping_phone:"", shipping_email:"", shipping_address:"", billing_address:"", coupon_code: initialCoupon, notes:""})
  const [loading,setLoading]=useState(false)
  const [err,setErr]=useState("")

  if(!isAuth) return <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-12 text-center"><h1 className="font-serif text-3xl">Please login to checkout</h1><Link to="/login" className="inline-block mt-6 bg-obsidian text-pearl px-7 py-3 rounded-full">Login</Link></div>
  if(!items.length) return <div className="p-10 text-center">Cart empty <Link to="/shop" className="underline">Shop</Link></div>

  const placeOrder= async()=>{
    setLoading(true); setErr("")
    try{
      // create order
      const {data:order}=await api.post('/orders/create/', {...form, coupon_code: form.coupon_code})
      // create payment
      const {data:pay}=await api.post('/payments/create/',{order_id: order.id})
      // load razorpay script if not present
      const loadRazor=()=> new Promise<void>((res,rej)=>{
        if(window.Razorpay) return res()
        const s=document.createElement('script')
        s.src='https://checkout.razorpay.com/v1/checkout.js'
        s.onload=()=>res()
        s.onerror=()=>rej('Failed to load Razorpay')
        document.body.appendChild(s)
      })
      await loadRazor()
      const options={
        key: pay.razorpay_key_id,
        amount: pay.amount_paise,
        currency: "INR",
        name: "Om's Jewellers",
        description: `Order ${pay.order_number}`,
        order_id: pay.razorpay_order_id,
        handler: async function(resp:any){
          try{
            await api.post('/payments/verify/',{razorpay_order_id: resp.razorpay_order_id, razorpay_payment_id: resp.razorpay_payment_id, razorpay_signature: resp.razorpay_signature, order_id: order.id})
            nav(`/order/${order.id}`, {replace:true})
          }catch(e:any){ setErr('Payment verification failed'); nav(`/order/${order.id}`) }
        },
        prefill:{ name: form.shipping_name, email: form.shipping_email, contact: form.shipping_phone },
        theme:{ color:"#D4AF72" },
        modal:{ ondismiss: ()=> setLoading(false)}
      }
      const rzp=new window.Razorpay(options)
      rzp.open()
      // For test mode with placeholder key, bypass Razorpay UI: simulate success
      if(pay.razorpay_key_id==='rzp_test_placeholder'){
        // simulate verification
        setTimeout(async()=>{
          try{
            const fakeSig='testsig'+Date.now()
            await api.post('/payments/verify/',{razorpay_order_id: pay.razorpay_order_id, razorpay_payment_id: 'pay_test_'+Date.now(), razorpay_signature: fakeSig, order_id: order.id})
            nav(`/order/${order.id}`)
          }catch{}
        },800)
      }
    }catch(e:any){
      setErr(e.response?.data?.detail || e.message || 'Order failed')
    }finally{ setLoading(false)}
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-10">
      <h1 className="font-serif text-[32px]">Checkout</h1>
      <div className="grid lg:grid-cols-[1fr_420px] gap-8 mt-6">
        <div className="bg-white rounded-[22px] border border-obsidian/5 p-6 space-y-4">
          <h3 className="font-medium">Shipping details</h3>
          {err && <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm">{err}</div>}
          <div className="grid md:grid-cols-2 gap-3">
            <input placeholder="Full name" value={form.shipping_name} onChange={e=>setForm({...form, shipping_name:e.target.value})} required className="border border-obsidian/15 rounded-full px-4 py-3" />
            <input placeholder="Phone" value={form.shipping_phone} onChange={e=>setForm({...form, shipping_phone:e.target.value})} required className="border border-obsidian/15 rounded-full px-4 py-3" />
          </div>
          <input placeholder="Email" type="email" value={form.shipping_email} onChange={e=>setForm({...form, shipping_email:e.target.value})} required className="w-full border border-obsidian/15 rounded-full px-4 py-3" />
          <textarea placeholder="Shipping address (street, city, state, pincode)" value={form.shipping_address} onChange={e=>setForm({...form, shipping_address:e.target.value})} required rows={3} className="w-full border border-obsidian/15 rounded-2xl px-4 py-3" />
          <input placeholder="Billing address (optional)" value={form.billing_address} onChange={e=>setForm({...form, billing_address:e.target.value})} className="w-full border border-obsidian/15 rounded-full px-4 py-3" />
          <input placeholder="Coupon code" value={form.coupon_code} onChange={e=>setForm({...form, coupon_code:e.target.value})} className="w-full border border-obsidian/15 rounded-full px-4 py-3" />
          <textarea placeholder="Delivery instructions (optional)" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} rows={2} className="w-full border border-obsidian/15 rounded-2xl px-4 py-3" />
          <div className="text-xs opacity-60">Payment via Razorpay (test mode). Cards, UPI, Netbanking. No card data stored on our servers.</div>
          <button onClick={placeOrder} disabled={loading} className="w-full bg-obsidian text-pearl rounded-full py-3.5 disabled:opacity-50">{loading?'Processing...':'Place Order & Pay'} — {formatINR(total)}</button>
        </div>
        <div className="bg-white rounded-[22px] border border-obsidian/5 p-6 h-fit">
          <h3 className="font-medium">Order summary</h3>
          <div className="mt-4 space-y-3">
            {items.map((it:any)=>(
              <div key={it.id} className="flex justify-between text-sm"><span>{it.product_name} × {it.quantity}</span><span>{formatINR(it.line_total)}</span></div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
            <div className="flex justify-between text-emerald"><span>Discount</span><span>-{formatINR(discount)}</span></div>
            <div className="flex justify-between"><span>GST 3%</span><span>{formatINR(tax)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping===0?'Free':formatINR(shipping)}</span></div>
            <div className="flex justify-between font-semibold border-t pt-3"><span>Total</span><span>{formatINR(total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
