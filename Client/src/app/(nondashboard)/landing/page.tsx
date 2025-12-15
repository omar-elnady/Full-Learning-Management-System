import FloatingIcons from './FloatingIcons'
import HeroSection from './HeroSection'
import FeaturedCourses from './FeaturedCourses'
import Footer from '@/components/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-background overflow-hidden relative">
      <div className="relative ">
        <div className='relative md:block hidden'>
          <FloatingIcons />
        </div>
        <HeroSection />
      </div>
      <FeaturedCourses />
      <Footer />
    </div>
  )
}