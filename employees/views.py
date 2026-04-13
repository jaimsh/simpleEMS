from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import Employee, Department
from .serializers import EmployeeSerializer, DepartmentSerializer


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.select_related('department').all()
    serializer_class = EmployeeSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email', 'position', 'department__name']
    ordering_fields = ['first_name', 'last_name', 'hire_date', 'salary', 'status']

    def get_queryset(self):
        queryset = super().get_queryset()
        status = self.request.query_params.get('status')
        department = self.request.query_params.get('department')
        if status:
            queryset = queryset.filter(status=status)
        if department:
            queryset = queryset.filter(department_id=department)
        return queryset

    @action(detail=False, methods=['get'])
    def stats(self, request):
        total = Employee.objects.count()
        active = Employee.objects.filter(status='active').count()
        inactive = Employee.objects.filter(status='inactive').count()
        on_leave = Employee.objects.filter(status='on_leave').count()
        by_department = (
            Department.objects.annotate(count=Count('employees'))
            .values('name', 'count')
        )
        return Response({
            'total': total,
            'active': active,
            'inactive': inactive,
            'on_leave': on_leave,
            'by_department': list(by_department),
        })
