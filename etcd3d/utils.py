import re
import logging
import etcd3
from django.conf import settings

DEFAULT_DIR_VALUE = 'etcd3_directory$hahahahaha^^^^'

LOG = logging.getLogger('app')


class Etcd3Client:
    def __init__(self, host=settings.ETCD_SERVICE['host'], port=settings.ETCD_SERVICE['port'], timeout=20):
        self.etcd = etcd3.client(host=host, port=port, timeout=timeout)

    def get(self, key):
        return self.etcd.get(key)

    def alarm(self, member_id=0):
        return self.etcd.disarm_alarm(member_id)

    def get_all(self):
        for d, meta in self.etcd.get_all():
            try:
                meta.key = meta.key.decode('utf-8')
                yield (d, meta)
            except UnicodeDecodeError:
                #LOG.debug('UnicodeDecodeError: %s' % meta.key)
                pass

    def get_root_dir(self):
        for d, meta in self.etcd.get_prefix('/'):
            LOG.debug('get_root_dir: %s, %s' % (d, meta.key))
            try:
                if re.match(r'^/(?!.*/)', meta.key.decode('utf-8')):
                    yield (d, meta)
            except UnicodeDecodeError:
                LOG.debug('UnicodeDecodeError: %s' % meta.key)

    def is_dir(self, d, key):
        try:
            if re.match(r'^(?:%s|/)' % re.escape(DEFAULT_DIR_VALUE), d.decode('utf-8')):
                return True
            #keys = list(self.etcd.get(key.decode('utf-8')))
            #if len(keys) > 1:
            #    return True
        except UnicodeDecodeError:
            LOG.debug('UnicodeDecodeError: %s' % key)
        return False

    def search(self, key, fill=True):
        LOG.debug('search kwd: %s' % key)
        for d, meta in self.etcd.get_prefix(key):
            if fill:
                try:
                    if re.match((r'^%s(.|$)(?!.*/)' % key), meta.key.decode('utf-8')):
                        LOG.debug('match: %s, %s' % (d, meta.key))
                        yield (d, meta)
                    else:
                        LOG.debug('dont match: %s, %s' % (d, meta.key))
                except UnicodeDecodeError:
                    LOG.debug('UnicodeDecodeError: %s' % meta.key)
            else:
                yield (d, meta)

    def mkdir(self, key):
        self.etcd.put(key, DEFAULT_DIR_VALUE)

    def put_value(self, key, value):
        self.etcd.put(key, value.encode('utf-8'))

    def remove(self, key):
        self.etcd.delete_prefix(key)

    @property
    def members(self):
        for member in self.etcd.members:
            yield member_to_dict(member)

    @property
    def status(self):
        s = self.etcd.status()
        return {
            'version': s.version,
            'db_size': s.db_size,
            'leader': member_to_dict(s.leader),
            'raft_index': s.raft_index,
            'raft_term': s.raft_term
        }


def member_to_dict(member):
    return {
        'id': member.id,
        'name': member.name,
        'peer_urls': list(member.peer_urls),
        'client_urls': list(member.client_urls)
    }


def shorten_middle(s, l, p='...'):
    return s if len(s) <= l else '{0}{1}{2}'.format(s[:int(l/2-len(p))], p, s[-int(l/2):])
