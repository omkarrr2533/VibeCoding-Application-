
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse
@api_view(['GET'])
def health(request):
    return Response({"status":"ok","service":"Om's Jewellers API","version":"1.0.0"})
def sitemap(request):
    xml='''<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://omsjewellers.example.com/</loc></url><url><loc>https://omsjewellers.example.com/shop</loc></url><url><loc>https://omsjewellers.example.com/collections</loc></url></urlset>'''
    return HttpResponse(xml, content_type='application/xml')
def robots(request):
    return HttpResponse("User-agent: *\nAllow: /\nSitemap: https://omsjewellers.example.com/sitemap.xml", content_type='text/plain')
