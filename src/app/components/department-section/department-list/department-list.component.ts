import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Department } from '../../../models/department.model';
import { DepartmentService } from '../../../services/department.service';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.css'
})
export class DepartmentListComponent {
  departments: Department[] = [];
  editModeDepartmentId: number | null = null;

  constructor(private _departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  /** Load all Departments */
  loadDepartments(): void {
    this.departments = this._departmentService.getDepartments();
  }

  /** Enter Edit mode for editting Department list */
  enterEditMode(departmentId: number): void {
    this.editModeDepartmentId = departmentId;
  }

  /** Update Department and leave Edit mode */
  saveChanges(department: Department): void {
    this._departmentService.updateDepartment(department);
    this.editModeDepartmentId = null;
    this.loadDepartments(); // Reload departments to reflect changes
  }

  /** Delete Department */
  onDelete(departmentID: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this department?');
    if (confirmDelete) {
      this._departmentService.deleteDepartment(departmentID);
      this.loadDepartments(); // Reload departments after deletion
    }
  }
}
