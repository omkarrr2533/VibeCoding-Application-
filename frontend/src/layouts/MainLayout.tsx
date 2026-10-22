import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AnnouncementBar from '../components/AnnouncementBar'
import { Toaster } from '../components/Toaster'

export default function MainLayout(){
  return (
    <div className="min-h-screen bg-pearl">
      <AnnouncementBar />
      <Navbar />
      <main><Outlet /></main>
      <Footer />
      <Toaster />
    </div>
  )
}
