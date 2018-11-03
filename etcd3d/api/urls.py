from etcd3d.api.etcd import KvSAPI, KvSSetting, KVSHealth
from etcd3d.api.accounts import UserList
from rest_framework import routers

router = routers.DefaultRouter(trailing_slash=False)

router.register(r'kvs', KvSAPI, 'KVS')
router.register(r'settings', KvSSetting, 'KVSSetting')
router.register(r'health', KVSHealth, 'KVSHealth')

router.register(r'users', UserList)


urlpatterns = router.urls
