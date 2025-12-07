import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { generateSlug, isValidUrl } from '../lib/utils'
import { Plus, Edit, Trash2, Eye, Copy, CheckCircle, ExternalLink, Power } from 'lucide-react'

export default function Dashboard() {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_url: '',
    affiliate_url: '',
    image_url: '',
    slug: '',
    is_active: true
  })

  // Fetch Links
  const fetchLinks = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setLinks(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  // Handlers
  const handleEdit = (link) => {
    setFormData({
      title: link.title || '',
      description: link.description || '',
      target_url: link.target_url || '',
      affiliate_url: link.affiliate_url || '',
      image_url: link.image_url || '',
      slug: link.slug,
      is_active: link.is_active
    })
    setEditingId(link.id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return
    await supabase.from('links').delete().eq('id', id)
    fetchLinks()
  }

  const handleToggle = async (link) => {
    await supabase
      .from('links')
      .update({ is_active: !link.is_active })
      .eq('id', link.id)
    fetchLinks()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      target_url: '',
      affiliate_url: '',
      image_url: '',
      slug: '',
      is_active: true
    })
    setEditingId(null)
    setIsFormOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title || !formData.target_url || !formData.affiliate_url) {
      alert('Please fill in Title, Target URL and Affiliate URL')
      return
    }

    // Slug generation
    let finalSlug = formData.slug
    if (!finalSlug) {
      finalSlug = generateSlug()
    }

    const payload = {
      ...formData,
      slug: finalSlug
    }

    if (editingId) {
      const { error } = await supabase
        .from('links')
        .update(payload)
        .eq('id', editingId)
      if (error) alert('Error updating link: ' + error.message)
    } else {
      const { error } = await supabase
        .from('links')
        .insert([payload])
      if (error) alert('Error creating link: ' + error.message)
    }

    resetForm()
    fetchLinks()
  }

  const copyToClipboard = (slug) => {
    const url = `${window.location.origin}/p/${slug}`
    navigator.clipboard.writeText(url)
    alert('Link copied: ' + url)
  }

  const fetchMetadata = async () => {
    const url = formData.target_url
    if (!url || !isValidUrl(url)) {
      alert('Please enter a valid Target URL first')
      return
    }

    const previousText = 'Fetching...'
    const btn = document.getElementById('auto-fill-btn')
    if (btn) {
        btn.textContent = previousText
        btn.disabled = true
        btn.innerHTML = `<span class="animate-spin inline-block mr-1">💫</span> Fetching...`
    }

    try {
      const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`)
      const result = await response.json()
      
      if (result.status === 'success') {
        const { title, description, image, url: finalUrl } = result.data
        
        setFormData(prev => ({
          ...prev,
          title: title || prev.title,
          description: description || prev.description,
          image_url: image?.url || prev.image_url,
          // Generate slug if empty
          slug: prev.slug || generateSlug()
        }))
      } else {
        alert('Could not fetch metadata. Please fill manually.')
      }
    } catch (error) {
       console.error(error)
       alert('Error fetching metadata.')
    } finally {
        if (btn) {
            btn.innerHTML = '✨ Auto Fill'
            btn.disabled = false
        }
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button 
          onClick={() => { resetForm(); setIsFormOpen(true) }}
          className="btn btn-primary"
        >
          <Plus size={20} className="mr-2" />
          Create New Link
        </button>
      </div>

      {/* Form Modal/Overlay - Kept inline for simplicity */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl my-8">
            <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Link' : 'Create New Link'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="label">Target URL (Original Link)</label>
                <div className="flex gap-2">
                    <input 
                      className="input mb-0" 
                      value={formData.target_url} 
                      onChange={e => setFormData({...formData, target_url: e.target.value})} 
                      placeholder="https://shopee.vn/product..."
                    />
                    <button 
                        type="button" 
                        id="auto-fill-btn"
                        onClick={fetchMetadata}
                        className="btn btn-outline whitespace-nowrap"
                        title="Auto-fill Title, Desc & Image from URL"
                    >
                        ✨ Auto Fill
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Enter URL and click Auto Fill to get data automatically.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Title</label>
                  <input 
                    className="input" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    placeholder="Awesome Product"
                  />
                </div>
                <div>
                  <label className="label">Custom Slug (Optional)</label>
                  <input 
                    className="input" 
                    value={formData.slug} 
                    onChange={e => setFormData({...formData, slug: e.target.value})} 
                    placeholder="Auto-generated if empty"
                  />
                </div>
              </div>

              <div>
                <label className="label">Affiliate URL (Your Link)</label>
                <input 
                  className="input" 
                  value={formData.affiliate_url} 
                  onChange={e => setFormData({...formData, affiliate_url: e.target.value})} 
                  placeholder="https://accesstrade.vn/..."
                />
              </div>

              <div>
                <label className="label">Description (Optional)</label>
                <textarea 
                  className="input min-h-[80px]" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="Short description..."
                />
              </div>

              <div>
                <label className="label">Image URL (Optional)</label>
                <input 
                  className="input" 
                  value={formData.image_url} 
                  onChange={e => setFormData({...formData, image_url: e.target.value})} 
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={resetForm} className="btn btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn btn-primary flex-1">Save Link</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Preview</th>
              <th className="p-4 font-semibold text-gray-600">Info</th>
              <th className="p-4 font-semibold text-gray-600">Clicks</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading...</td></tr>
            ) : links.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">No links created yet.</td></tr>
            ) : (
                links.map(link => (
                    <tr key={link.id} className="hover:bg-gray-50 group transition-colors">
                        <td className="p-4 w-24">
                            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden relative">
                                {link.image_url ? (
                                    <img src={link.image_url} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">No Img</span>
                                )}
                            </div>
                        </td>
                        <td className="p-4 max-w-xs">
                            <div className="font-bold text-gray-900 truncate" title={link.title}>{link.title || 'Untitled'}</div>
                            <div className="text-xs text-gray-400 mt-1 truncate" title={link.target_url}>{link.target_url}</div>
                            <div className="text-xs flex items-center gap-1 text-[#ff6b35] mt-1 cursor-pointer hover:underline" onClick={() => copyToClipboard(link.slug)}>
                                <ExternalLink size={10} />
                                {link.slug}
                            </div>
                        </td>
                        <td className="p-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {link.click_count || 0}
                            </span>
                        </td>
                        <td className="p-4">
                             <button 
                                onClick={() => handleToggle(link)}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${link.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                             >
                                <Power size={12} />
                                {link.is_active ? 'Active' : 'Inactive'}
                             </button>
                        </td>
                        <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <button onClick={() => window.open(`/p/${link.slug}`, '_blank')} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full" title="Preview">
                                    <Eye size={18} />
                                </button>
                                <button onClick={() => copyToClipboard(link.slug)} className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-full" title="Copy Link">
                                    <Copy size={18} />
                                </button>
                                <button onClick={() => handleEdit(link)} className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-full" title="Edit">
                                    <Edit size={18} />
                                </button>
                                <button onClick={() => handleDelete(link.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
