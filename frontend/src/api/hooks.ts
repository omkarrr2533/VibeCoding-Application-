import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './client'

export const useProducts = (params?: Record<string,any>)=> useQuery({
  queryKey:['products', params],
  queryFn: async ()=> (await api.get('/products/',{params})).data
})
export const useFeatured = ()=> useQuery({ queryKey:['featured'], queryFn: async()=>(await api.get('/products/featured/')).data })
export const useProduct = (slug:string|null)=> useQuery({ queryKey:['product',slug], queryFn: async()=>(await api.get(`/products/${slug}/`)).data, enabled: !!slug })
export const useCollections = ()=> useQuery({ queryKey:['collections'], queryFn: async()=>(await api.get('/collections/')).data })
export const useCategories = ()=> useQuery({ queryKey:['categories'], queryFn: async()=>(await api.get('/categories/')).data })
export const useSearch = (q:string)=> useQuery({ queryKey:['search',q], queryFn: async()=>(await api.get('/search/',{params:{q}})).data, enabled: q.length>1 })
export const useCart = ()=> useQuery({ queryKey:['cart'], queryFn: async()=>(await api.get('/cart/')).data })
export const useAddToCart = ()=>{
  const qc=useQueryClient()
  return useMutation({ mutationFn: async(payload:any)=>(await api.post('/cart/items/',payload)).data, onSuccess: ()=>qc.invalidateQueries({queryKey:['cart']}) })
}
export const useUpdateCart = ()=>{
  const qc=useQueryClient()
  return useMutation({ mutationFn: async({id,quantity}:{id:number,quantity:number})=>(await api.patch(`/cart/items/${id}/`,{quantity})).data, onSuccess: ()=>qc.invalidateQueries({queryKey:['cart']}) })
}
export const useRemoveCart = ()=>{
  const qc=useQueryClient()
  return useMutation({ mutationFn: async(id:number)=>(await api.delete(`/cart/items/${id}/`)).data, onSuccess: ()=>qc.invalidateQueries({queryKey:['cart']}) })
}
export const useWishlist = ()=> useQuery({ queryKey:['wishlist'], queryFn: async()=>(await api.get('/wishlist/')).data })
export const useAnnouncements = ()=> useQuery({ queryKey:['announcements'], queryFn: async()=>(await api.get('/announcements/')).data })
export const useSiteSettings = ()=> useQuery({ queryKey:['site-settings'], queryFn: async()=>(await api.get('/site-settings/')).data })
export const useTestimonials = ()=> useQuery({ queryKey:['testimonials'], queryFn: async()=>(await api.get('/testimonials/')).data })
export const useHomepage = ()=> useQuery({ queryKey:['homepage'], queryFn: async()=>(await api.get('/homepage/')).data })
