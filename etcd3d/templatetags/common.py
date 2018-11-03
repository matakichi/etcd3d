from django import template
from django.conf import settings
from django.utils.safestring import mark_safe

register = template.Library()


@register.simple_tag
def app_fonts():
    return mark_safe('<style type="text/css">' \
                     'body, button, input, select, textarea {' \
                     'font-family:' + ','.join(settings.FONTS) + ';</style>')


@register.simple_tag
def kvs_tags():
    css = ''
    for tag in settings.KVS_TAG_ICONS:
        css += ".%(tag)s:before {font-family: '%(font)s';content: '\\%(icon)s';} " % \
               {'tag': tag['tag'], 'font': tag['font'], 'icon': tag['icon']}
    return mark_safe('<style type="text/css">' + css + '</style>')


@register.inclusion_tag('js/js_ext_templates.html')
def angular_ext_statics():
    ext_statics = {'angular_ext_statics': []}
    if settings.EXTERNAL_SERVICE.get('enable_traefik', False):
        ext_statics['angular_ext_statics'].append(settings.STATIC_URL + 'js/app/ext/traefik.controller.js')

    if len(ext_statics['angular_ext_statics']) > 0:
        ext_statics['angular_ext_statics'].append(settings.STATIC_URL + 'js/app/ext/ext.controller.js');
    return ext_statics
