import { useAnnouncements } from '../api/hooks'
export default function AnnouncementBar(){
  const {data} = useAnnouncements()
  const items = data?.results || data || []
  const text = items[0]?.text || "Complimentary shipping on eligible orders  •  Discover our latest Bridal Collection  •  Book a personal consultation"
  return (
    <div className="bg-obsidian text-pearl text-[11px] md:text-xs tracking-[0.14em] uppercase py-2.5 px-4 text-center relative overflow-hidden">
      <div className="animate-pulse opacity-90">{text}</div>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20" />
    </div>
  )
}
