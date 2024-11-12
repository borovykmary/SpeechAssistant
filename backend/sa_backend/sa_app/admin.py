from django.contrib import admin
from .models import User, Event, Meditation, Task, Result

admin.site.register(User)
admin.site.register(Event)
admin.site.register(Meditation)
admin.site.register(Task)
admin.site.register(Result)
