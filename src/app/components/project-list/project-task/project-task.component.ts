import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectTask } from '../../../models/project-task.model';
import { ProjectTaskService } from '../../../services/project-task.service';
import { Employee } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-project-task',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './project-task.component.html',
  styleUrl: './project-task.component.css'
})
export class ProjectTaskComponent {
  @Input() projectTaskID: number = 0;
  projectTask: ProjectTask = new ProjectTask(0, 0, "", "", "Not Started", 0);
  editMode: boolean = false;

  titleInvalid: boolean = false;
  descriptionInvalid: boolean = false;

  // Temporary date strings for input bindings
  startDateString: string = '';
  dueDateString: string = '';

  employees: Employee[] = [];

  constructor(
    private _projectTaskService: ProjectTaskService,
    private _employeeService: EmployeeService,
    private _roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.getProjectTaskByID();
    this.syncDateStrings();
    this.getUsers();
  }

  /** Get ProjectTask by ID */
  getProjectTaskByID(): void {
    this.projectTask = this._projectTaskService.getProjectTaskByID(this.projectTaskID);

    // Sync date strings
    this.syncDateStrings();
  }

  /** Convert Date objects to yyyy-MM-dd strings for binding */
  private syncDateStrings(): void {
    this.startDateString = this.formatDate(this.projectTask.startDate!);
    this.dueDateString = this.formatDate(this.projectTask.dueDate!);
  }

  /** Format a Date object to yyyy-MM-dd */
  private formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /** Convert yyyy-MM-dd strings back to Date objects */
  private parseDate(dateString: string): Date | null {
    if (!dateString) return null;
      const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // Use local timezone interpretation
  }

  /** Validation for title and description */
  validateFields(): void {
    this.titleInvalid = !this.projectTask.title.trim();
    this.descriptionInvalid = !this.projectTask.description.trim();
  }

  /** Enter Edit mode for editing projectTask list */
  enterEditMode(): void {
    this.editMode = true;
  }

  /** Gets all employees */
  getUsers(): void {
    this.employees = this._employeeService.getEmployees();
  }

  /** Get User by employeeID */
  getEmployeeByID(employeeID: number): string {
    if (!employeeID) return 'Unassigned'; // If no employeeID, return 'Unassigned'

    const employee = this.employees.find(employee => employee.employeeID === employeeID);
    if (employee) {
      return `${employee.name} (${this.getRolename(employee.roleID)})`;
    }
    return 'Unassigned';  // Return 'Unassigned' if no matching employee found
  }

  /** Get roleName with roleID */
  getRolename(roleID: number): string {
    return this._roleService.getRole(roleID)!.roleName || "Unable to get roleName";
  }

  /** Update projectTask and leave Edit mode */
  saveChanges(): void {
    this.validateFields(); // Validate fields before saving

    if (this.titleInvalid || this.descriptionInvalid) {
      return; // Prevent saving if there are validation errors
    }

    // Update the projectTask dates with the converted values
    this.projectTask.startDate = this.parseDate(this.startDateString) || this.projectTask.startDate;
    this.projectTask.dueDate = this.parseDate(this.dueDateString) || this.projectTask.dueDate;

    // String to number conversion for assignedUser
    this.projectTask.assignedEmployeeID = Number(this.projectTask.assignedEmployeeID);

    // Update ProjectTask
    this._projectTaskService.updateProjectTask(this.projectTask);

    // Refresh the projectTask from the service after saving
    this.getProjectTaskByID();

    // Notify other components and exit edit mode
    this.editMode = false;
  }

  /** Delete ProjectTask */
  deleteProjectTask(): void {
    const confirmDelete = confirm('Are you sure you want to delete this projectTask?');
    if (confirmDelete) {
      this._projectTaskService.deleteProjectTask(this.projectTaskID);
    }
  }
}
