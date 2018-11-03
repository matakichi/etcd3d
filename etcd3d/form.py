from django import forms
from django.contrib import messages


class KVForm(forms.Form):
    key = forms.CharField()
    value = forms.CharField()

    def commit(self):
        print('form commit. for (%s, %s)' %
              (self.cleaned_data['key'], self.cleaned_data['value']))
