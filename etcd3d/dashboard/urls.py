"""etcd3d URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
#from django.contrib import admin

from etcd3d.dashboard.views import DashboardView, DefaultFormsetView, KeySearchListView,\
    KvSView, SettingsView, HealthyView, GraphView, ExtensionsView, CreateTraefikModalView

urlpatterns = [
    url(r'^admin/', include('etcd3d.dashboard.admin.urls')),
    #url(r'^admin/', admin.site.urls),
    url(r'^$', DashboardView.as_view(), name='dashboard'),
    url(r'^settings$', SettingsView.as_view(), name='settings'),
    url(r'^healthy$', HealthyView.as_view(), name='healthy'),
    url(r'^kvs$', KvSView.as_view(), name='kvs'),
    url(r'^graph', GraphView.as_view(), name='graph'),
    url(r'^ext', ExtensionsView.as_view(), name='extensions'),
    url(r'^modal/traefik', CreateTraefikModalView.as_view(), name='ext_traefik'),
    url(r'^store/keys$', KeySearchListView.as_view(), name='key_search_list_view'),
    url(r'^store_form', DefaultFormsetView.as_view(), name='formset_default'),
]
