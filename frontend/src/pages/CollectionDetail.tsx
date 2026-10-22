import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'
import ProductCard from '../components/ProductCard'
export default function CollectionDetail(){
  const {slug}=useParams()
  const {data:coll}=useQuery({ queryKey:['collection',slug], queryFn: async()=>(await api.get(`/collections/${slug}/`)).data, enabled: !!slug })
  const {data:prods}=useQuery({ queryKey:['collection-products',slug], queryFn: async()=>(await api.get('/products/',{params:{collection:slug}})).data, enabled: !!slug })
  if(!coll) return <div className="p-10">Loading...</div>
  const products=prods?.results||[]
  return (
    <div>
      <div className="relative h-[48vh] min-h-[360px] overflow-hidden bg-obsidian">
        <img src={coll.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=2000&h=1000&fit=crop'} alt={coll.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-end max-w-[1600px] mx-auto px-6 md:px-10 pb-10 text-pearl">
          <h1 className="font-serif text-[36px] md:text-[56px]">{coll.title}</h1>
          <p className="text-pearl/80 max-w-2xl mt-2">{coll.description}</p>
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-10">
        <h2 className="font-serif text-2xl">Pieces from this collection</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6">
          {products.length? products.map((p:any,i:number)=> <ProductCard key={p.id} product={p} index={i} />) : <div className="col-span-4 bg-white rounded-2xl p-8 text-center">No pieces yet — explore <Link to="/shop" className="underline">Shop All</Link></div>}
        </div>
      </div>
    </div>
  )
}
