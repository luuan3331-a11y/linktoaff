import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import PreviewCard from '../components/PreviewCard'

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

  const handleTrackClick = async () => {
    if (link) {
         await supabase.rpc('increment_click_count', { row_id: link.id })
    }
  }

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
    <PreviewCard link={link} onTrackClick={handleTrackClick} />
  )
}
