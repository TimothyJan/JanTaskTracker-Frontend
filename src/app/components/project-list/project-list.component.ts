import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from '../../services/project.service';
import { ProjectModalComponent } from './project-modal/project-modal.component';
import { ProjectComponent } from './project/project.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    ProjectComponent
  ],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent {
  listOfProjectIDs: number[] = [];

  constructor(
    private _projectService: ProjectService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getListOfProjectIDs();

    // Subscribe to changes in projects, specifically for deletion
    this._projectService.projectsChanged$.subscribe(() => {
      this.getListOfProjectIDs();
    });
  }

  /** Get list of ProjectIDs */
  getListOfProjectIDs(): void {
    this.listOfProjectIDs = this._projectService.getListOfProjectIDs();
  }

  /** Open ProjectModal and refresh list of ProjectIDs  */
  openAddProjectModal(): void {
    const modalRef = this.modalService.open(ProjectModalComponent, {
      size: 'md',
      backdrop: 'static', // Optional: Prevent closing on outside click
      keyboard: true, // Optional: Allow closing via the Escape key
    });

    modalRef.result
    .then((result) => {
      // console.log('Modal closed with result:', result);
      this.getListOfProjectIDs();
    })
    .catch((error) => {
      // console.error('Modal dismissed with error:', error);
    });
  }
}
