import { useSearchParams, Link } from 'react-router-dom'
import { useProducts, useCategories } from '../api/hooks'
import ProductCard from '../components/ProductCard'
import { useState } from 'react'

export default function Shop(){
  const [params, setParams]=useSearchParams()
  const [sort,setSort]=useState(params.get('ordering')||'-created_at')
  const cat=params.get('category')||''
  const material=params.get('material')||''
  const q=params.get('q')||''
  const min_price=params.get('min_price')||''
  const max_price=params.get('max_price')||''

  const query:any={}
  if(cat) query.category=cat
  if(material) query.material=material
  if(q) query.search=q
  if(min_price) query.min_price=min_price
  if(max_price) query.max_price=max_price
  if(sort) query.ordering=sort

  const {data, isLoading, error} = useProducts(query)
  const {data: cats } = useCategories()
  const products=data?.results||[]

  const update=(k:string,v:string)=>{
    const p=new URLSearchParams(params)
    if(v) p.set(k,v); else p.delete(k)
    setParams(p)
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-8">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="font-serif text-[32px] md:text-[44px] leading-none">Shop All</h1>
          <p className="text-sm text-obsidian/60 mt-2">Refined jewellery for every milestone — gold, diamond, bridal & more.</p>
        </div>
        <select value={sort} onChange={e=>{setSort(e.target.value); update('ordering', e.target.value)}} className="border border-obsidian/10 rounded-full px-4 py-2.5 bg-white text-sm">
          <option value="-created_at">Newest</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8 mt-8">
        {/* filters */}
        <aside className="space-y-6 lg:sticky lg:top-[84px] h-fit">
          <div className="bg-white rounded-2xl border border-obsidian/5 p-5">
            <h3 className="text-xs tracking-[0.16em] uppercase">Category</h3>
            <div className="mt-3 space-y-2">
              <button onClick={()=>update('category','')} className={`block text-sm ${!cat?'font-semibold text-antique':''}`}>All</button>
              {(cats?.results||cats||[]).map((c:any)=>(
                <button key={c.slug} onClick={()=>update('category',c.slug)} className={`block text-sm text-left ${cat===c.slug?'font-semibold text-antique':''}`}>{c.name}</button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-obsidian/5 p-5">
            <h3 className="text-xs tracking-[0.16em] uppercase">Material</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {['','Gold','Diamond','Gold & Diamond','Silver','Platinum'].map(m=>(
                <button key={m} onClick={()=>update('material',m)} className={`px-3 py-1.5 rounded-full text-sm border ${material===m || (!material && m==='') ? 'bg-obsidian text-pearl border-obsidian':'bg-white border-obsidian/10'}`}>{m||'All'}</button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-obsidian/5 p-5">
            <h3 className="text-xs tracking-[0.16em] uppercase">Price</h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <input placeholder="Min ₹" value={min_price} onChange={e=>update('min_price',e.target.value)} className="border border-obsidian/10 rounded-full px-3 py-2 text-sm" />
              <input placeholder="Max ₹" value={max_price} onChange={e=>update('max_price',e.target.value)} className="border border-obsidian/10 rounded-full px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="bg-ivory rounded-2xl p-5">
            <div className="font-serif text-lg">Need guidance?</div>
            <p className="text-sm opacity-70 mt-1">Book a complimentary styling consultation.</p>
            <Link to="/contact" className="inline-block mt-3 bg-obsidian text-pearl rounded-full px-4 py-2 text-sm">Contact Us</Link>
          </div>
        </aside>

        <div>
          {isLoading ? <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">{[1,2,3,4,5,6].map(i=> <div key={i} className="h-[380px] bg-white rounded-[18px] animate-pulse" />)}</div>
          : error ? <div className="bg-white rounded-2xl p-8 text-center">Failed to load products. <button onClick={()=>location.reload()} className="underline">Retry</button></div>
          : products.length===0 ? <div className="bg-white rounded-2xl p-12 text-center"><p className="font-serif text-2xl">No pieces found</p><p className="text-sm opacity-60 mt-2">Try adjusting filters or explore our collections.</p><Link to="/shop" className="inline-block mt-4 bg-obsidian text-pearl px-6 py-2.5 rounded-full">Clear filters</Link></div>
          : <>
              <div className="text-sm opacity-60 mb-4">{data?.count||products.length} pieces</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((p:any,i:number)=> <ProductCard key={p.id} product={p} index={i} />)}
              </div>
              {data?.next && <div className="flex justify-center mt-8"><button className="border border-obsidian rounded-full px-6 py-2.5">Load more</button></div>}
            </>}
        </div>
      </div>
    </div>
  )
}
