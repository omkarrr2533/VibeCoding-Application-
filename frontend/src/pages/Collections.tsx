import { Link } from 'react-router-dom'
import { useCollections } from '../api/hooks'

const collectionsFallback = [
  { slug:'heritage-bridal', title:'Heritage Bridal', description:'Bridal heirlooms reimagined for the modern muse — Kundan, pearls, and temple motifs, crafted in 22KT antique finish.', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=800&fit=crop' },
  { slug:'celestial-diamonds', title:'Celestial Diamonds', description:'Star-like diamonds set in luminous 18KT white gold — IGI certified solitaires with pavé shoulders.', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&h=800&fit=crop' },
  { slug:'everyday-elegance', title:'Everyday Elegance', description:'Minimal pieces for daily grace — pearl chains, diamond studs, and rose gold bands.', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&h=800&fit=crop' },
  { slug:'temple-revival', title:'Temple Revival', description:'Inspired by South Indian temple artistry — Lakshmi, peacock, and mango motifs in 22KT antique gold.', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1200&h=800&fit=crop' },
  { slug:'noor', title:'Noor', description:'Mughal-inspired emerald, Polki, and rose-cut diamonds — Zambian emeralds and uncut Polki in 18KT gold.', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&h=800&fit=crop' },
  { slug:'royale-mens', title:"Royale Men's Edit", description:"Platinum kadas, brushed gold chains, and onyx cufflinks — contemporary heirlooms for him.", image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&h=800&fit=crop' },
  { slug:'navratna-gemstone', title:'Navratna & Gemstone', description:'Nine sacred gems — ruby, emerald, sapphire set in 925 silver and 18KT gold, astrologically curated.', image: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=1200&h=800&fit=crop' },
  { slug:'festive-lights', title:'Festive Lights', description:'Diwali, Gudi Padwa, and wedding season edits — lightweight gold, giftable diamond, festive bundling.', image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1200&h=800&fit=crop' },
]

export default function Collections(){
  const {data, isError} = useCollections()
  const cols = (data?.results && data.results.length > 0) ? data.results : (isError || !data?.results ? collectionsFallback : [])
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
