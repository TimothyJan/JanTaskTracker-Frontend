import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Department } from '../../../models/department.model';
import { Role } from '../../../models/role.model';
import { DepartmentService } from '../../../services/department.service';
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css'
})
export class RoleListComponent {
  roles: Role[] = [];
  departments: Department[] = [];
  editModeRoleId: number | null = null;
  isLoading: boolean = false;

  constructor(
    private _departmentService: DepartmentService,
    private _roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadRoles();
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.departments = this._departmentService.getDepartments();
    this.isLoading = false;
  }

  /** Load all roles */
  loadRoles(): void {
    this.isLoading = true;
    this.roles = this._roleService.getRoles();
    this.isLoading = false;
  }

  /** Get Department name from DepartmentID */
  getDepartmentName(departmentID: number): string | undefined {
    const department = this.departments.find(dep => dep.departmentID == departmentID);
    return department ? department.departmentName : undefined;
  }

  /** Enter Edit mode for editting role list */
  enterEditMode(roleId: number): void {
    this.editModeRoleId = roleId;
  }

  /** Leave Edit mode and save changes */
  saveChanges(role: Role): void {
    this._roleService.updateRole(role);
    this.editModeRoleId = null;
    this.loadRoles(); // Reload roles to reflect changes
  }

  /** Delete Role */
  onDelete(roleID: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this role?');
    if (confirmDelete) {
      this._roleService.deleteRole(roleID);
      this.loadRoles(); // Reload roles after deletion
    }
  }
}
