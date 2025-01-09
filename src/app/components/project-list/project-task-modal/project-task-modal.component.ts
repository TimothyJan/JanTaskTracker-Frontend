import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectTask } from '../../../models/project-task.model';
import { ProjectTaskService } from '../../../services/project-task.service';
import { ProjectComponent } from '../project/project.component';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models/employee.model';
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-project-task-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProjectComponent
  ],
  templateUrl: './project-task-modal.component.html',
  styleUrl: './project-task-modal.component.css'
})
export class ProjectTaskModalComponent {
  @Input() projectID: number | undefined;
  projectTask: ProjectTask = new ProjectTask(0, 0, "", "", "Not Started", 0);
  startDateString: string = '';
  dueDateString: string = '';
  employees: Employee[] = [];

  titleInvalid: boolean = false;
  descriptionInvalid: boolean = false;

  @Output() taskCreated = new EventEmitter<ProjectTask>();

  constructor(
    public activeModal: NgbActiveModal,
    private _projectTaskService: ProjectTaskService,
    private _employeeService: EmployeeService,
    private _roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.projectTask.projectID = this.projectID!;
    this.getEmployees();
  }

  /** Convert yyyy-MM-dd strings back to Date objects */
  private parseDate(dateString: string): Date | null {
    if (!dateString) return null;
      const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // Use local timezone interpretation
  }

  /** Gets all employees */
  getEmployees(): void {
    this.employees = this._employeeService.getEmployees();
  }

  /** Get roleName with roleID */
  getRolename(roleID: number): string {
    return this._roleService.getRole(roleID)!.roleName || "Unable to get roleName";
  }

  /** Validation for title and description */
  validateFields(): void {
    this.titleInvalid = !this.projectTask.title.trim();
    this.descriptionInvalid = !this.projectTask.description.trim();
  }

  /** Add ProjectTask */
  addProjectTask(): void {
    this.validateFields(); // Validate fields before saving

    if (this.titleInvalid || this.descriptionInvalid) {
      return; // Prevent saving if there are validation errors
    }
    // Update the projectTask dates with the converted values
    this.projectTask.startDate = this.parseDate(this.startDateString) || this.projectTask.startDate;
    this.projectTask.dueDate = this.parseDate(this.dueDateString) || this.projectTask.dueDate;

    // String to number conversion for assignedEmployee
    this.projectTask.assignedEmployeeID = Number(this.projectTask.assignedEmployeeID);

    // Add ProjectTask
    this._projectTaskService.addProjectTask(this.projectTask);

    // Clear the form
    this.projectTask = new ProjectTask(0, 0, "", "", "Not Started", 0);
    this.startDateString = '';
    this.dueDateString = '';

    this.closeModal();
  }

  /** Close the Modal */
  closeModal(): void {
    this.activeModal.close(); // Pass result back to parent
  }
}
