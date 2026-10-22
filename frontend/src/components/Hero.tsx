import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useRef } from 'react'

export default function Hero(){
  const ref=useRef<HTMLDivElement>(null)
  const {scrollYProgress}=useScroll({ target: ref, offset: ["start start","end start"]})
  const y = useTransform(scrollYProgress, [0,1], [0,120])
  const opacity = useTransform(scrollYProgress, [0,0.8], [1,0])

  return (
    <section ref={ref} className="relative h-[96vh] min-h-[620px] max-h-[900px] overflow-hidden bg-obsidian">
      {/* background */}
      <motion.div style={{y}} className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=2000&h=1400&fit=crop" alt="Luxury jewellery" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/10" />
        {/* gold particles */}
        <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle at 20% 30%, #D4AF72 1px, transparent 1px), radial-gradient(circle at 80% 70%, #fff 1px, transparent 1px)" , backgroundSize:"420px 420px"}} />
      </motion.div>

      <motion.div style={{opacity}} className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-10 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="text-champagne text-[11px] md:text-xs tracking-[0.22em] uppercase">Om's Jewellers • Pune</motion.p>
          <motion.h1 initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.35, duration:0.9}} className="font-serif text-[40px] md:text-[66px] lg:text-[78px] leading-[0.95] text-pearl mt-4">
            Where Timeless<br/>
            <span className="italic font-light text-champagne">Elegance</span> Meets<br/>Modern Luxury.
          </motion.h1>
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.7}} className="text-pearl/80 text-[15px] md:text-[17px] leading-relaxed mt-6 max-w-xl">
            Discover jewellery crafted to celebrate your most meaningful moments — from heirloom bridal sets to everyday icons.
          </motion.p>
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.9}} className="flex flex-wrap gap-3 mt-8">
            <Link to="/shop" className="bg-champagne text-obsidian px-8 py-3.5 rounded-full text-sm font-medium tracking-wide hover:bg-white transition">Explore the Collection</Link>
            <Link to="/about" className="bg-white/10 backdrop-blur border border-white/20 text-pearl px-8 py-3.5 rounded-full text-sm tracking-wide hover:bg-white hover:text-obsidian transition">Discover Our Story</Link>
          </motion.div>
          <div className="flex items-center gap-6 mt-8 text-pearl/70 text-xs">
            <div className="flex -space-x-2"><img src="https://i.pravatar.cc/100?img=5" className="w-8 h-8 rounded-full border-2 border-white/30" /><img src="https://i.pravatar.cc/100?img=8" className="w-8 h-8 rounded-full border-2 border-white/30" /><img src="https://i.pravatar.cc/100?img=9" className="w-8 h-8 rounded-full border-2 border-white/30" /></div>
            <span>Trusted by 12,000+ families • BIS hallmarked • Certified diamonds</span>
          </div>
        </div>
      </motion.div>

      {/* scroll indicator */}
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.4}} className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-pearl/70">
        <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-pearl/60 to-transparent animate-pulse" />
      </motion.div>

      {/* bottom stats */}
      <div className="absolute bottom-0 left-0 right-0 bg-pearl/95 backdrop-blur-xl border-t border-obsidian/5">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-4 flex flex-wrap gap-6 md:gap-10 text-[12px]">
          <div><span className="font-serif text-lg">25+</span> <span className="opacity-60">Years of trust</span></div>
          <div><span className="font-serif text-lg">12k+</span> <span className="opacity-60">Heirloom pieces delivered</span></div>
          <div><span className="font-serif text-lg">4.9/5</span> <span className="opacity-60">Client rating</span></div>
          <div className="ml-auto hidden md:flex items-center gap-2 text-emerald"><span className="w-2 h-2 bg-emerald rounded-full animate-pulse" /> Complimentary shipping on eligible orders</div>
        </div>
      </div>
    </section>
  )
}
