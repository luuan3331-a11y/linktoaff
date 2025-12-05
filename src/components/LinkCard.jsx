import React from 'react'
import { ExternalLink } from 'lucide-react'

// This component is the main visually appealing card for the user
export default function LinkCard({ link }) {
  const { title, description, image_url, affiliate_url, target_url } = link

  const handleClick = () => {
    // 1. Open Affiliate Link in New Tab
    window.open(affiliate_url, '_blank')
    
    // 2. Redirect Current Tab to Target URL
    // Small delay to ensure the new tab trigger registers
    setTimeout(() => {
        window.location.href = target_url
    }, 100)
  }

  return (
    <div className="card max-w-sm w-full mx-auto overflow-hidden animate-fade-in p-0 border border-gray-100">
      {image_url ? (
        <div className="w-full h-48 bg-gray-100 relative">
            <img 
                src={image_url} 
                alt={title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                    e.target.src = 'https://placehold.co/600x400?text=Preview'
                }}
            />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
          <span className="text-4xl">✨</span>
        </div>
      )}
      
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold mb-2 text-[#1d1d1f]">{title}</h1>
        {description && (
          <p className="text-[#86868b] text-sm mb-6 line-clamp-3">
            {description}
          </p>
        )}
        
        <button 
          onClick={handleClick}
          className="btn btn-primary w-full py-3 text-lg shadow-lg shadow-orange-200"
        >
          <span>👉 Xem ngay</span>
        </button>
        
        <p className="mt-4 text-xs text-gray-400">
            Bạn sẽ được chuyển hướng trong giây lát...
        </p>
      </div>
    </div>
  )
}
