import React, { useEffect, useState } from 'react'

export default function PreviewCard({ link, onTrackClick }) {
  const { title, description, image_url, affiliate_url } = link
  
  // Handle layout height to fit screen
  // We use h-[100dvh] to ensure it fits mobile viewports with address bars
  
  const handleClick = (e) => {
    // 1. Notify parent to track click (count update)
    if (onTrackClick) onTrackClick()
    
    // 2. Logic:
    // - New Tab (href): Opens Target URL (Link Gốc)
    // - Current Tab (onClick): Redirects to Affiliate URL (Link Aff)
    
    // Redirect CURRENT tab to Affiliate Link immediately
    // Use replace to prevent "Back" button loop if possible, or href is fine.
    // We ADD A DELAY to ensure the browser has time to process the "Open in new tab" (target="_blank") event first.
    // Without delay, the immediate redirect might cancel the new tab opening in some browsers.
    setTimeout(() => {
        window.location.href = affiliate_url
    }, 150)
  }

  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-center p-2 sm:p-4 bg-[#f5f5f7] overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85dvh] sm:max-h-[90dvh] relative">
        
        {/* Image Section - Allow shrinking if space is low */}
        {image_url && (
            <div className="relative w-full shrink min-h-0 basis-auto overflow-hidden bg-gray-50 flex items-center justify-center">
                <img 
                    src={image_url} 
                    alt={title} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none' }}
                />
            </div>
        )}

        {/* Content Section - Prevent shrinking so text/button stay visible */}
        <div className="flex flex-col p-4 sm:p-6 shrink-0 z-10 bg-white">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight mb-2 shrink-0 line-clamp-2">
                {title}
            </h1>
            
            {description && (
                <p className="text-sm text-gray-600 leading-relaxed mb-4 overflow-y-auto line-clamp-3 sm:line-clamp-4 max-h-[20vh]">
                    {description}
                </p>
            )}

            {/* Spacer */}
            <div className="mt-auto pt-2">
                <a 
                    href={link.target_url} 
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    onClick={handleClick}
                    className="btn btn-primary btn-super-cta w-full py-3 sm:py-4 rounded-xl animate-pulse-slow text-base sm:text-lg"
                >
                    👉 XEM NGAY
                </a>
                <p className="text-center text-xs text-gray-400 mt-2 animate-fade-in">
                    Bạn sẽ được chuyển hướng trong giây lát...
                </p>
            </div>
        </div>
      </div>
    </div>
  )
}
