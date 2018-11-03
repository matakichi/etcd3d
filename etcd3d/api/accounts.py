from rest_framework import viewsets

from django.contrib.auth.models import User

from etcd3d.api.serializers import UserSerializer


class UserList(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
