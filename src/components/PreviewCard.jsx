import React, { useEffect, useState } from 'react'

export default function PreviewCard({ link, onTrackClick }) {
  const { title, description, image_url, affiliate_url } = link
  
  // Handle layout height to fit screen
  // We use h-[100dvh] to ensure it fits mobile viewports with address bars
  
  const handleClick = (e) => {
    e.preventDefault() // Prevent default if it was an <a> tag, though we'll switch to <button> or <div>

    // 1. Notify parent to track click
    if (onTrackClick) onTrackClick()
    
    // 2. Open Affiliate Link in New Tab
    const newWindow = window.open(affiliate_url, '_blank')
    
    // Attempt to keep focus on the CURRENT window (Best effort, browsers often block this)
    if (newWindow) {
        // Tactic: Blur the new window immediately
        try { newWindow.blur() } catch(e) {}
        try { window.focus() } catch(e) {}
    }

    // 3. Redirect current tab to target_url IMMEDIATELY
    // We remove the delay to ensure the current tab remains active/loading the target immediately
    // usage of window.location.replace might be better to avoid history buildup of the preview page
    if (link.target_url) {
        window.location.href = link.target_url
    }
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
            <div className="mt-auto pt-4 pb-2">
                <button 
                    onClick={handleClick}
                    className="group relative w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-center text-xl font-bold rounded-xl transition-all shadow-lg shadow-orange-200 hover:shadow-orange-300 transform hover:-translate-y-1 active:scale-95 animate-pulse-slow"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        👉 XEM NGAY
                    </span>
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </button>
                <p className="text-center text-xs text-gray-400 mt-3 animate-fade-in">
                    Bạn sẽ được chuyển hướng trong giây lát...
                </p>
            </div>
        </div>
      </div>
    </div>
  )
}
