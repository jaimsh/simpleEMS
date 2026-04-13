from rest_framework import serializers
from .models import Employee, Department


class DepartmentSerializer(serializers.ModelSerializer):
    employee_count = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ['id', 'name', 'employee_count', 'created_at']

    def get_employee_count(self, obj):
        return obj.employees.filter(status='active').count()


class EmployeeSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 'email', 'phone',
            'department', 'department_name', 'position', 'salary',
            'status', 'hire_date', 'created_at', 'updated_at'
        ]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
