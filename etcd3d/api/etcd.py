import logging
import os
import uuid

from django.conf import settings
from django.contrib import messages
from etcd3d.utils import Etcd3Client
from rest_framework import renderers, status, viewsets
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response

LOG = logging.getLogger('app')


class KvSAPI(viewsets.ViewSet):
    renderer_classes = (renderers.JSONRenderer,)

    def list(self, request):
        keys = []
        etcd = Etcd3Client()
        if request.query_params.get('root_only', None):
            return self.roots(request)
        for d, meta in etcd.search(request.query_params.get('key', '/')):
            if not meta:
                messages.warning(request, "Not found keywords...")
                return Response(status=404)
            keys.append({'key': meta.key.decode('utf-8'),
                         'data': d.decode('utf-8'),
                         'is_dir': etcd.is_dir(d, meta.key)})
        LOG.debug(keys)
        return Response(status=status.HTTP_200_OK, data=keys)

    @list_route(methods=['get'])
    def roots(self, request):
        keys = []
        etcd = Etcd3Client()
        for d, meta in etcd.get_root_dir():
            LOG.debug('root: %s, %s' % (str(d), str(meta)))
            keys.append({'key': meta.key.decode('utf-8'),
                         'data': d.decode('utf-8'),
                         'is_dir': etcd.is_dir(d, meta.key)})
        return Response(status=status.HTTP_200_OK, data=keys)

    def create(self, request):
        LOG.debug('post: %s' % request.data)
        try:
            Etcd3Client().put_value(key=request.data['key'], value=request.data['value'])
            return Response(status=status.HTTP_201_CREATED, data={'key': request.data['key'],
                                                                  'message': "successfully updated."})
        except Exception as e:
            LOG.warning(e, exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={'message': "fail"})

    @list_route(methods=['post', 'delete'], url_path='directory')
    def directory(self, request):
        if request.method == 'POST':
            Etcd3Client().mkdir(request.data['key'])
            LOG.debug('mk: %s' % request.data)
            return Response(status=status.HTTP_201_CREATED)
        elif request.method == 'DELETE':
            LOG.debug('rm: %s' % request.data)
            Etcd3Client().remove(request.data['key'])
            return Response(status=status.HTTP_202_ACCEPTED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=['get'], url_path='dir2json')
    def dir2json(self, request):
        def sub_path(path, path_list):
            sub_list = []
            for p in path_list:
                try:
                    n = p['path'].split(path)
                    if len(n) == 2 and n[-1] and len(n[-1].split('/')) <= 2:
                        sub_list.append(p)
                except TypeError:
                    continue
            return sub_list

        def path_to_dict(path_list, root_path='/', v=None):
            return {
                'name': root_path,
                'value': v['data'] if v else None,
                'is_dir': v['is_dir'] if v else None,
                'children': [path_to_dict(path_list, x['path'], x) for x in sub_path(root_path, path_list)]
            }

        paths = []
        etcd = Etcd3Client(timeout=1000)
        for d, meta in etcd.get_all():
            if not meta.key.startswith('/'):
                continue
            paths.append(dict(path=meta.key, data=d.decode('utf-8') if d else None, is_dir=etcd.is_dir(d, meta.key)))
        return Response(status=status.HTTP_200_OK, data=path_to_dict(paths))


class KvSSetting(viewsets.ViewSet):
    renderer_classes = (renderers.JSONRenderer,)

    def list(self, request):
        ret = shortcut = {}
        for d, meta in Etcd3Client().search(settings.ETCD_DASHBOARD['settings_path'], fill=False):
            key = meta.key.decode('utf-8')
            # TODO to Util
            if key.startswith(settings.ETCD_STORE['shortcut_path']):
                k = key.split('/')
                if not k[-2] in shortcut:
                    shortcut.update({k[-2]: {}})
                shortcut[k[-2]].update({k[-1]: d.decode('utf-8')})

        ret['shortcut'] = [{'id': k, 'name': v.get('name', None), 'path': v.get('path', None)}
                           for k, v in shortcut.items()]

        return Response(status=status.HTTP_200_OK, data=ret)

    @list_route(methods=['post'], url_path='shortcut')
    def shortcut(self, request):
        LOG.debug('post: %s' % request.data)
        if 'path' not in request.data or 'name' not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data={'message': 'A required parameter (name/path) was missing.'})
        uid = uuid.uuid4().hex
        e3cl = Etcd3Client()
        e3cl.put_value(key=os.path.join(settings.ETCD_STORE['shortcut_path'], uid, 'name'),
                       value=request.data['name'])
        e3cl.put_value(key=os.path.join(settings.ETCD_STORE['shortcut_path'], uid, 'path'),
                       value=request.data['path'])
        return Response(status=status.HTTP_201_CREATED, data={'message': "added: " + request.data['path']})

    @detail_route(methods=['put', 'delete'], url_path='shortcut')
    def detail_shortcut(self, request, pk):
        e3cl = Etcd3Client()
        if request.method == 'PUT':
            e3cl.put_value(key=os.path.join(settings.ETCD_STORE['shortcut_path'], pk, 'name'),
                           value=request.data['name'])
            e3cl.put_value(key=os.path.join(settings.ETCD_STORE['shortcut_path'], pk, 'path'),
                           value=request.data['path'])
            return Response(status=status.HTTP_202_ACCEPTED, data={'message': "update: " + pk})
        else:
            LOG.debug('detail_shortcut')
            e3cl.remove(os.path.join(settings.ETCD_STORE['shortcut_path'], pk))
            return Response(status=status.HTTP_404_NOT_FOUND, data={'message': "deleted: " + pk})


class KVSHealth(viewsets.ViewSet):
    renderer_classes = (renderers.JSONRenderer,)

    def list(self, retuest):
        return Response(status=status.HTTP_200_OK, data=Etcd3Client().status)

    @list_route(methods=['get'], url_path='members')
    def members(self, request):
        return Response(status=status.HTTP_200_OK, data=[m for m in Etcd3Client().members])

    @list_route(methods=['get'], url_path='alarm')
    def alarm(self, request):
        return Response(status=status.HTTP_200_OK, data=[m for m in Etcd3Client().alarm()])


def create_shortcut_dict(k, d):
#    return (lambda x, y: y.append(x) if x[-2] in doc else doc.update())(k.split('/'), d.decode('utf-8'))
    pass
