import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useProduct } from '../api/hooks'
import { formatINR } from '../utils/format'
import { Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react'
import { useAddToCart } from '../api/hooks'
import { toast } from '../components/Toaster'
import { pushRecentlyViewed } from '../components/RecentlyViewed'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'

export default function ProductDetail(){
  const {slug}=useParams()
  const {data:product, isLoading}=useProduct(slug||null)
  const [qty,setQty]=useState(1)
  const [selectedVariant,setSelectedVariant]=useState<number|null>(null)
  const [activeImg,setActiveImg]=useState(0)
  const [pincode,setPincode]=useState("")
  const [pinMsg,setPinMsg]=useState("")
  const addToCart=useAddToCart()
  const nav=useNavigate()
  const qc=useQueryClient()

  const related=useQuery({ queryKey:['related',slug], queryFn: async()=>(await api.get(`/products/${slug}/related/`)).data, enabled: !!slug })
  const reviews=useQuery({ queryKey:['reviews',slug], queryFn: async()=>(await api.get(`/products/${slug}/reviews/`)).data, enabled: !!slug })

  if(isLoading) return <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-10"><div className="h-[520px] bg-white animate-pulse rounded-[22px]" /></div>
  // track recently viewed
  useEffect(()=>{
    if(product){
      pushRecentlyViewed({slug: product.slug, name: product.name, image: product.images?.[0]?.image, price: product.price})
    }
  },[product?.slug])
  if(!product) return <div className="p-10 text-center">Product not found. <Link to="/shop" className="underline">Back to shop</Link></div>

  const imgList = product.images?.length ? product.images : [{image:'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=1200&fit=crop', alt_text: product.name}]
  const price = selectedVariant ? (product.variants?.find((v:any)=>v.id===selectedVariant)?.price_override || product.price) : product.price
  const wish = useMutation({
    mutationFn: async()=>(await api.post('/wishlist/items/',{product:product.id})).data,
    onSuccess: ()=>{ toast('Added to wishlist'); qc.invalidateQueries({queryKey:['wishlist']})}
  })

  const handleAdd= async()=>{
    try{
      await addToCart.mutateAsync({product:product.id, variant: selectedVariant, quantity: qty})
      toast('Added to bag')
    }catch(e:any){ toast(e.response?.data?.detail||'Failed to add') }
  }
  const handleBuyNow= async()=>{
    await handleAdd()
    nav('/cart')
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-8">
      <div className="text-xs opacity-60"><Link to="/" className="hover:underline">Home</Link> / <Link to="/shop" className="hover:underline">Shop</Link> / {product.name}</div>
      <div className="grid lg:grid-cols-2 gap-10 mt-6">
        {/* gallery */}
        <div className="space-y-4">
          <div className="bg-white rounded-[22px] overflow-hidden aspect-[4/5] border border-obsidian/5 relative">
            <img src={imgList[activeImg]?.image||imgList[activeImg]?.image} alt={product.name} className="w-full h-full object-cover" />
            {product.discount_percent>0 && <span className="absolute top-4 left-4 bg-obsidian text-pearl text-xs px-3 py-1.5 rounded-full">{product.discount_percent}% Off</span>}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent h-20 pointer-events-none" />
          </div>
          <div className="flex gap-3 overflow-auto no-scrollbar">
            {imgList.map((im:any,i:number)=>(
              <button key={i} onClick={()=>setActiveImg(i)} className={`w-20 h-20 rounded-xl overflow-hidden border ${activeImg===i?'border-obsidian':'border-obsidian/10'} flex-shrink-0`}><img src={im.image} alt={im.alt_text} className="w-full h-full object-cover" /></button>
            ))}
          </div>
          {/* 3D teaser */}
          {product.name.toLowerCase().includes('ring') && (
            <div className="bg-ivory rounded-2xl p-5 text-sm">View in 3D: drag to rotate — interactive model available on homepage showcase.</div>
          )}
        </div>

        {/* info */}
        <div>
          <div className="text-[11px] tracking-[0.14em] uppercase text-taupe">{product.material} • {product.purity} • {product.category?.name}</div>
          <h1 className="font-serif text-[30px] md:text-[38px] leading-none mt-2">{product.name}</h1>
          <div className="text-xs opacity-60 mt-1">SKU: {product.sku} {product.weight_grams && `• ${product.weight_grams}g`} {product.dimensions && `• ${product.dimensions}`}</div>
          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-2xl font-semibold">{formatINR(price)}</span>
            {product.original_price && parseFloat(product.original_price)>parseFloat(price) && <span className="line-through text-taupe">{formatINR(product.original_price)}</span>}
            {product.discount_percent>0 && <span className="bg-champagne/20 text-antique text-xs px-2 py-1 rounded-full">{product.discount_percent}% off</span>}
          </div>
          <p className="text-sm leading-relaxed opacity-70 mt-4">{product.description}</p>

          {product.variants?.length>0 && (
            <div className="mt-6">
              <div className="text-xs tracking-widest uppercase">Variants</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.variants.map((v:any)=>(
                  <button key={v.id} onClick={()=>setSelectedVariant(v.id)} className={`px-4 py-2 rounded-full border text-sm ${selectedVariant===v.id?'bg-obsidian text-pearl border-obsidian':'bg-white border-obsidian/10'}`}>{v.name} {v.stock<=0&&'(out of stock)'}</button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mt-6">
            <div className="flex items-center border border-obsidian/15 rounded-full overflow-hidden">
              <button onClick={()=>setQty(q=>Math.max(1,q-1))} className="px-4 py-2.5">−</button>
              <span className="px-4 text-sm font-medium">{qty}</span>
              <button onClick={()=>setQty(q=>q+1)} className="px-4 py-2.5">+</button>
            </div>
            <span className={`text-xs ${product.stock>0?'text-emerald':'text-red-600'}`}>{product.stock>0 ? `${product.stock} in stock` : 'Made to order'}</span>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={handleAdd} disabled={addToCart.isPending} className="flex-1 bg-obsidian text-pearl rounded-full py-3.5 text-sm font-medium hover:bg-black transition disabled:opacity-50">Add to Bag</button>
            <button onClick={handleBuyNow} className="flex-1 bg-champagne text-obsidian rounded-full py-3.5 text-sm font-medium">Buy Now</button>
            <button onClick={()=>wish.mutate()} className="w-12 h-12 rounded-full border border-obsidian/10 bg-white flex items-center justify-center"><Heart size={18}/></button>
            <button className="w-12 h-12 rounded-full border border-obsidian/10 bg-white flex items-center justify-center"><Share2 size={18}/></button>
          </div>

          <div className="flex gap-2 mt-4">
            <div className="flex-1 bg-white border border-obsidian/5 rounded-2xl p-4 text-sm flex gap-3"><Truck size={18}/> <span>Complimentary shipping<br/><span className="text-xs opacity-60">Delivered in 3–7 days, insured</span></span></div>
            <div className="flex-1 bg-white border border-obsidian/5 rounded-2xl p-4 text-sm flex gap-3"><Shield size={18}/> <span>Authenticity note<br/><span className="text-xs opacity-60">When applicable</span></span></div>
          </div>

          {/* pincode — live API */}
          <div className="mt-6 bg-ivory rounded-2xl p-5">
            <div className="text-sm font-medium">Delivery availability (live)</div>
            <div className="flex gap-2 mt-2">
              <input value={pincode} onChange={e=>setPincode(e.target.value)} placeholder="Enter pincode (try 411001 Pune)" className="flex-1 border border-obsidian/15 rounded-full px-4 py-2.5 bg-white" />
              <button onClick={async()=>{
                if(pincode.length!==6) {setPinMsg('Please enter valid 6-digit pincode'); return}
                try{
                  const {data}=await api.get(`/shipping/check/`,{params:{pincode}})
                  setPinMsg(`✓ ${data.city} — ${data.serviceable?'Serviceable':'Not serviceable'} • COD ${data.cod?'Available':'Not available'} • ${data.estimated_delivery} • Shipping ${data.shipping_cost===0?'Free':`₹${data.shipping_cost}`}`)
                }catch(err:any){ setPinMsg(err.response?.data?.detail||'Check failed')}
              }} className="bg-obsidian text-pearl rounded-full px-6">Check</button>
            </div>
            {pinMsg && <div className="text-xs mt-2 opacity-70">{pinMsg}</div>}
            <div className="text-xs opacity-60 mt-2">Powered by live pincode serviceability API — integrates with Shiprocket/Delhivery in production. Try: 411001, 400001, 110001</div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white border border-obsidian/5 rounded-2xl p-4"><div className="font-medium">Specifications</div><div className="text-xs opacity-60 mt-2 space-y-1">{Object.entries(product.specifications||{}).map(([k,v])=> <div key={k} className="flex justify-between"><span>{k}</span><span>{String(v)}</span></div>)}</div></div>
            <div className="bg-white border border-obsidian/5 rounded-2xl p-4"><div className="font-medium">Care</div><div className="text-xs opacity-60 mt-2">{product.care_instructions||'Store in pouch, avoid chemicals.'}</div></div>
          </div>

          <div className="mt-6 flex gap-6 text-xs opacity-60"><a href="/shipping-returns" className="underline">Shipping & Returns</a><a href="/care-guide" className="underline">Care Guide</a><a href="/faq" className="underline">FAQ</a></div>
        </div>
      </div>

      {/* reviews */}
      <div className="mt-12 grid lg:grid-cols-2 gap-8">
        <div>
          <h3 className="font-serif text-2xl">Customer Reviews</h3>
          <div className="mt-4 space-y-4">
            {(reviews.data?.results||reviews.data||[]).slice(0,5).map((r:any)=>(
              <div key={r.id} className="bg-white rounded-2xl p-5 border border-obsidian/5">
                <div className="flex justify-between"><span className="font-medium text-sm">{r.user_name}</span><span className="text-champagne text-sm">{'★'.repeat(r.rating)}</span></div>
                <div className="font-medium text-sm mt-1">{r.title}</div>
                <p className="text-sm opacity-70 mt-1">{r.comment}</p>
                <div className="text-xs opacity-50 mt-2">{new Date(r.created_at).toLocaleDateString()} {r.is_verified_purchase && '• Verified purchase'}</div>
              </div>
            ))}
            {(!reviews.data?.results && !reviews.data?.length) && <div className="text-sm opacity-60">No reviews yet — be the first to review.</div>}
          </div>
          <ReviewForm slug={slug!} />
        </div>
        <div>
          <h3 className="font-serif text-2xl">You may also like</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {(related.data?.results||related.data||[]).slice(0,4).map((p:any,i:number)=>(
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-obsidian/5">
                <Link to={`/product/${p.slug}`}><img src={p.images?.[0]?.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop'} alt={p.name} className="aspect-square object-cover w-full" /></Link>
                <div className="p-3"><Link to={`/product/${p.slug}`} className="text-sm font-medium leading-tight">{p.name}</Link><div className="text-sm mt-1">{formatINR(p.price)}</div></div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-ivory rounded-2xl p-5">
            <div className="font-medium">Recently viewed</div>
            <div className="text-xs opacity-60 mt-1">Your browsing history (stored locally) will appear here.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReviewForm({slug}:{slug:string}){
  const [rating,setRating]=useState(5)
  const [comment,setComment]=useState("")
  const [title,setTitle]=useState("")
  const onSubmit= async(e:any)=>{
    e.preventDefault()
    try{
      await api.post(`/products/${slug}/reviews/`,{rating, title, comment})
      toast('Review submitted')
      setComment(""); setTitle("")
    }catch(err:any){ toast(err.response?.data?.detail || 'Login to review') }
  }
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl p-5 border border-obsidian/5 mt-6 space-y-3">
      <div className="font-medium text-sm">Write a review</div>
      <div className="flex gap-2">{[1,2,3,4,5].map(n=> <button type="button" key={n} onClick={()=>setRating(n)} className={`w-8 h-8 rounded-full ${rating>=n?'bg-champagne':'bg-ivory'} `}>{n}</button>)}</div>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full border border-obsidian/10 rounded-xl px-4 py-2.5" />
      <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Your review" required rows={3} className="w-full border border-obsidian/10 rounded-xl px-4 py-2.5" />
      <button className="bg-obsidian text-pearl rounded-full px-6 py-2.5 text-sm">Submit Review</button>
    </form>
  )
}
