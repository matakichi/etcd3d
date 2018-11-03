from django.conf.urls import url
from etcd3d.dashboard.admin.views import AdminView, UserEditView

urlpatterns = [
    url(r'^$', AdminView.as_view(), name='admin'),
    url(r'user', UserEditView.as_view(), name='user'),
]
