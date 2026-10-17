import Navigation from '../components/layout/Navigation';
import IntroStrip from '../components/sections/IntroStrip';
import SignatureExperience from '../components/sections/SignatureExperience';
import BrandStory from '../components/sections/BrandStory';
import PremiumCollection from '../components/sections/PremiumCollection';
import BrewingExperience from '../components/sections/BrewingExperience';
import CustomerStories from '../components/sections/CustomerStories';
import Feature3D from '@/components/sections/Feature3D';
import EnquiryForm from '../components/EnquiryForm'; // <-- NEW: Imported your luxury form

// We will uncomment these last three once we create their files!
import BlogPreview from '../components/sections/BlogPreview';
import Newsletter from '../components/sections/Newsletter';
import Footer from '../components/layout/Footer';

export default function Home() {
  return (
    <main className="relative w-full bg-luxury-black min-h-screen overflow-hidden">
      <Navigation />
      
      <IntroStrip />
      <SignatureExperience />
      <BrandStory />
      <PremiumCollection />
      
      {/* THIS IS THE MAGIC LINE TO RENDER YOUR 3D GLB MODEL SECTION */}
      <Feature3D />
      
      <BrewingExperience />
      <CustomerStories />
      
      {/* NEW: Placed the enquiry stream perfectly at the lower third of the homepage flow */}
      <EnquiryForm />
      
      {/* <BlogPreview /> */}
      {/* <Newsletter /> */}
      {/* <Footer /> */}
    </main>
  );
}