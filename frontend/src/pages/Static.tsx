import { Link } from 'react-router-dom'
export function About(){
  return (
    <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-12">
      <h1 className="font-serif text-[40px] leading-none">Our Story</h1>
      <p className="text-sm opacity-60 mt-2">Heritage and craftsmanship — transparent product information, secure checkout, care guidance.</p>
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <img src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1000&h=1200&fit=crop" className="rounded-[22px] aspect-[4/5] object-cover" alt="story"/>
        <div className="space-y-4 text-sm leading-relaxed">
          <p>Om's Jewellers was founded to celebrate Indian jewellery as living heritage. From temple chokers to celestial diamonds, each piece is conceived by designers and realised by master karigars who uphold generations of skill.</p>
          <p>We pair traditional handwork with contemporary precision — ensuring every creation feels heirloom and new. We do not invent claims about certifications, years or origins; we disclose weight, purity and materials transparently, and note where certifications apply.</p>
          <ul className="list-disc list-inside space-y-1 opacity-80">
            <li>Craftsmanship & attention to detail</li>
            <li>Traditional inspiration, modern design</li>
            <li>Personal styling consultations</li>
          </ul>
          <Link to="/shop" className="inline-block mt-4 bg-obsidian text-pearl px-6 py-2.5 rounded-full">Explore Collection</Link>
        </div>
      </div>
    </div>
  )
}
export function Contact(){
  const submit= async(e:any)=>{
    e.preventDefault()
    const fd=new FormData(e.target)
    const payload=Object.fromEntries(fd.entries())
    try{
      const {api}=await import('../api/client')
      await api.post('/contact/', payload)
      alert('Inquiry submitted — we’ll respond within 24 hours.')
      e.target.reset()
    }catch{ alert('Failed') }
  }
  return (
    <div className="max-w-[900px] mx-auto px-6 py-12">
      <h1 className="font-serif text-[36px]">Contact Us</h1>
      <p className="text-sm opacity-60 mt-2">MG Road, Pune • +91 98220 12345 • hello@omsjewellers.example.com • 10 AM–8:30 PM</p>
      <form onSubmit={submit} className="bg-white rounded-[22px] p-6 mt-6 space-y-3 border border-obsidian/5">
        <div className="grid md:grid-cols-2 gap-3">
          <input name="name" required placeholder="Your name" className="border border-obsidian/15 rounded-full px-4 py-3" />
          <input name="email" required type="email" placeholder="Email" className="border border-obsidian/15 rounded-full px-4 py-3" />
        </div>
        <input name="phone" placeholder="Phone" className="w-full border border-obsidian/15 rounded-full px-4 py-3" />
        <input name="subject" placeholder="Subject" className="w-full border border-obsidian/15 rounded-full px-4 py-3" />
        <textarea name="message" required placeholder="How can we help?" rows={4} className="w-full border border-obsidian/15 rounded-2xl px-4 py-3" />
        <button className="bg-obsidian text-pearl rounded-full px-6 py-3">Send Message</button>
      </form>
      <div className="mt-8 bg-ivory rounded-2xl p-6">
        <h3 className="font-medium">Visit our atelier</h3>
        <p className="text-sm opacity-60 mt-1">Book a private appointment for bridal trials and custom consultations.</p>
        <Link to="/custom-inquiry" className="inline-block mt-3 bg-obsidian text-pearl px-5 py-2 rounded-full text-sm">Custom Inquiry</Link>
      </div>
    </div>
  )
}
export function CustomInquiry(){
  const onSubmit= async(e:any)=>{
    e.preventDefault()
    const fd=new FormData(e.target)
    const payload=Object.fromEntries(fd.entries())
    try{
      const {api}=await import('../api/client')
      await api.post('/custom-inquiry/', payload)
      alert('Custom inquiry received!')
      e.target.reset()
    }catch{ alert('Failed')}
  }
  return (
    <div className="max-w-[900px] mx-auto px-6 py-12">
      <h1 className="font-serif text-[32px]">Custom Jewellery Inquiry</h1>
      <p className="text-sm opacity-60 mt-2">Tell us about your vision — budget, occasion, inspiration. We’ll respond with concepts and next steps.</p>
      <form onSubmit={onSubmit} className="bg-white rounded-[22px] p-6 mt-6 space-y-3 border border-obsidian/5">
        <div className="grid md:grid-cols-2 gap-3">
          <input name="name" required placeholder="Name" className="border rounded-full px-4 py-3" />
          <input name="email" required type="email" placeholder="Email" className="border rounded-full px-4 py-3" />
        </div>
        <input name="phone" placeholder="Phone" className="w-full border rounded-full px-4 py-3" />
        <input name="budget_range" placeholder="Budget range (e.g. ₹50k-₹1L)" className="w-full border rounded-full px-4 py-3" />
        <textarea name="description" required placeholder="Describe your idea" rows={4} className="w-full border rounded-2xl px-4 py-3" />
        <button className="bg-obsidian text-pearl rounded-full px-6 py-3">Submit Inquiry</button>
      </form>
    </div>
  )
}
export function CareGuide(){
  return (
    <div className="max-w-[900px] mx-auto px-6 py-12">
      <h1 className="font-serif text-[32px]">Jewellery Care Guide</h1>
      <div className="prose prose-sm mt-4 max-w-none text-sm leading-relaxed opacity-80">
        <ul className="list-disc list-inside space-y-2">
          <li>Store each piece in its soft pouch, away from moisture and sunlight.</li>
          <li>Avoid contact with perfumes, hairspray and harsh chemicals.</li>
          <li>Clean with a soft, lint-free cloth; for diamonds, lukewarm soapy water and gentle brushing.</li>
          <li>Have prongs and clasps checked periodically by a trusted jeweller.</li>
          <li>Remove jewellery before swimming, gym or heavy manual work.</li>
        </ul>
      </div>
    </div>
  )
}
export function FAQ(){
  const faqs=[
    {q:'Are your diamonds certified?',a:'We disclose certifications where applicable and provide authenticity notes when available. Please refer to product specifications.'},
    {q:'Is gold BIS hallmarked?',a:'Gold purity marking and hallmark information is provided transparently on applicable products.'},
    {q:'What is your return policy?',a:'Please see Shipping & Returns for eligible windows. Hygiene and custom pieces may be non-returnable.'},
    {q:'Do you offer resizing?',a:'Select rings support sizing via variants. Contact us for resizing guidance.'},
  ]
  return (
    <div className="max-w-[900px] mx-auto px-6 py-12">
      <h1 className="font-serif text-[32px]">Frequently Asked Questions</h1>
      <div className="mt-6 space-y-4">
        {faqs.map(f=> <details key={f.q} className="bg-white rounded-2xl p-5 border border-obsidian/5"><summary className="font-medium cursor-pointer">{f.q}</summary><p className="text-sm opacity-70 mt-2">{f.a}</p></details>)}
      </div>
    </div>
  )
}
export function ShippingReturns(){
  return (
    <div className="max-w-[900px] mx-auto px-6 py-12">
      <h1 className="font-serif text-[32px]">Shipping & Returns</h1>
      <div className="text-sm leading-relaxed opacity-80 mt-4 space-y-3">
        <p>Orders are processed in 1–2 business days and shipped via insured courier. Complimentary shipping on eligible orders (see announcement bar / checkout). Delivery in 3–7 business days for ready stock; made-to-order timelines are communicated at purchase.</p>
        <p>Returns: Eligible ready-stock pieces may be returned within 7 days in original condition, with tags and packaging. Custom, engraved or hygiene-sensitive pieces are non-returnable. Refunds are processed to the original payment method after inspection.</p>
        <p>For assistance: hello@omsjewellers.example.com</p>
      </div>
    </div>
  )
}
export function Privacy(){
  return (
    <div className="max-w-[900px] mx-auto px-6 py-12">
      <h1 className="font-serif text-[32px]">Privacy Policy</h1>
      <p className="text-sm opacity-70 mt-4">We collect only information needed to fulfill orders, provide support and improve our services. We never store card numbers, CVVs or payment credentials; payments are handled by Razorpay. You may request data deletion via hello@omsjewellers.example.com. We use cookies for authentication and analytics where consented.</p>
    </div>
  )
}
export function Terms(){
  return (
    <div className="max-w-[900px] mx-auto px-6 py-12">
      <h1 className="font-serif text-[32px]">Terms & Conditions</h1>
      <p className="text-sm opacity-70 mt-4">By using this site you agree to our terms. Prices are in INR, inclusive of applicable taxes where noted; shipping and duties may apply. Product images are indicative; slight variations may occur due to handcrafting. We reserve the right to correct pricing errors and cancel orders where necessary, with a full refund.</p>
    </div>
  )
}
export function NotFound(){
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="text-[72px] font-serif leading-none">404</div>
      <div className="font-serif text-2xl mt-2">This sparkle is missing</div>
      <p className="text-sm opacity-60 mt-2">The page you’re looking for doesn’t exist or has moved.</p>
      <Link to="/" className="mt-6 bg-obsidian text-pearl px-7 py-3 rounded-full">Back to Home</Link>
    </div>
  )
}
function SearchUI({q,data}:{q:string,data:any}){
  const results=data?.results||[]
  return (
    <div className="max-w-[1100px] mx-auto px-6 py-10">
      <h1 className="font-serif text-[32px]">Search {q && `for "${q}"`}</h1>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {results.map((p:any)=>(
          <Link key={p.id} to={`/product/${p.slug}`} className="bg-white rounded-2xl overflow-hidden border border-obsidian/5">
            <img src={p.images?.[0]?.image||'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop'} alt={p.name} className="aspect-square object-cover" />
            <div className="p-3"><div className="text-sm font-medium">{p.name}</div><div className="text-sm">₹{p.price}</div></div>
          </Link>
        ))}
        {q && results.length===0 && <div className="col-span-4 text-center p-8 bg-white rounded-2xl">No results for "{q}" — try another term.</div>}
      </div>
    </div>
  )
}
