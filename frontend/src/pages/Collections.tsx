import { Link } from 'react-router-dom'
import { useCollections } from '../api/hooks'
export default function Collections(){
  const {data}=useCollections()
  const cols=data?.results||[]
  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-10">
      <h1 className="font-serif text-[36px] md:text-[48px]">Collections</h1>
      <p className="text-sm opacity-60 mt-2">Stories woven in gold, diamonds & heritage.</p>
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {cols.map((c:any)=>(
          <Link key={c.slug} to={`/collections/${c.slug}`} className="group relative rounded-[22px] overflow-hidden bg-ivory aspect-[16/10]">
            <img src={c.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=800&fit=crop'} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 p-6 md:p-8 text-pearl">
              <div className="font-serif text-2xl md:text-[30px]">{c.title}</div>
              <div className="text-sm opacity-80 mt-1 max-w-md">{c.description}</div>
              <span className="inline-block mt-4 bg-white text-obsidian rounded-full px-5 py-2 text-sm">Explore</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
