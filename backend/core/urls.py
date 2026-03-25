from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/animals/', include('animals.urls')),
    path('api/predictions/', include('predictions.urls')),
    path("api/appointments/", include("appointments.urls")),
    path("api/vaccinations/", include("vaccinations.urls")),
    path("api/notifications/", include("notifications.urls")),
    path("api/chat/", include("chat.urls")),
    path("api/core/", include("homepage.urls")),
    path("api/vaccinations/", include("vaccinations.urls")),
    path("api/cases/", include("cases.urls")),

    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)