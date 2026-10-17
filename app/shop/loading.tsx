export default function ShopLoading() {
  // Generates 3 clean, fading grey blocks to mimic your premium product cards
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 md:px-12 animate-pulse">
      <div className="max-w-7xl mx-auto">
        
        {/* Animated Brand Title Skeleton */}
        <div className="text-center mb-12 flex flex-col items-center">
          <div className="h-10 w-64 bg-zinc-900 rounded-sm mb-3" />
          <div className="h-3 w-40 bg-zinc-950 rounded-sm" />
        </div>

        {/* Animated Filter Bar Skeleton */}
        <div className="flex justify-center gap-6 md:gap-8 mb-16 border-b border-white/[0.03] pb-6">
          <div className="h-4 w-20 bg-zinc-900 rounded-sm" />
          <div className="h-4 w-32 bg-zinc-950 rounded-sm" />
          <div className="h-4 w-32 bg-zinc-950 rounded-sm" />
        </div>

        {/* Product Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((block) => (
            <div 
              key={block} 
              className="border border-white/[0.02] bg-[#030303] p-8 rounded-sm h-64 flex flex-col justify-between"
            >
              <div>
                <div className="h-7 w-3/4 bg-zinc-900 rounded-sm mb-4" />
                <div className="h-5 w-1/3 bg-zinc-950 rounded-sm" />
              </div>
              <div className="flex justify-between items-center pt-5 border-t border-white/[0.02]">
                <div className="h-6 w-16 bg-zinc-900 rounded-sm" />
                <div className="h-8 w-24 bg-zinc-950 rounded-sm" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}