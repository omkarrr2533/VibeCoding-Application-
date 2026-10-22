export type Product = {
  id: number
  name: string
  slug: string
  sku: string
  price: string
  original_price?: string|null
  material: string
  purity: string
  category: number
  category_name?: string
  is_featured: boolean
  stock: number
  discount_percent: number
  in_stock: boolean
  images: {id:number,image:string,alt_text:string,is_primary:boolean,sort_order:number}[]
  variants?: any[]
  description?: string
  short_description?: string
  weight_grams?: string
  dimensions?: string
  care_instructions?: string
  specifications?: any
}
export type Collection = { id:number,title:string,slug:string,description:string,short_description:string,image:string|null,is_featured:boolean,is_active:boolean }
export type Category = { id:number,name:string,slug:string,description:string,image:string|null }
export type CartItem = { id:number, product:number, variant:any, product_name:string, product_slug:string, product_image:string|null, variant_name?:string, quantity:number, unit_price:string, line_total:string }
export type Cart = { id:number, items:CartItem[], subtotal:string|number, total_items:number }
