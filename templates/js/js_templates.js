{% autoescape off %}
{% load angular_escapes from angular %}
angular
 .module('etcd3d.app')
 .run(['$templateCache', function($templateCache) {
   $templateCache.put(
     "{{ static_path }}",
     "{{ template_html|angular_escapes }}"
   );
}]);
{% endautoescape %}
