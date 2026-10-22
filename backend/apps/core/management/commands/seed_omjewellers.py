from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
import decimal
from io import BytesIO
from PIL import Image
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
import random

User=get_user_model()

class Command(BaseCommand):
    help="Seed Om's Jewellers extensive development dataset — production-ready demo"

    def handle(self, *args, **options):
        self.stdout.write("Seeding Om's Jewellers — extensive dataset...")
        from apps.catalog.models import Category, Collection, Product, ProductImage, ProductVariant
        from apps.content.models import Announcement, HomepageSection, SiteSettings, Testimonial
        from apps.coupons.models import Coupon
        from apps.reviews.models import Review
        from apps.orders.models import Order, OrderItem
        from apps.newsletter.models import NewsletterSubscription

        # Clean old demo if needed (keep idempotent)
        # Site settings — comprehensive
        site_defaults = {
            'site_name': "Om's Jewellers",
            'tagline': "Where Timeless Elegance Meets Modern Luxury — Pune's Heritage Atelier Since 1998",
            'address': "Om's Jewellers, Laxmi Road, Pune, Maharashtra 411030, India • Showroom: MG Road, Pune 411001 • Atelier: Koregaon Park",
            'phone': "+91 98220 12345 / +91 20 2420 3030",
            'email': "hello@omsjewellers.example.com",
            'business_hours': "10:00 AM - 8:30 PM (Mon-Sun) • Private appointments available",
            'social_instagram': "https://instagram.com/omsjewellers",
            'social_facebook': "https://facebook.com/omsjewellers",
            'social_pinterest': "https://pinterest.com/omsjewellers",
            'footer_description': "Om's Jewellers is Pune's contemporary heritage atelier — 25+ years of trust, BIS-hallmarked gold, IGI/GIA certified diamonds, and handcraftsmanship by master karigars. Every piece is crafted to honour your most meaningful moments — from temple heirlooms to modern minimalism. Visit our Laxmi Road showroom or book a private bridal consultation."
        }
        site, _ = SiteSettings.objects.get_or_create(id=1, defaults=site_defaults)
        for k,v in site_defaults.items():
            setattr(site, k, v)
        site.save()

        # Announcements — 5 rotating
        anns = [
            ("Complimentary insured shipping on orders above ₹5,000 — pan-India", 1),
            ("New: Celestial Diamonds — IGI certified solitaires, now live", 2),
            ("Book your private bridal consultation — Laxmi Road & Koregaon Park atelier", 3),
            ("Exchange old gold at best market rates — BIS hallmark verified", 4),
            ("Festive Edit: Heritage Bridal sets with complimentary care kit", 5),
        ]
        for text, order in anns:
            Announcement.objects.get_or_create(text=text, defaults={'is_active': True, 'sort_order': order})

        # Homepage sections — rich
        sections = [
            ('hero', "Where Timeless Elegance Meets Modern Luxury", "Discover jewellery crafted to celebrate your most meaningful moments — heirloom bridal sets, celestial diamonds, and everyday icons, handcrafted in Pune since 1998.", "", "", "/shop", 1),
            ('collections', "Curated Collections", "Stories woven in gold, diamonds & temple heritage — from Mughal Polki to modern minimalism", "", "", "/collections", 2),
            ('featured', "Editor's Selection", "Our atelier's most-loved creations — BIS hallmarked, certified, and crafted to last generations", "", "", "/shop", 3),
            ('story', "Crafted with Meaning. Designed to Last.", "For over two decades, Om's Jewellers has honoured Pune's heritage — blending temple artistry, Mughal intricacy and contemporary precision. Each piece passes 12 quality checks.", "Authentic craftsmanship, transparent pricing, and personal service — from Laxmi Road to your milestone.", "Discover Our Story", "/about", 4),
            ('trust', "Why Om's Jewellers", "Transparent information • Secure Razorpay checkout • Insured shipping • Care guidance • Authenticity notes • Private consultations", "", "", "", 5),
            ('testimonials', "Hearts we have adorned", "Real stories from brides, anniversaries, and everyday milestones — IGI certified, BIS hallmarked, loved for generations", "", "", "", 6),
        ]
        for stype, title, subtitle, content, cta_text, cta_link, order in sections:
            obj, created = HomepageSection.objects.get_or_create(section_type=stype, defaults={
                'title': title, 'subtitle': subtitle, 'content': content,
                'cta_text': cta_text, 'cta_link': cta_link, 'is_active': True, 'sort_order': order
            })
            if not created:
                obj.title=title; obj.subtitle=subtitle; obj.content=content; obj.cta_text=cta_text; obj.cta_link=cta_link; obj.save()

        # Categories — 10 detailed
        cat_data = [
            ("Gold Jewellery", "gold-jewellery", "22KT & 18KT handcrafted gold — temple, antique, and modern minimal pieces, BIS hallmarked where applicable", 1),
            ("Diamond Jewellery", "diamond-jewellery", "IGI/GIA certified diamonds — solitaires, tennis bracelets, and celestial settings", 2),
            ("Bridal Collection", "bridal", "Heirloom bridal sets — necklace, choker, maang tikka, earrings, crafted for the modern muse", 3),
            ("Earrings", "earrings", "Jhumkas, chandbalis, studs, hoops — from Mughal Polki to everyday diamond", 4),
            ("Necklaces", "necklaces", "Chokers, layered chains, mangalsutras, and statement necklaces", 5),
            ("Rings", "rings", "Solitaire, eternity, cocktail, and temple rings — 5 to 9 sizes available", 6),
            ("Bangles & Bracelets", "bangles-bracelets", "Kadas, bangles, cuffs, and tennis bracelets — pairs and singles", 7),
            ("Men's Jewellery", "mens-jewellery", "Platinum kadas, gold chains, and contemporary cufflinks — modern masculinity, refined", 8),
            ("Silver & Gemstone", "silver-gemstone", "925 silver, Zambian emeralds, Burmese rubies, and uncut Polki", 9),
            ("Gifting", "gifting", "Anniversary, birthday, baby shower, and corporate gifting — curated edits with care kits", 10),
        ]
        for name, slug, desc, order in cat_data:
            Category.objects.get_or_create(slug=slug, defaults={'name': name, 'description': desc, 'is_active': True, 'sort_order': order})

        # Collections — 8 with rich storytelling
        coll_data = [
            ("Heritage Bridal", "heritage-bridal", "Bridal heirlooms reimagined for the modern muse — temple motifs, kundan, and pearls, crafted in 22KT antique finish for your heirloom moment.", "Heirloom bridal sets crafted for generations", True, 1),
            ("Celestial Diamonds", "celestial-diamonds", "Star-like diamonds set in luminous 18KT white gold — 0.50 to 2.00ct IGI certified solitaires with pavé shoulders.", "IGI certified diamonds, celestial brilliance", True, 2),
            ("Everyday Elegance", "everyday-elegance", "Minimal pieces for daily grace — pearl chains, diamond studs, and rose gold bands designed for modern life.", "Minimal luxury for everyday", True, 3),
            ("Temple Revival", "temple-revival", "Inspired by South Indian temple artistry — Lakshmi, peacock, and mango motifs in 22KT antique gold, hand-engraved by master karigars.", "Temple artistry, hand-engraved", True, 4),
            ("Noor", "noor", "Mughal-inspired emerald, Polki, and rose-cut diamonds — Zambian emeralds, uncut Polki, and enamel in 18KT gold.", "Mughal Polki & emerald edit", True, 5),
            ("Royale Men's Edit", "royale-mens", "Platinum kadas, brushed gold chains, and onyx cufflinks — contemporary heirlooms for him, from boardroom to wedding.", "Modern heirlooms for him", False, 6),
            ("Navratna & Gemstone", "navratna-gemstone", "Nine sacred gems — ruby, emerald, sapphire, pearl — set in 925 silver and 18KT gold, astrologically curated.", "Sacred nine gems, astrologically curated", False, 7),
            ("Festive Lights", "festive-lights", "Diwali, Gudi Padwa, and wedding season edits — lightweight gold, giftable diamond, and festive bundling.", "Festive gifting, lightweight gold", False, 8),
        ]
        for title, slug, desc, short, feat, order in coll_data:
            Collection.objects.get_or_create(slug=slug, defaults={'title': title, 'description': desc, 'short_description': short, 'is_featured': feat, 'is_active': True, 'sort_order': order})

        # Coupons — 6 comprehensive
        coupons = [
            ("WELCOME10", "10% off first order — welcome to Om's", "percent", 10, 5000, 2000, True, None, 100),
            ("FESTIVE500", "Flat Rs. 500 off — festive edit", "flat", 500, 10000, None, True, None, 200),
            ("BRIDAL15", "15% off bridal sets — heritage collection", "percent", 15, 50000, 5000, True, None, 50),
            ("DIAMOND2000", "Rs. 2000 off diamond jewellery", "flat", 2000, 75000, None, True, None, 30),
            ("SAVE750", "Flat Rs. 750 off on 30k+", "flat", 750, 30000, None, True, None, 100),
            ("WELCOME20", "20% off for newsletter subscribers", "percent", 20, 8000, 3000, True, None, 50),
        ]
        for code, desc, dtype, val, min_ord, max_disc, active, valid_until, limit in coupons:
            Coupon.objects.get_or_create(code=code, defaults={
                'description': desc, 'discount_type': dtype, 'discount_value': val,
                'min_order_value': min_ord, 'max_discount': max_disc, 'is_active': active,
                'usage_limit': limit, 'used_count': 0
            })

        # Testimonials — 12 realistic
        testimonials = [
            ("Aaradhya Mehta", "Bride, Mumbai", "My Heritage Bridal set from Om's is everything I dreamed of — heirloom quality with modern finesse. The craftsmanship is simply exquisite, and the care kit was thoughtful. 12/10 for service at Laxmi Road.", 5, True),
            ("Priya & Rohan Sharma", "10th Anniversary, Pune", "We celebrated with the Celestial diamond necklace. Timeless elegance, IGI certified, and the packaging felt like a gift itself. Complimentary shipping was seamless.", 5, True),
            ("Neha Kulkarni", "Regular Client, Pune", "Transparent pricing, BIS hallmark on gold, certified stones, and the most gracious service. I trust Om's for every milestone — from my baby shower jhumkas to my mother's 60th.", 5, True),
            ("Arjun Desai", "Mumbai", "Men's Platinum Kada is now my daily signature — brushed, engraved, and powerful. The Royale edit is understated luxury.", 5, True),
            ("Sneha Patel", "Bride, Nashik", "Polki Choker from Noor collection — uncut diamonds, 18KT gold, regal and luminous. My wedding photos are unforgettable because of Om's.", 5, False),
            ("Kavita Joshi", "Gifting, Nagpur", "Ordered Festive Lights bangles for Diwali gifting — lightweight, hallmarked, and delivered insured in 3 days. Perfect corporate gift.", 5, False),
            ("Ritika Singh", "Engagement, Delhi", "Celestial Solitaire Ring — 0.90ct IGI, 18KT white gold, pavé shoulders. He said yes, and the ring takes my breath away daily.", 5, True),
            ("Ananya Rao", "Everyday, Hyderabad", "Starlight Studs are my everyday sparkle — 0.50ct, comfortable, and I get compliments daily. Everyday Elegance lives up to its name.", 4, False),
            ("Meera Iyer", "Temple Revival Lover, Chennai", "Maharani Temple Choker — Lakshmi motifs, ruby highlights, antique finish. It's heirloom, not just jewellery. I feel connected to heritage.", 5, True),
            ("Vikram & Divya Shah", "Wedding, Ahmedabad", "Complete bridal set: necklace, maang tikka, earrings — Heritage Bridal is heirloom-worthy. We booked a private consultation at Koregaon Park; exceptional.", 5, True),
            ("Pooja Nair", "Silver Lover, Kochi", "Navratna bracelet — nine gems, 925 silver, astrologically curated. Beautiful and meaningful. Care guidance was detailed.", 4, False),
            ("Rahul Kapoor", "Gentleman, Pune", "Gold chain from Royale Men's — 22g, 22KT, perfect weight and finish. Exchange of old gold was transparent and fair.", 5, False),
        ]
        for name, role, comment, rating, feat in testimonials:
            Testimonial.objects.get_or_create(name=name, comment=comment, defaults={'role': role, 'rating': rating, 'is_featured': feat, 'is_approved': True})

        # Products — 32 comprehensive with rich metadata
        prod_data = [
            {"name":"Maharani Temple Choker","sku":"OM-GLD-001","slug":"maharani-temple-choker","price":185000,"original_price":210000,"category":"gold-jewellery","collection":"temple-revival","material":"Gold","purity":"22KT","weight_grams":28.5,"stock":5,"is_featured":True,"desc":"Handcrafted 22KT temple choker featuring Lakshmi motifs, ruby highlights, peacock engraving, and antique matte finish. BIS hallmarked. 3-part adjustable chain."},
            {"name":"Celestial Solitaire Ring","sku":"OM-DIA-002","slug":"celestial-solitaire-ring","price":245000,"original_price":285000,"category":"rings","collection":"celestial-diamonds","material":"Gold & Diamond","purity":"18KT","weight_grams":7.2,"stock":8,"is_featured":True,"desc":"0.90ct IGI certified solitaire (E/VS1, Excellent cut) set in 18KT white gold with pavé shoulders (0.20ct). A promise in brilliance — lifetime polishing included."},
            {"name":"Noor Emerald Jhumkas","sku":"OM-GEM-003","slug":"noor-emerald-jhumkas","price":89000,"original_price":105000,"category":"earrings","collection":"noor","material":"Gold & Diamond","purity":"18KT","weight_grams":12.0,"stock":12,"is_featured":True,"desc":"Mughal-inspired jhumkas with Zambian emeralds (2.5ct), uncut Polki (0.40ct), and rose-cut diamonds in 18KT gold. Enamel detailing."},
            {"name":"Ivory Pearl & Gold Chain","sku":"OM-GLD-004","slug":"ivory-pearl-gold-chain","price":52000,"category":"necklaces","collection":"everyday-elegance","material":"Gold","purity":"18KT","weight_grams":9.8,"stock":15,"is_featured":True,"desc":"Freshwater South Sea pearls (8-9mm) interlaced with 18KT yellow gold chain — 18 inches, lobster clasp. Everyday elegance for office to occasion."},
            {"name":"Heritage Bridal Necklace Set","sku":"OM-BRD-005","slug":"heritage-bridal-necklace-set","price":485000,"original_price":550000,"category":"bridal","collection":"heritage-bridal","material":"Gold & Diamond","purity":"22KT","weight_grams":62.0,"stock":3,"is_featured":True,"desc":"Complete bridal heirloom: 22KT antique gold necklace (45g), matching jhumkas (10g), maang tikka (7g). Kundan, pearls, and meenakari. Heirloom box included."},
            {"name":"Diamond Tennis Bracelet","sku":"OM-DIA-006","slug":"diamond-tennis-bracelet","price":165000,"category":"bangles-bracelets","collection":"celestial-diamonds","material":"Diamond","purity":"18KT","weight_grams":11.5,"stock":7,"is_featured":True,"desc":"1.2ct diamonds (F/G VS) in flexible 18KT white gold tennis setting — 7 inches, secure box clasp with figure-8 safety. Scintillating on every wrist."},
            {"name":"Men's Platinum Kada","sku":"OM-MEN-007","slug":"mens-platinum-kada","price":74000,"category":"mens-jewellery","collection":"royale-mens","material":"Platinum","purity":"Platinum","weight_grams":22.0,"stock":10,"is_featured":False,"desc":"950 Platinum kada, brushed matte + high-polish edges, subtle engraving (customizable). 65mm inner diameter. Modern masculinity, refined — lifetime replating."},
            {"name":"Rose Gold Eternity Band","sku":"OM-RNG-008","slug":"rose-gold-eternity-band","price":62000,"category":"rings","collection":"everyday-elegance","material":"Gold","purity":"18KT","weight_grams":4.5,"stock":20,"is_featured":False,"desc":"Eternity band in 18KT rose gold with channel-set diamonds (0.30ct, F/G VS). 3mm width. Stackable, comfortable court profile."},
            {"name":"Antique Gold Bangles (Pair)","sku":"OM-BNG-009","slug":"antique-gold-bangles-pair","price":128000,"category":"bangles-bracelets","collection":"temple-revival","material":"Gold","purity":"22KT","weight_grams":32.0,"stock":6,"is_featured":False,"desc":"Pair of hand-engraved 22KT bangles — peacock, mango, and temple border, antique patina, hollow with reinforced edges. BIS hallmarked. Size 2.4/2.6/2.8."},
            {"name":"Polki Diamond Choker","sku":"OM-DIA-010","slug":"polki-diamond-choker","price":195000,"original_price":225000,"category":"necklaces","collection":"noor","material":"Gold & Diamond","purity":"18KT","weight_grams":24.0,"stock":4,"is_featured":True,"desc":"Uncut Polki diamonds (2.1ct) in 18KT gold — three-layer choker with ruby drops, adjustable dori. Regal, luminous, unforgettable. Mughal artistry."},
            {"name":"Starlight Diamond Studs","sku":"OM-DIA-011","slug":"starlight-earring-studs","price":48000,"category":"earrings","collection":"celestial-diamonds","material":"Diamond","purity":"18KT","weight_grams":3.2,"stock":18,"is_featured":False,"desc":"0.50ct diamond studs (F/G VS, 4-prong martini) in 18KT white gold — screw-back, ideal for daily wear and kids' piercing. IGI certified."},
            {"name":"Bridal Matha Patti","sku":"OM-BRD-012","slug":"bridal-matha-patti","price":67000,"category":"bridal","collection":"heritage-bridal","material":"Gold & Diamond","purity":"22KT","weight_grams":14.0,"stock":8,"is_featured":False,"desc":"Exquisite maang tikka with Kundan centre, pearls, and temple side chains — 22KT antique gold, adjustable. For the modern bride who honours heritage."},
            # Additional 20 products
            {"name":"Temple Mango Mala","sku":"OM-GLD-013","slug":"temple-mango-mala","price":142000,"category":"necklaces","collection":"temple-revival","material":"Gold","purity":"22KT","weight_grams":35.0,"stock":4,"is_featured":False,"desc":"Long mango mala (24 inches) in 22KT matte gold — 21 mango motifs, kasina mala style, adjustable tassel. South Indian temple heirloom."},
            {"name":"Emerald Polki Rings (Set of 2)","sku":"OM-GEM-014","slug":"emerald-polki-rings-set","price":78000,"category":"rings","collection":"noor","material":"Gold & Diamond","purity":"18KT","weight_grams":6.8,"stock":9,"is_featured":False,"desc":"Stackable Polki rings — one with Zambian emerald centre (0.80ct), one with rose-cut band. 18KT gold, stack or wear solo."},
            {"name":"Classic Gold Mangalsutra","sku":"OM-GLD-015","slug":"classic-gold-mangalsutra","price":58000,"category":"necklaces","collection":"everyday-elegance","material":"Gold","purity":"22KT","weight_grams":12.5,"stock":12,"is_featured":True,"desc":"18-inch mangalsutra — 22KT gold thalli with black onyx beads, diamond side accents (0.10ct). Traditional + modern, daily wear to festive."},
            {"name":"Silver Navratna Bracelet","sku":"OM-SLV-016","slug":"silver-navratna-bracelet","price":24500,"category":"silver-gemstone","collection":"navratna-gemstone","material":"Gold","purity":"925 Silver","weight_grams":18.0,"stock":15,"is_featured":False,"desc":"Nine sacred gems — ruby, emerald, yellow/blue sapphire, pearl, coral, hessonite, cat's eye — set in 925 silver, adjustable. Astrologically curated, with gem report."},
            {"name":"Diamond Hoop Earrings","sku":"OM-DIA-017","slug":"diamond-hoop-earrings","price":67000,"category":"earrings","collection":"celestial-diamonds","material":"Diamond","purity":"18KT","weight_grams":7.0,"stock":10,"is_featured":False,"desc":"1-inch diamond hoops — 0.60ct diamonds (F/G VS) inside-out, 18KT white gold, hinged with click lock. Everyday to evening."},
            {"name":"Gold Chain for Him","sku":"OM-MEN-018","slug":"gold-chain-for-him","price":98000,"category":"mens-jewellery","collection":"royale-mens","material":"Gold","purity":"22KT","weight_grams":22.5,"stock":6,"is_featured":False,"desc":"22-inch curb chain in 22KT gold — 4mm width, solid, BIS hallmarked. Classic gentleman's heirloom, from boardroom to wedding."},
            {"name":"Pearl Chandbali Earrings","sku":"OM-GLD-019","slug":"pearl-chandbali-earrings","price":43000,"category":"earrings","collection":"heritage-bridal","material":"Gold","purity":"22KT","weight_grams":10.5,"stock":11,"is_featured":False,"desc":"Chandbali earrings — 22KT antique gold, South Sea pearl centre (9mm), kundan halo. Festive, bridal, heirloom."},
            {"name":"Minimal Diamond Necklace","sku":"OM-DIA-020","slug":"minimal-diamond-necklace","price":56000,"original_price":65000,"category":"necklaces","collection":"everyday-elegance","material":"Diamond","purity":"18KT","weight_grams":4.2,"stock":14,"is_featured":True,"desc":"Floating 0.30ct diamond pendant on 18KT white gold chain (18 inches) — minimal, elegant, giftable. IGI certified, perfect for gifting."},
            {"name":"Kundan Bridal Choker","sku":"OM-BRD-021","slug":"kundan-bridal-choker","price":210000,"category":"bridal","collection":"heritage-bridal","material":"Gold & Diamond","purity":"22KT","weight_grams":38.0,"stock":3,"is_featured":False,"desc":"Kundan bridal choker — 22KT gold base, uncut diamonds (3.2ct), pearls, and enamel. Four-layer, adjustable dori, with earrings."},
            {"name":"Men's Onyx Cufflinks","sku":"OM-MEN-022","slug":"mens-onyx-cufflinks","price":18500,"category":"mens-jewellery","collection":"royale-mens","material":"Gold","purity":"925 Silver","weight_grams":12.0,"stock":20,"is_featured":False,"desc":"925 silver cufflinks with black onyx centre, 18KT gold vermeil edges — engraved OM monogram. Gift-boxed, for the modern gentleman."},
            {"name":"Ruby Temple Rings","sku":"OM-GLD-023","slug":"ruby-temple-rings","price":54000,"category":"rings","collection":"temple-revival","material":"Gold","purity":"22KT","weight_grams":8.5,"stock":7,"is_featured":False,"desc":"22KT temple rings — Lakshmi face with ruby eyes, antique finish, adjustable. Pair of two, festive and auspicious."},
            {"name":"Festive Gift Hamper","sku":"OM-GFT-024","slug":"festive-gift-hamper","price":35000,"category":"gifting","collection":"festive-lights","material":"Silver","purity":"925 Silver","weight_grams":45.0,"stock":10,"is_featured":False,"desc":"Curated Diwali hamper — 925 silver diya pair, coin (10g), and care kit, gift-wrapped with handwritten note. Corporate gifting available."},
            {"name":"Emerald Cut Diamond Pendant","sku":"OM-DIA-025","slug":"emerald-cut-diamond-pendant","price":89000,"category":"necklaces","collection":"celestial-diamonds","material":"Diamond","purity":"18KT","weight_grams":5.5,"stock":6,"is_featured":False,"desc":"Emerald-cut diamond pendant (0.70ct, E/VVS2) on 18KT white gold chain — step-cut brilliance, four-prong basket. Timeless icon."},
            {"name":"Lightweight Gold Bangles","sku":"OM-GLD-026","slug":"lightweight-gold-bangles","price":72000,"category":"bangles-bracelets","collection":"festive-lights","material":"Gold","purity":"22KT","weight_grams":18.0,"stock":9,"is_featured":True,"desc":"Lightweight daily bangles (pair) — 22KT, 3.5mm width, hollow but durable, BIS hallmarked. Ideal for office wear, giftable."},
            {"name":"Polki Maang Tikka","sku":"OM-BRD-027","slug":"polki-maang-tikka","price":45000,"category":"bridal","collection":"noor","material":"Gold & Diamond","purity":"18KT","weight_grams":9.0,"stock":6,"is_featured":False,"desc":"Polki maang tikka — uncut diamond centre (1.2ct), pearl drops, 18KT gold, adjustable chain. Mughal bridal heirloom."},
            {"name":"Black Onyx Men's Bracelet","sku":"OM-MEN-028","slug":"black-onyx-mens-bracelet","price":22000,"category":"mens-jewellery","collection":"royale-mens","material":"Gold","purity":"925 Silver","weight_grams":16.0,"stock":12,"is_featured":False,"desc":"Black onyx beads (8mm) with 925 silver Om charm and 18KT gold vermeil accents — 8-inch, elastic, modern spiritual."},
            {"name":"Diamond Eternity Nose Pin","sku":"OM-DIA-029","slug":"diamond-eternity-nose-pin","price":18000,"category":"earrings","collection":"everyday-elegance","material":"Diamond","purity":"18KT","weight_grams":1.2,"stock":25,"is_featured":False,"desc":"Tiny diamond nose pin — 0.05ct (E/F VS), 18KT gold, screw type. Everyday sparkle, comfortable for daily wear."},
            {"name":"Goddess Lakshmi Pendant","sku":"OM-GLD-030","slug":"goddess-lakshmi-pendant","price":62000,"category":"necklaces","collection":"temple-revival","material":"Gold","purity":"22KT","weight_grams":14.5,"stock":5,"is_featured":False,"desc":"22KT Lakshmi pendant — antique finish, ruby eyes, temple border, with 18-inch chain. Auspicious for Diwali and weddings."},
            {"name":"Twist Gold Hoops","sku":"OM-GLD-031","slug":"twist-gold-hoops","price":38000,"category":"earrings","collection":"everyday-elegance","material":"Gold","purity":"18KT","weight_grams":6.0,"stock":13,"is_featured":False,"desc":"Twisted 18KT gold hoops — 30mm, lightweight, high-polish, hinged. Daily minimalism with heritage touch."},
            {"name":"Cocktail Gemstone Ring","sku":"OM-GEM-032","slug":"cocktail-gemstone-ring","price":115000,"original_price":135000,"category":"rings","collection":"navratna-gemstone","material":"Gemstone","purity":"18KT","weight_grams":9.5,"stock":4,"is_featured":True,"desc":"Oversized cocktail ring — Mozambique ruby (3.2ct) centre, diamonds (0.40ct) halo, 18KT gold, bold and royal. Cocktail edit."},
        ]

        def ensure_image(product):
            if product.images.exists():
                return
            img = Image.new('RGB', (900, 900), color=(248,243,234))
            buf=BytesIO()
            img.save(buf, format='JPEG')
            buf.seek(0)
            pi=ProductImage(product=product, alt_text=product.name, is_primary=True, sort_order=0)
            pi.image.save(f"{product.slug}.jpg", ContentFile(buf.read()), save=True)

        for pd in prod_data:
            cat=Category.objects.filter(slug=pd['category']).first()
            coll=Collection.objects.filter(slug=pd['collection']).first()
            prod, created = Product.objects.get_or_create(slug=pd['slug'], defaults={
                'name':pd['name'],
                'sku':pd['sku'],
                'description':pd['desc'],
                'short_description':pd['desc'][:160],
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
                'care_instructions':"Store in provided pouch, avoid chemicals/perfumes, clean with soft lint-free cloth. For diamonds: lukewarm soapy water + gentle brush. Have prongs checked annually. Avoid swimming/gym. Visit our Laxmi Road atelier for free annual polishing.",
                'specifications':{
                    "Weight": f"{pd['weight_grams']}g",
                    "Purity": pd['purity'],
                    "Material": pd['material'],
                    "Category": cat.name if cat else "",
                    "Collection": coll.title if coll else "",
                    "Hallmark": "BIS Hallmarked (Gold) / IGI Certified (Diamond) where applicable",
                    "Packaging": "Om's luxury box + care kit + authenticity note"
                },
                'meta_title': f"{pd['name']} | Om's Jewellers — {pd['material']} {pd['purity']}",
                'meta_description': pd['desc'][:160],
            })
            ensure_image(prod)
            # variants for rings/bangles
            if pd['category']=='rings' and not prod.variants.exists():
                for size in ["5","6","7","8","9"]:
                    ProductVariant.objects.get_or_create(product=prod, name=f"Size {size}", defaults={'sku':f"{prod.sku}-S{size}",'stock':random.randint(3,8),'attributes':{'size':size, 'width_mm': '2.5-3.5'}})
                # metal variants
                if "Solitaire" in pd['name'] or "Eternity" in pd['name']:
                    ProductVariant.objects.get_or_create(product=prod, name="Rose Gold", defaults={'sku':f"{prod.sku}-RG",'stock':4,'attributes':{'finish':'rose'}})
                    ProductVariant.objects.get_or_create(product=prod, name="Yellow Gold", defaults={'sku':f"{prod.sku}-YG",'stock':4,'attributes':{'finish':'yellow'}})
            if pd['category']=='bangles-bracelets' and not prod.variants.exists():
                for size in ["2.2","2.4","2.6","2.8"]:
                    ProductVariant.objects.get_or_create(product=prod, name=f"Size {size}", defaults={'sku':f"{prod.sku}-S{size.replace('.','')}",'stock':5,'attributes':{'bangle_size':size}})
            if pd['slug']=='maharani-temple-choker' and prod.variants.count()<3:
                ProductVariant.objects.get_or_create(product=prod, name="22KT Antique Gold", defaults={'sku':f"{prod.sku}-AG",'stock':3,'attributes':{'purity':'22KT'}})
                ProductVariant.objects.get_or_create(product=prod, name="22KT Temple Matte", defaults={'sku':f"{prod.sku}-TM",'stock':2,'attributes':{'purity':'22KT','finish':'matte'}})
                ProductVariant.objects.get_or_create(product=prod, name="18KT Polished", defaults={'sku':f"{prod.sku}-18P",'stock':2,'attributes':{'purity':'18KT'}})

        # Users — 3 demo personas + admin already exists
        demo_users = [
            ("demo", "demo@omsjewellers.example.com", "demo12345", "Demo", "Customer", "9876543210"),
            ("priya", "priya@example.com", "priya12345", "Priya", "Sharma", "9876543211"),
            ("arjun", "arjun@example.com", "arjun12345", "Arjun", "Desai", "9876543212"),
            ("manager", "manager@omsjewellers.example.com", "manager123", "Store", "Manager", "9822012345"),
        ]
        for uname, email, pwd, fn, ln, phone in demo_users:
            if not User.objects.filter(username=uname).exists():
                u=User.objects.create_user(username=uname, email=email, password=pwd, first_name=fn, last_name=ln, phone=phone)
                if uname=="manager":
                    u.is_staff=True; u.save()
                self.stdout.write(f"User created: {uname} / {pwd}")
            else:
                u=User.objects.get(username=uname)
                # ensure profile exists
                from apps.accounts.models import CustomerProfile
                CustomerProfile.objects.get_or_create(user=u)

        # Addresses for demo users
        from apps.accounts.models import Address
        for uname in ["demo","priya","arjun"]:
            try:
                u=User.objects.get(username=uname)
                if not Address.objects.filter(user=u).exists():
                    Address.objects.create(user=u, type='shipping', full_name=f"{u.first_name} {u.last_name}", phone=u.phone or "9876543210",
                        line1="123 Laxmi Road, Camp", line2="Near Pune Central", city="Pune", state="Maharashtra", postal_code="411001", country="India", is_default=True)
                    Address.objects.create(user=u, type='billing', full_name=f"{u.first_name} {u.last_name}", phone=u.phone or "9876543210",
                        line1="45 Koregaon Park, Lane 3", city="Pune", state="Maharashtra", postal_code="411001", country="India", is_default=False)
            except: pass

        # Reviews — populate for featured products
        from apps.catalog.models import Product as PModel
        review_texts = [
            (5, "Heirloom quality", "Exceeded expectations — BIS hallmark verified, weight accurate, packaging luxurious. Loved the care kit."),
            (5, "Stunning craftsmanship", "Hand-engraving is exquisite. You can feel the karigar's skill. Will cherish forever."),
            (4, "Beautiful & versatile", "Wear it daily and for weddings — comfortable, lightweight, and gets compliments every time."),
            (5, "Perfect gifting", "Gifted for anniversary — recipient loved it, gift wrap + note was premium. Will reorder."),
            (5, "Certified & transparent", "IGI certificate matched, diamonds verified, price transparent. Trust Om's completely."),
            (3, "Nice but sizing tricky", "Lovely design, but needed resizing. Support helped quickly — 5 stars for service!"),
        ]
        products_for_reviews = PModel.objects.filter(is_featured=True)[:8]
        for prod in products_for_reviews:
            for uname in ["demo","priya","arjun"]:
                try:
                    u=User.objects.get(username=uname)
                    rating, title, comment = random.choice(review_texts)
                    Review.objects.get_or_create(product=prod, user=u, defaults={
                        'rating': rating, 'title': title, 'comment': comment,
                        'is_approved': True, 'is_verified_purchase': random.choice([True, False])
                    })
                except: pass

        # Newsletter — seed
        for email in ["vip@omsjewellers.example.com", "press@omsjewellers.example.com", "priya@example.com"]:
            NewsletterSubscription.objects.get_or_create(email=email, defaults={'is_active': True, 'consent_given': True})

        # Sample orders for demo user (to test history & analytics)
        try:
            demo_u = User.objects.get(username="demo")
            if not Order.objects.filter(user=demo_u).exists():
                from apps.catalog.models import Product as ProdM
                p1 = ProdM.objects.filter(slug="celestial-solitaire-ring").first()
                p2 = ProdM.objects.filter(slug="starlight-earring-studs").first()
                if p1 and p2:
                    with transaction.atomic():
                        order=Order.objects.create(
                            user=demo_u, order_number="OM-DEMO-001", status="delivered", payment_status="paid",
                            subtotal= p1.price + p2.price, discount=0, tax=(p1.price + p2.price)*decimal.Decimal('0.03'), shipping=decimal.Decimal('0'),
                            total= (p1.price + p2.price)*decimal.Decimal('1.03'),
                            shipping_name="Demo Customer", shipping_phone="9876543210", shipping_email="demo@omsjewellers.example.com",
                            shipping_address="123 Laxmi Road, Pune 411001, Maharashtra, India — Landmark: Near Pune Central",
                            billing_address="45 Koregaon Park, Pune 411001", tracking_number="TRK-OMS-DEMO001"
                        )
                        OrderItem.objects.create(order=order, product=p1, product_name=p1.name, sku=p1.sku, quantity=1, unit_price=p1.price, line_total=p1.price)
                        OrderItem.objects.create(order=order, product=p2, product_name=p2.name, sku=p2.sku, quantity=1, unit_price=p2.price, line_total=p2.price)
                        self.stdout.write(f"Sample order Created: {order.order_number}")
        except Exception as e:
            self.stdout.write(f"Sample order skipped: {e}")

        self.stdout.write(self.style.SUCCESS(f"Seed complete! {Product.objects.count()} products, {Category.objects.count()} categories, {Collection.objects.count()} collections, {Testimonial.objects.count()} testimonials, {Review.objects.count()} reviews"))
