import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getAds, getCategories, createAd, createComment, toggleFavorite } from "../lib/api"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

export default function AdDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [ad, setAd] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [comment, setComment] = useState("")

  useEffect(() => {
    if (id === "new") return
    fetch(`http://localhost:3000/api/ads`)
      .then(r => r.json())
      .then(ads => {
        setAd(ads.find((a: any) => a.id === Number(id)))
      })
    fetch(`http://localhost:3000/api/comments/${id}`).then(r => r.json()).then(setComments)
  }, [id])

  async function handleComment() {
    if (!comment || !token) return
    await createComment(comment, Number(id), token)
    setComment("")
    fetch(`http://localhost:3000/api/comments/${id}`).then(r => r.json()).then(setComments)
  }

  async function handleFavorite() {
    if (!token) return navigate("/login")
    await toggleFavorite(Number(id), token)
  }

  if (id === "new") return <NewAd />

  if (!ad) {
    return (
      <div className="w-full min-h-screen bg-gray-800 flex items-center justify-center text-white">
        <div className="animate-pulse text-lg">Krauna</div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gray-800 py-8 px-4 text-gray-100">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")} 
            className="text-white hover:bg-gray-700 rounded-full px-4"
          >
            Atgal
          </Button>
        </div>

        <Card className="bg-white border-none shadow-xl overflow-hidden rounded-2xl">
          {ad.image && (
            <div className="w-full h-96 relative bg-gray-100">
              <img src={ad.image} className="w-full h-full object-cover" />
            </div>
          )}
          <CardContent className="p-6 space-y-4 text-gray-900">
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{ad.title}</h1>
              <p className="text-2xl font-black text-gray-900 whitespace-nowrap bg-gray-100 px-4 py-1 rounded-xl">
                {ad.price} €
              </p>
            </div>
            
            <hr className="border-gray-100" />
            
            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
              {ad.description}
            </p>
            
            <div className="flex items-center justify-between pt-2 text-sm text-gray-400 border-t border-gray-50">
              <span>Skelbimo autorius: <strong className="text-gray-700">@{ad.username}</strong></span>
              {ad.category_name && (
                <span className="bg-yellow-100 text-yellow-800 font-medium px-3 py-1 rounded-full text-xs">
                  {ad.category_name}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="bg-white p-6 rounded-2xl shadow-xl text-gray-900 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Komentarai <span className="text-sm font-normal text-gray-400">({comments.length})</span>
          </h2>
          
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {comments.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">Komentaru nera.</p>
            ) : (
              comments.map((c: any) => (
                <div key={c.id} className="bg-gray-50 border border-gray-150 rounded-xl p-3 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-700">@{c.username}</span>
                  </div>
                  <p className="text-sm text-gray-600">{c.content}</p>
                </div>
              ))
            )}
          </div>

          {token ? (
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <Input 
                placeholder="Parasykite komentara..." 
                value={comment} 
                onChange={e => setComment(e.target.value)} 
                className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 rounded-xl"
              />
              <Button onClick={handleComment} className="bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl px-5">
                Siusti
              </Button>
            </div>
          ) : (
            <p className="text-xs text-gray-400 text-center pt-2 border-t border-gray-150">
              Noredami komentuoti, turite prisijungti.
            </p>
          )}
        </div>

      </div>
    </div>
  )
}

function NewAd() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category_id, setCategoryId] = useState("")
  const [image, setImage] = useState("")

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  async function handleCreate() {
    if (!token) return navigate("/login")
    await createAd({ title, description, price: Number(price), category_id: Number(category_id), image }, token)
    navigate("/")
  }

  return (
    <div className="w-full min-h-screen bg-gray-800 py-8 px-4 text-gray-100">
      <div className="max-w-xl mx-auto space-y-4">
        
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")} 
          className="text-white hover:bg-gray-700 rounded-full"
        >
          Atgal
        </Button>

        <Card className="bg-white border-none shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-gray-50 border-b border-gray-100 p-5">
            <CardTitle className="text-xl font-bold text-gray-900">Naujas skelbimas</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col gap-4 text-gray-900">
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pavadinimas</label>
              <Input placeholder="Pvz:Hata" value={title} onChange={e => setTitle(e.target.value)} className="border-gray-200 focus:border-yellow-400" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Aprasymas</label>
              <Textarea placeholder="Papasakok ka parduodi" value={description} onChange={e => setDescription(e.target.value)} className="border-gray-200 focus:border-yellow-400 min-h-24 resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Kaina (€)</label>
                <Input placeholder="0" type="number" value={price} onChange={e => setPrice(e.target.value)} className="border-gray-200 focus:border-yellow-400" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategorija</label>
                <select 
                  className="w-full h-10 border border-gray-200 rounded-md bg-white px-3 py-1 text-sm text-gray-900 shadow-sm focus:border-yellow-400 focus:outline-none" 
                  value={category_id} 
                  onChange={e => setCategoryId(e.target.value)}
                >
                  <option value="">Pasirinkite...</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nuotraukos URL</label>
              <Input placeholder="https://epolicija.lt/bauda.jpg" value={image} onChange={e => setImage(e.target.value)} className="border-gray-200 focus:border-yellow-400" />
            </div>

            <Button onClick={handleCreate} className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-bold py-3 mt-2 text-base rounded-xl transition-all shadow-md shadow-yellow-400/10">
              Ideti skelbima
            </Button>
            
          </CardContent>
        </Card>
      </div>
    </div>
  )
}