import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project } from '../../../models/project.model';
import { ProjectTaskService } from '../../../services/project-task.service';
import { ProjectService } from '../../../services/project.service';
import { ProjectTaskComponent } from '../project-task/project-task.component';
import { ProjectTaskModalComponent } from '../project-task-modal/project-task-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectModalComponent } from '../project-modal/project-modal.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProjectTaskComponent,
    ProjectTaskModalComponent
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent {
  @Input() projectID: number = 0;
  project: Project = new Project(0, "", "", "Not Started");
  listOfProjectTaskIDs: number[] = [];
  editMode: boolean = false;

  projectNameInvalid: boolean = false;
  descriptionInvalid: boolean = false;

  startDateString: string = '';
  dueDateString: string = '';

  constructor(
    private _projectService: ProjectService,
    private _projectTaskService: ProjectTaskService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getProjectByID();
    this.getListOfProjectTaskIDsByProjectID();

    // Subscribe to changes in the task list
    this._projectTaskService.projectTasksChanged$.subscribe(() => {
      this.getListOfProjectTaskIDsByProjectID(); // Refresh the list after a task is deleted
    });

    this.syncDateStrings();
  }

  /** Get Project by ID */
  getProjectByID(): void {
    this.project = this._projectService.getProjectByID(this.projectID);
    // Sync date strings
    this.syncDateStrings();
  }

  /** Get list of ProjectTaskIDs by ProjectID */
  getListOfProjectTaskIDsByProjectID(): void {
    this.listOfProjectTaskIDs = this._projectTaskService.getListOfProjectTaskIDsByProjectIDs(this.projectID);
  }

  /** Edit Mode */
  enterEditMode(): void {
    this.editMode = true;
  }

  /** Save project and exit editMode */
  saveChanges(): void {
    this.validateFields(); // Validate fields before saving

    if (this.projectNameInvalid || this.descriptionInvalid) {
      return; // Prevent saving if there are validation errors
    }

    // Update the projectTask dates with the converted values
    this.project.startDate = this.parseDate(this.startDateString) || this.project.startDate;
    this.project.dueDate = this.parseDate(this.dueDateString) || this.project.dueDate;

    this._projectService.updateProject(this.project);
    this._projectService.notifyProjectsChanged();
    this.editMode = false; // Exit edit mode
  }

  /**Delete Project */
  deleteProject(): void {
    const confirmDelete = confirm('Are you sure you want to delete this project?');
    if (confirmDelete) {
      this._projectService.deleteProject(this.project.projectID);
      this._projectService.notifyProjectsChanged();

      // Delete projectsTasks with same projectID
      let listOfProjectTaskIDs = this._projectTaskService.getListOfProjectTaskIDsByProjectIDs(this.project.projectID);
      console.log(this.listOfProjectTaskIDs)
      for(var projectTaskID of listOfProjectTaskIDs) {
        this._projectTaskService.deleteProjectTask(projectTaskID);
        this._projectTaskService.notifyProjectTasksChanged();
      }
    }
  }

  /** Open ProjectTaskModal and refresh list of ProjectTaskIDs */
  openAddProjectTaskModal(): void {
    const modalRef = this.modalService.open(ProjectTaskModalComponent, {
      size: 'md',
      backdrop: 'static', // Optional: Prevent closing on outside click
      keyboard: true, // Optional: Allow closing via the Escape key
    });

    modalRef.componentInstance.projectID = this.projectID;

    modalRef.result
    .then((result) => {
      // console.log('Modal closed with result:', result);
      this.getListOfProjectTaskIDsByProjectID();
    })
    .catch((error) => {
      // console.error('Modal dismissed with error:', error);
    });
  }

  /** Convert Date objects to yyyy-MM-dd strings for binding */
  private syncDateStrings(): void {
    this.startDateString = this.formatDate(this.project.startDate!);
    this.dueDateString = this.formatDate(this.project.dueDate!);
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
    this.projectNameInvalid = !this.project.projectName.trim();
    this.descriptionInvalid = !this.project.description.trim();
  }
}
