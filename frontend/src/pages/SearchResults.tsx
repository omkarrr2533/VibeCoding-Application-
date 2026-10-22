import { useSearchParams, Link } from 'react-router-dom'
import { useSearch } from '../api/hooks'
export default function SearchResults(){
  const [params]=useSearchParams()
  const q=params.get('q')||''
  const {data}=useSearch(q)
  const results=data?.results||[]
  return (
    <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-10">
      <h1 className="font-serif text-[32px]">Search {q && `for "${q}"`}</h1>
      <p className="text-sm opacity-60 mt-1">{data?.count??results.length} results</p>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {results.map((p:any)=>(
          <Link key={p.id} to={`/product/${p.slug}`} className="bg-white rounded-2xl overflow-hidden border border-obsidian/5">
            <img src={p.images?.[0]?.image||'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop'} alt={p.name} className="aspect-square object-cover w-full" />
            <div className="p-3"><div className="text-sm font-medium line-clamp-2">{p.name}</div><div className="text-sm mt-1">₹{p.price}</div></div>
          </Link>
        ))}
        {q && results.length===0 && <div className="col-span-4 text-center p-8 bg-white rounded-2xl">No results for "{q}" — try "Gold", "Diamond" or "Bridal".</div>}
      </div>
    </div>
  )
}
