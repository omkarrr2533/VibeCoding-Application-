
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
import decimal, os, requests
from io import BytesIO
from PIL import Image

User=get_user_model()

class Command(BaseCommand):
    help="Seed Om's Jewellers development data"

    def handle(self, *args, **options):
        self.stdout.write("Seeding...")
        from apps.catalog.models import Category, Collection, Product, ProductImage, ProductVariant
        from apps.content.models import Announcement, HomepageSection, SiteSettings, Testimonial
        from apps.coupons.models import Coupon

        # Site settings
        SiteSettings.objects.get_or_create(id=1, defaults={
            'site_name': "Om's Jewellers",
            'tagline': "Where Timeless Elegance Meets Modern Luxury",
            'address': "MG Road, Pune, Maharashtra 411001, India",
            'phone': "+91 98220 12345",
            'email': "hello@omsjewellers.example.com",
            'business_hours': "10:00 AM - 8:30 PM (Mon-Sun)",
            'footer_description': "Om's Jewellers is a contemporary Indian luxury jewellery brand celebrating heritage craftsmanship with modern design. Each piece is crafted to honour your most meaningful moments."
        })

        # Announcements
        Announcement.objects.get_or_create(text="Complimentary shipping on eligible orders", defaults={'is_active':True, 'sort_order':1})
        Announcement.objects.get_or_create(text="Discover our latest Bridal Collection", defaults={'is_active':True, 'sort_order':2})
        Announcement.objects.get_or_create(text="Book a personalized jewellery consultation", defaults={'is_active':True, 'sort_order':3})

        # Homepage sections
        HomepageSection.objects.get_or_create(section_type='hero', defaults={
            'title': "Where Timeless Elegance Meets Modern Luxury",
            'subtitle': "Discover jewellery crafted to celebrate your most meaningful moments.",
            'cta_text': "Explore the Collection",
            'cta_link': "/shop",
            'is_active': True,
            'sort_order': 1
        })

        # Categories
        cat_data=[
            ("Gold Jewellery","gold-jewellery","Exquisite 22KT & 18KT gold creations"),
            ("Diamond Jewellery","diamond-jewellery","Ethereal diamonds, certified brilliance"),
            ("Bridal Collection","bridal","Heirloom-worthy bridal sets"),
            ("Earrings","earrings","From jhumkas to modern studs"),
            ("Necklaces","necklaces","Statement necklaces & delicate chains"),
            ("Rings","rings","Solitaire, bands & cocktail rings"),
            ("Bangles & Bracelets","bangles-bracelets","Kadas, bangles & cuffs"),
            ("Men's Jewellery","mens-jewellery","Contemporary pieces for him"),
        ]
        for name, slug, desc in cat_data:
            Category.objects.get_or_create(slug=slug, defaults={'name':name,'description':desc,'is_active':True})

        # Collections
        coll_data=[
            ("Heritage Bridal","heritage-bridal","Bridal heirlooms reimagined for the modern muse.", True),
            ("Celestial Diamonds","celestial-diamonds","Star-like diamonds set in luminous gold.", True),
            ("Everyday Elegance","everyday-elegance","Minimal pieces for daily grace.", True),
            ("Temple Revival","temple-revival","Inspired by South Indian temple artistry.", False),
            ("Noor","noor","Mughal-inspired emerald & polki creations.", False),
        ]
        for title, slug, desc, feat in coll_data:
            Collection.objects.get_or_create(slug=slug, defaults={'title':title,'description':desc,'short_description':desc[:120],'is_featured':feat,'is_active':True})

        # Coupon
        Coupon.objects.get_or_create(code="WELCOME10", defaults={'description':"10% off first order","discount_type":"percent","discount_value":10,"min_order_value":5000,"max_discount":2000,"is_active":True})
        Coupon.objects.get_or_create(code="FESTIVE500", defaults={'description':"Flat Rs. 500 off",'discount_type':"flat",'discount_value':500,'min_order_value':10000,'is_active':True})

        # Testimonials
        demo_testimonials=[
            ("Aaradhya Mehta","Bride, Mumbai","My bridal set from Om's is everything I dreamed of — heirloom quality with modern finesse. The craftsmanship is simply exquisite.",5, True),
            ("Priya & Rohan Sharma","Anniversary Gift","We celebrated our 10th anniversary with the Celestial diamond necklace. Timeless elegance. Packing and care note were premium.",5, True),
            ("Neha Kulkarni","Pune","Transparent pricing, certified stones, and the most gracious service. I trust Om's for every milestone.",5, False),
            ("Arjun Desai","Mumbai","Men's collection is understated and powerful. The platinum kada is now my daily signature.",5, False),
        ]
        for name, role, comment, rating, feat in demo_testimonials:
            Testimonial.objects.get_or_create(name=name, comment=comment, defaults={'role':role,'rating':rating,'is_featured':feat,'is_approved':True})

        # Products
        from apps.catalog.models import Category as Cat, Collection as Coll
        prod_data=[
            {"name":"Maharani Temple Choker","sku":"OM-GLD-001","slug":"maharani-temple-choker","price":185000,"original_price":210000,"category":"gold-jewellery","collection":"temple-revival","material":"Gold","purity":"22KT","weight_grams":28.5,"stock":5,"is_featured":True,"desc":"Handcrafted 22KT temple choker featuring Lakshmi motifs, ruby highlights and antique finish."},
            {"name":"Celestial Solitaire Ring","sku":"OM-DIA-002","slug":"celestial-solitaire-ring","price":245000,"original_price":285000,"category":"rings","collection":"celestial-diamonds","material":"Gold & Diamond","purity":"18KT","weight_grams":7.2,"stock":8,"is_featured":True,"desc":"0.90ct certified solitaire set in 18KT white gold with pavé shoulders. A promise in brilliance."},
            {"name":"Noor Emerald Jhumkas","sku":"OM-GEM-003","slug":"noor-emerald-jhumkas","price":89000,"original_price":105000,"category":"earrings","collection":"noor","material":"Gold & Diamond","purity":"18KT","weight_grams":12.0,"stock":12,"is_featured":True,"desc":"Mughal-inspired jhumkas with Zambian emeralds, polki and rose-cut diamonds."},
            {"name":"Ivory Pearl & Gold Chain","sku":"OM-GLD-004","slug":"ivory-pearl-gold-chain","price":52000,"category":"necklaces","collection":"everyday-elegance","material":"Gold","purity":"18KT","weight_grams":9.8,"stock":15,"is_featured":True,"desc":"Freshwater pearls interlaced with 18KT gold chain — everyday elegance."},
            {"name":"Heritage Bridal Necklace Set","sku":"OM-BRD-005","slug":"heritage-bridal-necklace-set","price":485000,"original_price":550000,"category":"bridal","collection":"heritage-bridal","material":"Gold & Diamond","purity":"22KT","weight_grams":62.0,"stock":3,"is_featured":True,"desc":"Complete bridal set: necklace, earrings, maang tikka. Heirloom-worthy craftsmanship."},
            {"name":"Diamond Tennis Bracelet","sku":"OM-DIA-006","slug":"diamond-tennis-bracelet","price":165000,"category":"bangles-bracelets","collection":"celestial-diamonds","material":"Diamond","purity":"18KT","weight_grams":11.5,"stock":7,"is_featured":True,"desc":"1.2ct diamonds in a flexible tennis setting — scintillating on every wrist."},
            {"name":"Men's Platinum Kada","sku":"OM-MEN-007","slug":"mens-platinum-kada","price":74000,"category":"mens-jewellery","collection":"everyday-elegance","material":"Platinum","purity":"Platinum","weight_grams":22.0,"stock":10,"is_featured":False,"desc":"Brushed platinum kada with subtle engraving. Modern masculinity, refined."},
            {"name":"Rose Gold Band Eternity","sku":"OM-RNG-008","slug":"rose-gold-eternity-band","price":62000,"category":"rings","collection":"everyday-elegance","material":"Gold","purity":"18KT","weight_grams":4.5,"stock":20,"is_featured":False,"desc":"Eternity band in 18KT rose gold with channel-set diamonds."},
            {"name":"Antique Gold Bangles (Pair)","sku":"OM-BNG-009","slug":"antique-gold-bangles-pair","price":128000,"category":"bangles-bracelets","collection":"temple-revival","material":"Gold","purity":"22KT","weight_grams":32.0,"stock":6,"is_featured":False,"desc":"Pair of hand-engraved 22KT bangles with antique patina."},
            {"name":"Polki Diamond Choker","sku":"OM-DIA-010","slug":"polki-diamond-choker","price":195000,"original_price":225000,"category":"necklaces","collection":"noor","material":"Gold & Diamond","purity":"18KT","weight_grams":24.0,"stock":4,"is_featured":True,"desc":"Uncut polki diamonds in 18KT gold — regal, luminous, unforgettable."},
            {"name":"Starlight Earring Studs","sku":"OM-DIA-011","slug":"starlight-earring-studs","price":48000,"category":"earrings","collection":"celestial-diamonds","material":"Diamond","purity":"18KT","weight_grams":3.2,"stock":18,"is_featured":False,"desc":"0.50ct diamond studs in 18KT gold — everyday sparkle."},
            {"name":"Bridal Matha Patti","sku":"OM-BRD-012","slug":"bridal-matha-patti","price":67000,"category":"bridal","collection":"heritage-bridal","material":"Gold & Diamond","purity":"22KT","weight_grams":14.0,"stock":8,"is_featured":False,"desc":"Exquisite maang tikka with kundan and pearls for the modern bride."},
        ]

        # helper to create placeholder image if no real image
        def ensure_image(product):
            if product.images.exists():
                return
            # create a simple placeholder using PIL so admin shows something
            img = Image.new('RGB', (800,800), color=(248,243,234))
            # optionally draw text not needed
            buf=BytesIO()
            img.save(buf, format='JPEG')
            buf.seek(0)
            pi=ProductImage(product=product, alt_text=product.name, is_primary=True, sort_order=0)
            pi.image.save(f"{product.slug}.jpg", ContentFile(buf.read()), save=True)

        for pd in prod_data:
            cat=Cat.objects.filter(slug=pd['category']).first()
            coll=Coll.objects.filter(slug=pd['collection']).first()
            prod, created = Product.objects.get_or_create(slug=pd['slug'], defaults={
                'name':pd['name'],
                'sku':pd['sku'],
                'description':pd['desc'],
                'short_description':pd['desc'][:150],
                'category':cat,
                'collection':coll,
                'material':pd['material'],
                'purity':pd['purity'],
                'weight_grams':pd['weight_grams'],
                'price':pd['price'],
                'original_price':pd.get('original_price'),
                'stock':pd['stock'],
                'is_featured':pd['is_featured'],
                'is_active':True,
                'care_instructions':"Store in provided pouch, avoid chemicals, clean with soft cloth.",
                'specifications':{"Weight": f"{pd['weight_grams']}g", "Purity": pd['purity'], "Material": pd['material']},
            })
            ensure_image(prod)
            # variant example for rings
            if pd['category']=='rings' and not prod.variants.exists():
                for size in ["5","6","7","8"]:
                    ProductVariant.objects.get_or_create(product=prod, name=f"Size {size}", defaults={'sku':f"{prod.sku}-S{size}",'stock':5,'attributes':{'size':size}})
            if pd['slug']=='maharani-temple-choker' and not prod.variants.exists():
                ProductVariant.objects.get_or_create(product=prod, name="Antique Gold", defaults={'sku':f"{prod.sku}-AG",'stock':3})
                ProductVariant.objects.get_or_create(product=prod, name="Temple Matte", defaults={'sku':f"{prod.sku}-TM",'stock':2})

        # create demo user
        if not User.objects.filter(username='demo').exists():
            u=User.objects.create_user(username='demo', email='demo@omsjewellers.example.com', password='demo12345', first_name='Demo', last_name='Customer')
            self.stdout.write(f"Demo user created: demo / demo12345")

        self.stdout.write(self.style.SUCCESS("Seed complete!"))
