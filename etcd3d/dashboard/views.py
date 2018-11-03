from django.views.generic import FormView, ListView
from django.views.generic.base import TemplateView

from etcd3d.form import KVForm
from etcd3d.utils import Etcd3Client


class DashboardView(TemplateView):
    template_name = 'dashboard/home.html'

    def get(self, request, **kwargs):
        context = super(DashboardView, self).get_context_data(**kwargs)
        return self.render_to_response(context)


class HealthyView(TemplateView):
    template_name = 'dashboard/health/health.html'


class KvSView(TemplateView):
    template_name = 'dashboard/kvs/kvs.html'

    def get(self, request, **kwargs):
        context = super(KvSView, self).get_context_data(**kwargs)
        keys = []
        etcd = Etcd3Client()
        for d, meta in etcd.get_root_dir():
            keys.append(meta.key.decode('utf-8'))
        context.update({'root': keys})
        return self.render_to_response(context)


class SettingsView(TemplateView):
    template_name = 'dashboard/settings/settings.html'


class GraphView(TemplateView):
    template_name = 'dashboard/graph/graph.html'


class ExtensionsView(TemplateView):
    template_name = 'dashboard/extensions/ext.html'


class CreateTraefikModalView(TemplateView):
    template_name = 'dashboard/extensions/traefik.html'


class DefaultFormsetView(FormView):
    template_name = 'demo/form.html'
    form_class = KVForm
    success_url = "#"

    def form_valid(self, form):
        form.commit()
#        messages.success(self.request, '')
        return super().form_valid(form)


class KeySearchListView(ListView):
    template_name = 'demo/keys_list.html'
    context_object_name = 'keys'

    def get_queryset(self):

        return ['hoge', 'hoge2']
