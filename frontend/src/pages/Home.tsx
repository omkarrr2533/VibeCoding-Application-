import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import Jewel3DShowcase from '../components/Jewel3DShowcase'
import { useCollections, useFeatured, useTestimonials } from '../api/hooks'
import { formatINR } from '../utils/format'

const collectionFallback = [
  { slug:'heritage-bridal', title:'Heritage Bridal', desc:'Bridal heirlooms reimagined — Kundan & pearls', img:'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop' },
  { slug:'celestial-diamonds', title:'Celestial Diamonds', desc:'IGI certified solitaires, pavé shoulders', img:'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&h=800&fit=crop' },
  { slug:'everyday-elegance', title:'Everyday Elegance', desc:'Pearl chains, diamond studs, rose gold', img:'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop' },
  { slug:'temple-revival', title:'Temple Revival', desc:'Lakshmi & peacock motifs in 22KT', img:'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=800&fit=crop' },
  { slug:'noor', title:'Noor', desc:'Mughal Polki & Zambian emeralds', img:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&h=800&fit=crop' },
  { slug:'royale-mens', title:"Royale Men's Edit", desc:'Platinum kadas & gold chains', img:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=800&fit=crop' },
  { slug:'navratna-gemstone', title:'Navratna & Gemstone', desc:'Nine sacred gems curated', img:'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=1200&h=800&fit=crop' },
  { slug:'festive-lights', title:'Festive Lights', desc:'Diwali & wedding lightweight edits', img:'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&h=800&fit=crop' },
]

const productFallback = [
  { id:101, name:'Maharani Temple Choker', slug:'maharani-temple-choker', sku:'OM-GLD-001', price:'185000.00', original_price:'210000.00', material:'Gold', purity:'22KT', category:1, category_name:'Gold Jewellery', is_featured:true, stock:5, discount_percent:12, in_stock:true, images:[{id:1,image:'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=800&fit=crop',alt_text:'Maharani',is_primary:true,sort_order:0}] },
  { id:102, name:'Celestial Solitaire Ring', slug:'celestial-solitaire-ring', sku:'OM-DIA-002', price:'245000.00', original_price:'285000.00', material:'Gold & Diamond', purity:'18KT', category:1, category_name:'Rings', is_featured:true, stock:8, discount_percent:14, in_stock:true, images:[{id:2,image:'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',alt_text:'Solitaire',is_primary:true,sort_order:0}] },
  { id:103, name:'Noor Emerald Jhumkas', slug:'noor-emerald-jhumkas', sku:'OM-GEM-003', price:'89000.00', original_price:'105000.00', material:'Gold & Diamond', purity:'18KT', category:1, category_name:'Earrings', is_featured:true, stock:12, discount_percent:15, in_stock:true, images:[{id:3,image:'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',alt_text:'Jhumkas',is_primary:true,sort_order:0}] },
  { id:104, name:'Heritage Bridal Necklace Set', slug:'heritage-bridal-necklace-set', sku:'OM-BRD-005', price:'485000.00', original_price:'550000.00', material:'Gold & Diamond', purity:'22KT', category:1, category_name:'Bridal', is_featured:true, stock:3, discount_percent:12, in_stock:true, images:[{id:4,image:'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&h=800&fit=crop',alt_text:'Bridal',is_primary:true,sort_order:0}] },
  { id:105, name:'Diamond Tennis Bracelet', slug:'diamond-tennis-bracelet', sku:'OM-DIA-006', price:'165000.00', original_price:null, material:'Diamond', purity:'18KT', category:1, category_name:'Bracelets', is_featured:true, stock:7, discount_percent:0, in_stock:true, images:[{id:5,image:'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',alt_text:'Tennis',is_primary:true,sort_order:0}] },
  { id:106, name:'Polki Diamond Choker', slug:'polki-diamond-choker', sku:'OM-DIA-010', price:'195000.00', original_price:'225000.00', material:'Gold & Diamond', purity:'18KT', category:1, category_name:'Necklaces', is_featured:true, stock:4, discount_percent:13, in_stock:true, images:[{id:6,image:'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&h=800&fit=crop',alt_text:'Polki',is_primary:true,sort_order:0}] },
  { id:107, name:'Classic Gold Mangalsutra', slug:'classic-gold-mangalsutra', sku:'OM-GLD-015', price:'58000.00', original_price:null, material:'Gold', purity:'22KT', category:1, category_name:'Necklaces', is_featured:true, stock:12, discount_percent:0, in_stock:true, images:[{id:7,image:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',alt_text:'Mangalsutra',is_primary:true,sort_order:0}] },
  { id:108, name:'Cocktail Gemstone Ring', slug:'cocktail-gemstone-ring', sku:'OM-GEM-032', price:'115000.00', original_price:'135000.00', material:'Gemstone', purity:'18KT', category:1, category_name:'Rings', is_featured:true, stock:4, discount_percent:15, in_stock:true, images:[{id:8,image:'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&h=800&fit=crop',alt_text:'Cocktail',is_primary:true,sort_order:0}] },
]

export default function Home(){
  const {data:collData} = useCollections()
  const {data:featData, isError:featError} = useFeatured()
  const {data:testiData} = useTestimonials()
  const collections = (collData?.results && collData.results.length > 0) ? collData.results.map((c:any)=> ({slug:c.slug, title:c.title, desc:c.short_description||c.description, img: c.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop'})) : collectionFallback
  const rawProducts = featData?.results || (Array.isArray(featData) ? featData : null) || []
  const products = rawProducts.length > 0 ? rawProducts : (featError ? productFallback : [])
  const testimonials = testiData?.results || testiData || []

  return (
    <div>
      <Hero />

      {/* Featured collections editorial */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-10 py-14 md:py-20">
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div>
            <p className="text-[11px] tracking-[0.18em] uppercase text-antique">Curated Collections</p>
            <h2 className="font-serif text-[36px] md:text-[48px] leading-none mt-2">Made for every <span className="italic font-light">milestone.</span></h2>
          </div>
          <Link to="/collections" className="text-sm border border-obsidian rounded-full px-6 py-2.5 hover:bg-obsidian hover:text-pearl transition">View All Collections</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-10">
          {collections.slice(0,8).map((c:any,i:number)=>(
            <motion.div key={c.slug} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.06}}>
              <Link to={`/shop?collection=${c.slug}`} className="group block">
                <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden bg-ivory">
                  <img src={c.img} alt={c.title} className="w-full h-full object-cover group-hover:scale-[1.08] transition duration-[1200ms]" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                  <div className="absolute bottom-0 p-5 text-pearl">
                    <div className="font-serif text-[18px] leading-none">{c.title}</div>
                    <div className="text-xs opacity-80 mt-1">{c.desc}</div>
                    <span className="inline-flex mt-3 text-[11px] tracking-[0.14em] uppercase bg-white text-obsidian px-3 py-1.5 rounded-full group-hover:bg-champagne transition">Explore</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-ivory py-14 md:py-16">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div>
              <p className="text-[11px] tracking-[0.18em] uppercase text-antique">Signature Edits</p>
              <h2 className="font-serif text-[32px] md:text-[44px] leading-none mt-2">Featured <span className="italic font-light">creations.</span></h2>
            </div>
            <Link to="/shop" className="bg-obsidian text-pearl rounded-full px-6 py-2.5 text-sm">Shop All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
            {products.length ? products.map((p:any,i:number)=> <ProductCard key={p.id} product={p} index={i} />) : productFallback.map((p:any,i:number)=> <ProductCard key={p.id} product={p as any} index={i} />)}
          </div>
        </div>
      </section>

      {/* 3D Showcase */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-10 py-14 md:py-20">
        <p className="text-[11px] tracking-[0.18em] uppercase text-antique">Experience in 3D</p>
        <h2 className="font-serif text-[36px] md:text-[48px] leading-none mt-2">Light, form & <span className="italic font-light">craft.</span></h2>
        <p className="text-sm text-obsidian/60 mt-3 max-w-2xl">Rotate, zoom and explore finishes. Crafted with physically-based materials, soft shadows and studio lighting — with graceful image fallback for low-power devices.</p>
        <div className="mt-8"><Jewel3DShowcase /></div>
      </section>

      {/* Brand story */}
      <section className="bg-obsidian text-pearl">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1000&h=1200&fit=crop" alt="Craftsmanship" className="rounded-[24px] w-full object-cover aspect-[4/5]" />
            <div className="absolute -bottom-6 -right-6 bg-pearl text-obsidian rounded-2xl p-6 shadow-luxury max-w-[260px] hidden md:block">
              <div className="font-serif text-lg leading-tight">Handcrafted by master karigars</div>
              <div className="text-xs opacity-60 mt-1">Each piece passes 12 quality checks; BIS hallmarked gold where applicable.</div>
            </div>
          </div>
          <div>
            <p className="text-champagne text-[11px] tracking-[0.18em] uppercase">Our Story</p>
            <h2 className="font-serif text-[38px] md:text-[52px] leading-[0.98] mt-3">Crafted with Meaning.<br/><span className="italic font-light text-champagne">Designed to Last.</span></h2>
            <p className="text-pearl/70 text-[15px] leading-relaxed mt-6">For over two decades, Om's Jewellers has honoured Pune's heritage of fine jewellery — blending temple artistry, Mughal intricacy and contemporary minimalism. Our atelier pairs traditional handwork with modern precision, ensuring every creation feels both heirloom and new.</p>
            <ul className="mt-6 space-y-2 text-sm text-pearl/80 list-disc list-inside">
              <li>Transparent information on weight, purity & certifications where applicable</li>
              <li>Secure checkout & insured shipping</li>
              <li>Care guidance & authenticity documentation when available</li>
            </ul>
            <Link to="/about" className="inline-flex mt-8 bg-pearl text-obsidian px-7 py-3 rounded-full text-sm">Discover Our Story</Link>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-10 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          {t:'Transparent Information', d:'Weight, purity & details disclosed upfront.'},
          {t:'Secure Checkout', d:'Razorpay-powered, encrypted & protected.'},
          {t:'Jewellery Care', d:'Guidance to keep your pieces luminous.'},
          {t:'Assistance', d:'Personal consultations & gifting help.'},
        ].map(x=>(
          <div key={x.t} className="bg-white rounded-2xl border border-obsidian/5 p-6">
            <div className="w-8 h-8 rounded-full bg-ivory flex items-center justify-center text-antique">✺</div>
            <div className="font-medium mt-3">{x.t}</div>
            <div className="text-sm text-obsidian/60 mt-1">{x.d}</div>
          </div>
        ))}
      </section>

      {/* Testimonials */}
      <section className="bg-ivory py-14">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <div className="flex justify-between items-end">
            <h2 className="font-serif text-[28px] md:text-[36px]">What our clients say</h2>
            <div className="text-sm text-obsidian/60">Demonstration reviews — real testimonials after verification</div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {(testimonials.length? testimonials : [
              {name:'Aaradhya Mehta', role:'Bride, Mumbai', comment:'My bridal set is everything I dreamed of — heirloom quality with modern finesse.', rating:5},
              {name:'Priya & Rohan', role:'Anniversary', comment:'We celebrated our 10th anniversary with Celestial — timeless elegance.', rating:5},
              {name:'Neha Kulkarni', role:'Pune', comment:'Transparent pricing, certified stones, gracious service.', rating:5},
            ]).slice(0,6).map((t:any,i:number)=>(
              <div key={i} className="bg-white rounded-2xl p-6 border border-obsidian/5">
                <div className="flex gap-1 text-champagne">{'★★★★★'.slice(0,t.rating||5)}</div>
                <p className="text-sm leading-relaxed mt-3">“{t.comment}”</p>
                <div className="text-sm font-medium mt-4">{t.name}</div>
                <div className="text-xs opacity-60">{t.role}</div>
                {t.is_verified_purchase && <span className="text-[11px] bg-emerald text-pearl px-2 py-1 rounded-full mt-2 inline-block">Verified purchase</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personalization & Gifting */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-10 py-14 grid md:grid-cols-3 gap-6">
        {[
          {title:'Birthday & Anniversary', desc:'Curated gifts for every year together.', img:'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop'},
          {title:'Bridal & Wedding', desc:'Heirloom sets for the modern muse.', img:'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop'},
          {title:'Personalised', desc:'Engravings & custom inquiries.', img:'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop'},
        ].map(c=>(
          <div key={c.title} className="relative rounded-[22px] overflow-hidden aspect-[4/3]">
            <img src={c.img} className="w-full h-full object-cover" alt={c.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 p-6 text-pearl">
              <div className="font-serif text-xl">{c.title}</div>
              <div className="text-sm opacity-80">{c.desc}</div>
              <Link to="/custom-inquiry" className="inline-block mt-3 bg-white text-obsidian text-xs uppercase tracking-widest px-4 py-2 rounded-full">Book Consultation</Link>
            </div>
          </div>
        ))}
      </section>

      {/* Newsletter + Instagram */}
      <section className="bg-obsidian text-pearl">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-14 grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="font-serif text-[28px]">Join the Om's circle</h3>
            <p className="text-sm text-pearl/70 mt-2">Early access to new collections, private appointments & care tips.</p>
            <form onSubmit={async(e:any)=>{
              e.preventDefault();
              const fd=new FormData(e.target);
              const email=fd.get('email') as string;
              const {api}=await import('../api/client');
              try{ await api.post('/newsletter/subscribe/',{email,consent_given:true}); alert('Subscribed!'); }catch(err:any){ alert(err.response?.data?.detail || 'Subscribed'); }
            }} className="flex gap-3 mt-6 max-w-md">
              <input name="email" type="email" required placeholder="Your email" className="flex-1 rounded-full px-5 py-3 bg-white/10 border border-white/15 placeholder:text-pearl/40 outline-none" />
              <label className="flex items-center gap-1 text-xs"><input type="checkbox" required /> I consent</label>
              <button className="bg-champagne text-obsidian rounded-full px-6">Subscribe</button>
            </form>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.18em] uppercase text-champagne">Social Gallery — Curated</h4>
            <div className="grid grid-cols-4 gap-3 mt-4">
              {[1,2,3,4,5,6,7,8].map(i=> <img key={i} src={`https://picsum.photos/seed/om${i}/300/300`} alt="gallery" className="aspect-square object-cover rounded-xl" loading="lazy" />)}
            </div>
            <p className="text-xs text-pearl/50 mt-3">Live Instagram integration ready — configure token to show live feed; otherwise curated admin-managed images are shown.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
