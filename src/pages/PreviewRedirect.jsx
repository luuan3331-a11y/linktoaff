import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import LinkCard from '../components/LinkCard'

export default function PreviewRedirect() {
  const { slug } = useParams()
  const [link, setLink] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchLink() {
      if (!slug) return

      try {
        const { data, error } = await supabase
          .from('links')
          .select('*')
          .eq('slug', slug)
          .single()

        if (error || !data) {
            setError('Link không tồn tại hoặc đã bị xóa.')
        } else if (!data.is_active) {
            setError('Link này hiện đang tạm ngưng hoạt động.')
        } else {
            setLink(data)
            // Increment view count (optional but requested "view/click" count)
            // We'll increment click only on actual button click in a real app, 
            // but for "view" logic we can do it here. 
            // The requirement said "Số lượt click", so we should probably count when they click the button.
            // But let's verify if we want to count page loads.
            // "Ghi nhận 1 lượt click vào database (tăng trường clickCount cho bản ghi đó)." -> This refers to the button click action in requirements.
        }
      } catch (err) {
        setError('Đã có lỗi xảy ra.')
      } finally {
        setLoading(false)
      }
    }

    fetchLink()
  }, [slug])

  const handleCardClickWithTracking = async () => {
    // Optimistic UI updates are handled inside LinkCard via direct window actions
    // Here we just track the click in DB
    if (link) {
         await supabase.rpc('increment_click_count', { row_id: link.id })
    }
  }

  // We actually need to pass a tracking wrapper to LinkCard, or handle it inside LinkCard.
  // Ideally LinkCard calls a prop `onCtaClick`
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="animate-pulse flex flex-col items-center">
            <div className="h-48 w-full max-w-sm bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] p-4 text-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h1>
            <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] p-4">
      {/* We intercept the click in LinkCard, but let's actually modify LinkCard to accept onAction */}
      {/* 
        Wait, earlier I wrote LinkCard with hardcoded logic. 
        I should update LinkCard to be cleaner or simply wrap the logic there.
        Actually, the Requirement says: "Khi người dùng bấm nút CTA: ... Ghi nhận 1 lượt click".
        The window.open part must happen synchronously to avoid popup blockers.
        So the async DB call must not block window.open.
      */}
      <LinkCardWrapper link={link} />
    </div>
  )
}

function LinkCardWrapper({ link }) {
    const handleCtaClick = () => {
        // Fire and forget tracking
        supabase
          .from('links')
          .update({ click_count: (link.click_count || 0) + 1 })
          .eq('id', link.id)
          .then(() => {}) // Ignore result
          
        // 1. Open Aff
        window.open(link.affiliate_url, '_blank')
        // 2. Redirect Source (Target)
        // Delay slightly
        setTimeout(() => {
            window.location.href = link.target_url
        }, 150)
    }

    // Reuse visual component but override behavior? 
    // Actually I implemented logic in LinkCard.jsx Step 53.
    // Let's rewrite LinkCard to accept an onClick handler if we want tracking outside,
    // OR just duplicate the component JSX here for simplicity if needed, 
    // BUT better: Update LinkCard to take an onClick prop.
    
    // For now, I'll assume LinkCard handles the open logic. 
    // I need to patch LinkCard to do the tracking OR do the tracking inside LinkCard.
    // I'll update LinkCard in next step to be smarter.
    
    return (
        // Temporary: passing link.
        <ModifiedLinkCard link={link} />
    )
}

// Re-implementing a specific version for this page to ensure correct behavior
function ModifiedLinkCard({ link }) {
  const handleClick = (e) => {
    // Allow the default link behavior (open new tab) to happen
    // We only handle the current tab redirect and tracking
    
    // Track (Fire and forget)
    supabase
        .from('links')
        .update({ click_count: (link.click_count || 0) + 1 })
        .eq('id', link.id)
        .then(() => {}) 

    // Redirect Current Tab to Target URL after a short delay
    // This allows the browser to register the new tab opening first
    setTimeout(() => {
        window.location.href = link.target_url
    }, 500) // Increased delay slightly to ensures pop-under feel
  }
  
  return (
    <div className="card max-w-sm w-full mx-auto overflow-hidden shadow-lg p-0 bg-white">
       {link.image_url && (
        <div className="w-full h-56 bg-gray-100 relative">
            <img 
                src={link.image_url} 
                alt={link.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                   e.target.style.display = 'none' 
                }}
            />
        </div>
      )}
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-3 text-gray-900">{link.title}</h1>
        {link.description && (
          <p className="text-gray-600 mb-8 leading-relaxed">
            {link.description}
          </p>
        )}
        
        {/* KEY CHANGE: Use <a> tag instead of <button> + window.open */}
        {/* This prevents popup blockers because it's a native user click navigation */}
        <a 
          href={link.affiliate_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="btn btn-primary w-full py-4 text-lg font-bold shadow-xl shadow-orange-100 transform transition hover:-translate-y-1 block no-underline"
        >
          👉 Xem ngay
        </a>
      </div>
    </div>
  )
}
