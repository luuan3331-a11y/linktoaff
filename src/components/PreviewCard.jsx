import React, { useEffect, useState } from 'react'

export default function PreviewCard({ link, onTrackClick }) {
  const { title, description, image_url, affiliate_url } = link
  
  // Handle layout height to fit screen
  // We use h-[100dvh] to ensure it fits mobile viewports with address bars
  
  const handleClick = (e) => {
    // 1. Notify parent to track click
    if (onTrackClick) onTrackClick()
    
    // 2. Affiliate link opens in new tab via native <a> behavior (target="_blank")
    // This is the most reliable way to avoid popup blockers.
    
    // 3. Redirect current tab to target_url
    // We delay slightly to allow the new tab event to process
    setTimeout(() => {
        if (link.target_url) {
            window.location.href = link.target_url
        }
    }, 500)
  }

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 bg-[#f5f5f7]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Image Section - Flex shrink allowed, max height limited */}
        {image_url && (
            <div className="relative w-full shrink-0 max-h-[35vh] overflow-hidden bg-gray-100">
                <img 
                    src={image_url} 
                    alt={title} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none' }}
                />
            </div>
        )}

        {/* Content Section - Flex grow to fill available space handled by padding/margins */}
        <div className="flex flex-col p-6 flex-1 overflow-y-auto">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-2 shrink-0">
                {title}
            </h1>
            
            {description && (
                <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6 overflow-y-auto line-clamp-6">
                    {description}
                </p>
            )}

            {/* Spacer to push button to bottom if needed, or just margin */}
            <div className="mt-auto pt-4">
                <a 
                    href={affiliate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleClick}
                    className="block w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-center text-lg font-bold rounded-xl transition-transform active:scale-95 shadow-lg shadow-blue-200 no-underline"
                >
                    👉 Xem ngay
                </a>
                <p className="text-center text-xs text-gray-400 mt-3">
                    Bạn sẽ được chuyển hướng trong giây lát...
                </p>
            </div>
        </div>
      </div>
    </div>
  )
}
