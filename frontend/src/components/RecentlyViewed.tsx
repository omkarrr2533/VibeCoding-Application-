import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

type Item = {slug:string, name:string, image?:string, price?:string}
export default function RecentlyViewed(){
  const [items,setItems]=useState<Item[]>([])
  useEffect(()=>{
    try{
      const raw = localStorage.getItem('recently_viewed')
      if(raw) setItems(JSON.parse(raw))
    }catch{}
  },[])
  if(!items.length) return null
  return (
    <div className="mt-8">
      <h3 className="font-serif text-lg">Recently Viewed</h3>
      <div className="flex gap-3 overflow-auto no-scrollbar py-3">
        {items.slice(0,8).map((it,i)=>(
          <Link key={i} to={`/product/${it.slug}`} className="min-w-[140px] bg-white rounded-xl border border-obsidian/5 overflow-hidden flex-shrink-0">
            <img src={it.image||'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'} alt={it.name} className="w-full aspect-square object-cover" />
            <div className="p-2"><div className="text-xs font-medium line-clamp-2">{it.name}</div>{it.price&&<div className="text-xs opacity-60">₹{it.price}</div>}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
export function pushRecentlyViewed(item:Item){
  try{
    const raw = localStorage.getItem('recently_viewed')
    let arr:Item[] = raw? JSON.parse(raw):[]
    arr = [item, ...arr.filter(x=>x.slug!==item.slug)].slice(0,10)
    localStorage.setItem('recently_viewed', JSON.stringify(arr))
  }catch{}
}
