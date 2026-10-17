import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-luxury-black pt-32 pb-12 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 mb-32">
          
          <div className="md:col-span-2">
            <Link href="/" className="font-serif text-3xl tracking-widest text-luxury-beige block mb-6">
              L'ESSENCE
            </Link>
            <p className="font-sans text-sm text-luxury-sage font-light max-w-sm">
              Elevating the daily ritual through uncompromising sourcing, meticulous roasting, and a dedication to the cinematic art of coffee.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-luxury-sage mb-2">Explore</span>
            <Link href="#collection" className="font-sans text-sm text-luxury-beige/70 hover:text-luxury-beige transition-colors">The Collection</Link>
            <Link href="#story" className="font-sans text-sm text-luxury-beige/70 hover:text-luxury-beige transition-colors">Our Heritage</Link>
            <Link href="/journal" className="font-sans text-sm text-luxury-beige/70 hover:text-luxury-beige transition-colors">Journal</Link>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-luxury-sage mb-2">Connect</span>
            <a href="#" className="font-sans text-sm text-luxury-beige/70 hover:text-luxury-beige transition-colors">Instagram</a>
            <a href="#" className="font-sans text-sm text-luxury-beige/70 hover:text-luxury-beige transition-colors">Twitter</a>
            <a href="mailto:concierge@lessence.com" className="font-sans text-sm text-luxury-beige/70 hover:text-luxury-beige transition-colors">concierge@lessence.com</a>
          </div>
          
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
          <span className="font-sans text-xs text-luxury-sage/50">
            © {new Date().getFullYear()} L'Essence Coffee. All rights reserved.
          </span>
          <div className="flex gap-6">
            <Link href="#" className="font-sans text-xs text-luxury-sage/50 hover:text-luxury-beige transition-colors">Privacy Policy</Link>
            <Link href="#" className="font-sans text-xs text-luxury-sage/50 hover:text-luxury-beige transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}