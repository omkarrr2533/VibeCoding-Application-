from rest_framework.decorators import api_view
from rest_framework.response import Response
# Simple pincode serviceability — in production integrate with Shiprocket/Delhivery
SERVICEABLE_PINCODES = {
    # Maharashtra prime
    '411001': {'city':'Pune Laxmi Road','serviceable':True,'cod':True,'days':2},
    '411030': {'city':'Pune Koregaon Park','serviceable':True,'cod':True,'days':2},
    '400001': {'city':'Mumbai Fort','serviceable':True,'cod':True,'days':3},
    '560001': {'city':'Bangalore MG Road','serviceable':True,'cod':False,'days':4},
    '110001': {'city':'Delhi Connaught Place','serviceable':True,'cod':True,'days':4},
    '700001': {'city':'Kolkata Esplanade','serviceable':True,'cod':False,'days':5},
    '600001': {'city':'Chennai Parrys','serviceable':True,'cod':True,'days':4},
    '500001': {'city':'Hyderabad Abids','serviceable':True,'cod':True,'days':4},
}
DEFAULT_SERVICEABLE = {'serviceable':True,'cod':True,'days':5,'note':'Standard delivery via insured courier. Remote areas may take 7 days.'}

@api_view(['GET'])
def check_pincode(request):
    pincode = request.query_params.get('pincode','').strip()
    if not pincode or len(pincode)!=6 or not pincode.isdigit():
        return Response({'valid':False,'detail':'Enter 6-digit pincode'}, status=400)
    info = SERVICEABLE_PINCODES.get(pincode)
    if info:
        return Response({'valid':True,'pincode':pincode, **info, 'shipping_cost': 0 if int(pincode) % 2==0 else 99, 'estimated_delivery': f"{info['days']-1}-{info['days']} business days"})
    # Default: assume serviceable but check last digit for demo
    # In production, call external API
    return Response({'valid':True,'pincode':pincode, **DEFAULT_SERVICEABLE, 'city':'Pan-India','serviceable':True,'cod': pincode[-1] in '02468','shipping_cost': 0 if int(pincode) % 2==0 else 99, 'estimated_delivery':'3-7 business days'})

@api_view(['GET'])
def shipping_rates(request):
    return Response({
        'standard': {'cost': 0, 'threshold': 5000, 'below_cost': 99, 'note':'Complimentary shipping above ₹5,000'},
        'express': {'cost': 199, 'days':'1-2 business days', 'note':'Express via Bluedart for urgent bridal'},
        'cod_charge': 50,
        'insurance': 'All shipments insured via carrier',
        'international': {'available': False, 'note':'Currently domestic only. Contact for NRI gifting via atelier.'}
    })
