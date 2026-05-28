import { Routes, Route } from 'react-router-dom'
import TickerBar from './components/TickerBar'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TrustBadges from './components/TrustBadges'
import VendorGrid from './components/VendorGrid'
import Reviews from './components/Reviews'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import PurchaseToast from './components/PurchaseToast'
import SuccessPage from './pages/SuccessPage'

function HomePage() {
  return (
    <>
      <Hero />
      <TrustBadges />
      <VendorGrid />
      <Reviews />
      <FAQ />
      <Footer />
      <PurchaseToast />
    </>
  )
}

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#05050a] text-white overflow-x-hidden">
      <TickerBar />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </div>
  )
}
