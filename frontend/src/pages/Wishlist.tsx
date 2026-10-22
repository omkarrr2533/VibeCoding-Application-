import { Link } from 'react-router-dom'
import { useWishlist } from '../api/hooks'
import { api } from '../api/client'
import { formatINR } from '../utils/format'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from '../components/Toaster'

export default function Wishlist(){
  const {data}=useWishlist()
  const qc=useQueryClient()
  const items=data?.items||[]
  if(!items.length) return <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-16 text-center"><h1 className="font-serif text-3xl">Your wishlist is empty</h1><Link to="/shop" className="inline-block mt-6 bg-obsidian text-pearl px-7 py-3 rounded-full">Explore</Link></div>
  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-10">
      <h1 className="font-serif text-[32px]">Wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {items.map((it:any)=>(
          <div key={it.id} className="bg-white rounded-2xl overflow-hidden border border-obsidian/5">
            <Link to={`/product/${it.product_slug}`}><img src={it.product_image||'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop'} alt={it.product_name} className="aspect-square object-cover w-full" /></Link>
            <div className="p-4">
              <Link to={`/product/${it.product_slug}`} className="font-medium text-sm">{it.product_name}</Link>
              <div className="text-sm mt-1">{formatINR(it.product_price)}</div>
              <div className="flex gap-2 mt-3">
                <button onClick={async()=>{
                  await api.post('/cart/items/',{product: it.product, quantity:1})
                  qc.invalidateQueries({queryKey:['cart']})
                  toast('Added to bag')
                }} className="flex-1 bg-obsidian text-pearl rounded-full py-2 text-sm">Add to Bag</button>
                <button onClick={async()=>{ await api.delete(`/wishlist/items/${it.id}/`); qc.invalidateQueries({queryKey:['wishlist']}); toast('Removed')}} className="px-4 border rounded-full text-sm">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
