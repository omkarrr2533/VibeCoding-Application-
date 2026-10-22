import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Collections from './pages/Collections'
import CollectionDetail from './pages/CollectionDetail'
import ProductDetail from './pages/ProductDetail'
import SearchResults from './pages/SearchResults'
import Wishlist from './pages/Wishlist'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import { Login, Register } from './pages/Auth'
import Account from './pages/Account'
import OrderDetail from './pages/OrderDetail'
import Tracking from './pages/Tracking'
import Analytics from './pages/Analytics'
import { About, Contact, CustomInquiry, CareGuide, FAQ, ShippingReturns, Privacy, Terms, NotFound } from './pages/Static'

const qc=new QueryClient()

export default function App(){
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="collections" element={<Collections />} />
            <Route path="collections/:slug" element={<CollectionDetail />} />
            <Route path="product/:slug" element={<ProductDetail />} />
            <Route path="search" element={<SearchResults />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="account" element={<Account />} />
            <Route path="order/:id" element={<OrderDetail />} />
            <Route path="track-order" element={<Tracking />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="custom-inquiry" element={<CustomInquiry />} />
            <Route path="care-guide" element={<CareGuide />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="shipping-returns" element={<ShippingReturns />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
