import React from 'react'
import { Loader2 } from 'lucide-react'

export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#FFE66D]">
      <div className="flex flex-col items-center gap-6">
        {/* Neo-brutalist loading box */}
        <div className="relative bg-[#A6FAFF] border-4 border-black p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
          <Loader2 className="w-16 h-16 text-black animate-spin" strokeWidth={3} />
        </div>
        
        {/* Loading text with neo-brutalist style */}
        <div className="bg-white border-4 border-black px-6 py-3 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          <p className="text-black font-black text-lg uppercase tracking-wider">Loading...</p>
        </div>
      </div>
    </div>
  )
}
