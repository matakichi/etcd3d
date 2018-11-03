from django.views.generic.base import TemplateView


class AdminView(TemplateView):
    template_name = 'dashboard/admin/admin.html'


class UserEditView(TemplateView):
    template_name = 'dashboard/admin/user.html'
