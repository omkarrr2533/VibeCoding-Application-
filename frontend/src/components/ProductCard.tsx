import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Eye } from 'lucide-react'
import { formatINR } from '../utils/format'
import type { Product } from '../types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'

export default function ProductCard({product, index=0}:{product:Product,index?:number}){
  const qc=useQueryClient()
  const wish = useMutation({
    mutationFn: async()=> (await api.post('/wishlist/items/',{product: product.id})).data,
    onSuccess: ()=> qc.invalidateQueries({queryKey:['wishlist']})
  })
  const img = product.images?.[0]?.image || `https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop&crop=center`
  const img2 = product.images?.[1]?.image || img
  return (
    <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*0.05, duration:0.6}} className="group bg-white rounded-[18px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-obsidian/[0.06] flex flex-col">
      <Link to={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-ivory">
        <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-[1.06] transition duration-[1200ms]" loading="lazy" />
        <img src={img2} alt="" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-700" />
        {product.discount_percent>0 && <span className="absolute top-3 left-3 bg-obsidian text-pearl text-[11px] tracking-widest uppercase px-3 py-1 rounded-full">{product.discount_percent}% Off</span>}
        <span className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow ${!product.in_stock?'opacity-50':''}`}>
          {!product.in_stock ? <span className="text-[10px]">Sold</span> : null}
        </span>
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <button onClick={(e)=>{e.preventDefault(); wish.mutate()}} className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center hover:bg-champagne transition"><Heart size={16}/></button>
          <span className="w-9 h-9 rounded-full bg-obsidian text-pearl shadow flex items-center justify-center"><Eye size={16}/></span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition" />
      </Link>
      <div className="p-4 flex-1 flex flex-col gap-1">
        <div className="text-[11px] tracking-[0.12em] uppercase text-taupe">{product.material} • {product.purity}</div>
        <Link to={`/product/${product.slug}`} className="font-serif text-[17px] leading-tight hover:text-antique line-clamp-2">{product.name}</Link>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-medium">{formatINR(product.price)}</span>
          {product.original_price && parseFloat(product.original_price)>parseFloat(product.price) && <span className="text-xs line-through text-taupe">{formatINR(product.original_price)}</span>}
        </div>
        <div className="text-[11px] text-emerald/70 mt-1">{product.in_stock ? 'In stock • Complimentary shipping' : 'Made to order'}</div>
      </div>
    </motion.div>
  )
}
