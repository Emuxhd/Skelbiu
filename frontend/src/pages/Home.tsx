import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAds, getCategories } from "../lib/api"
import { useAuth } from "../context/AuthContext"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

export default function Home() {
  const [ads, setAds] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const { token, role, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  useEffect(() => {
    getAds(category, search).then(setAds)
  }, [category, search])

  useEffect(() => {
    if (token) {
      fetch("http://localhost:3000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(ids => {
          if (Array.isArray(ids)) setFavoriteIds(ids)
        })
        .catch(console.error)
    } else {
      setFavoriteIds([])
    }
  }, [token])

  return (
    <div className="w-full min-h-screen bg-gray-800 py-6 px-4">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-md">
        
        <div className="flex justify-between items-center mb-6 p-4 bg-yellow-400 rounded-lg">
          <div>
            <h1 className="text-2xl font-bold text-gray-950">Skelbiu.lt</h1>
            <p className="text-xs text-gray-800">Naudotu prekiu pardavimas</p>
          </div>
          <div className="flex gap-2">
            {token ? (
              <>
                {role === "admin" && (
                  <Button variant="secondary" onClick={() => navigate("/admin")} className="bg-white text-gray-900 rounded-full px-5 hover:bg-gray-100 transition-colors">
                    Adminas
                  </Button>
                )}
                <Button variant="outline" onClick={logout} className="bg-transparent border-gray-950 text-gray-950 rounded-full px-5 hover:bg-gray-950 hover:text-white transition-all">
                  Atsijungti
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate("/login")} className="bg-gray-900 text-white rounded-full px-6 hover:bg-black transition-colors shadow-sm">
                Prisijungti
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <Input 
            placeholder="Ieskoti skelbimu" 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border-gray-300 bg-white focus:border-yellow-400 focus:ring-yellow-400 rounded-md"
          />
          
          <select 
            className="h-10 border border-gray-300 rounded-md px-3 text-sm bg-white cursor-pointer focus:border-yellow-400 focus:outline-none" 
            value={category} 
            onChange={e => setCategory(e.target.value)}
          >
            <option value="">Visos kategorijos</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          
          {token && (
            <Button onClick={() => navigate("/skelbimai/new")} className="bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-semibold rounded-md px-5 shadow-sm border border-yellow-500/20 transition-colors">
              + Ideti skelbima
            </Button>
          )}
        </div>

        {ads.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">Skelbimu nerasta.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ads.map((ad: any) => {
              const isFavorite = favoriteIds.includes(ad.id)

              return (
                <Card 
                  key={ad.id} 
                  className="bg-white border border-gray-200 hover:border-yellow-400 cursor-pointer flex flex-col justify-between transition-colors rounded-lg overflow-hidden relative"
                  onClick={() => navigate(`/skelbimai/${ad.id}`)}
                >
                  {isFavorite && (
                    <div className="absolute top-3 right-3 z-10 bg-yellow-100 text-yellow-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg shadow-md border border-yellow-200">
                      ★
                    </div>
                  )}

                  <div>
                    <div className="bg-gray-100 aspect-video w-full overflow-hidden">
                      {ad.image ? (
                        <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          Nera nuotraukos
                        </div>
                      )}
                    </div>

                    <CardHeader className="p-3">
                      <CardTitle className="text-base font-semibold text-gray-900 line-clamp-1">
                        {ad.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-3 pt-0">
                      <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                        {ad.description || "Nera aprasymo..."}
                      </p>
                    </CardContent>
                  </div>

                  <div className="p-3 pt-0 mt-auto border-t border-gray-100">
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-base font-bold text-gray-900">{ad.price} €</span>
                      <Badge className="bg-yellow-100 text-yellow-950 hover:bg-yellow-100 font-normal rounded-full px-2.5">
                        {ad.category_name}
                      </Badge>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-2">
                      Ikele: <span className="text-gray-600">@{ad.username}</span>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}