import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Department } from '../../../models/department.model';
import { Employee } from '../../../models/employee.model';
import { Role } from '../../../models/role.model';
import { DepartmentService } from '../../../services/department.service';
import { EmployeeService } from '../../../services/employee.service';
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  employees: Employee[] = [];
  departments: Department[] = [];
  roles: Role[] = [];
  filteredRoles: Role[] = [];
  editModeEmployeeId: number | null = null;
  originalRoleID: number | null = null;
  rolePlaceholderID = 0;  // Placeholder value for unselected role

  constructor(
    private _employeeService: EmployeeService,
    private _departmentService: DepartmentService,
    private _roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.departments = this._departmentService.getDepartments();
    this.roles = this._roleService.getRoles();
  }

  /** Load all Employees */
  loadEmployees(): void {
    this.employees = this._employeeService.getEmployees();
  }

  /** Get Department name from DepartmentID */
  getDepartmentName(departmentID: number): string | undefined {
    return this._departmentService.getDepartment(departmentID)?.departmentName;
  }

  /** Get Role name from RoleID */
  getRoleName(roleID: number): string | undefined {
    return this._roleService.getRole(roleID)?.roleName;
  }

  /** Enter Edit mode for editting Employee list */
  enterEditMode(employeeId: number): void {
    this.editModeEmployeeId = employeeId;
    const employee = this.employees.find(emp => emp.employeeID === employeeId);
    if (employee) {
      this.originalRoleID = employee.roleID;
      this.filteredRoles = this._roleService.getRolesFromDepartmentID(employee.departmentID);
    }
  }

  /** Load associated Roles when Department selection is changed  */
  onDepartmentChange(departmentID: number): void {
    this.filteredRoles = this._roleService.getRolesFromDepartmentID(departmentID);
    const employee = this.employees.find(emp => emp.employeeID === this.editModeEmployeeId);
    if (employee) {
      employee.roleID = this.rolePlaceholderID;  // Reset to placeholder
    }
  }

  /** Update Employee and leave Edit mode */
  saveChanges(employee: Employee): void {
    if (employee.roleID !== this.rolePlaceholderID) {
      this._employeeService.updateEmployee(employee);
    }
    this.editModeEmployeeId = null;
  }

  /** Delete Employee */
  onDelete(employeeID: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this employee?');
    if (confirmDelete) {
      this._employeeService.deleteEmployee(employeeID);
      this.loadEmployees();
    }
  }
}
