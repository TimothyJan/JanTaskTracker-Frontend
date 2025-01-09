import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ProjectTask } from '../models/project-task.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectTaskService {

  private projectTasksChangedSource = new Subject<void>();  // Emit events when department is added
  projectTasksChanged$ = this.projectTasksChangedSource.asObservable();

  private projectTasks: ProjectTask[] = [
    new ProjectTask(1, 1, 'Task 1', 'Task for Project Alpha', 'Completed', 2, new Date('2024-11-13'), new Date('2024-12-13')),
    new ProjectTask(2, 1, 'Task 2', 'Another Task for Project Alpha', 'Active', 3, new Date('2024-12-13'), new Date('2025-1-13')),
    new ProjectTask(3, 2, 'Task 3', 'Task for Project Beta', 'Completed', 1, new Date('2025-1-13'), new Date('2025-2-13')),
    new ProjectTask(4, 2, 'Task 4', 'Another Task for Project Beta', 'Active', 1, new Date('2024-11-13'), new Date('2025-2-13'))
  ];

  constructor() {}

  // Get all project tasks
  getProjectTasks(): ProjectTask[] {
    return this.projectTasks;
  }

  getListOfProjectTaskIDsByProjectIDs(projectID: number): number[] {
    let listOfProjectTaskIDsByProjectIDs: number[] = [];
    for (var projectTask of this.projectTasks) {
      if(projectTask.projectID === projectID) {
        listOfProjectTaskIDsByProjectIDs.push(projectTask.projectTaskID);
      }
    }
    return listOfProjectTaskIDsByProjectIDs;
  }

  // Get tasks by project ID
  getTasksByProjectID(projectID: number): ProjectTask[] {
    return this.projectTasks.filter((task) => task.projectID === projectID);
  }

  // Get a project task by ID
  getProjectTaskByID(taskID: number): ProjectTask {
    return this.projectTasks.find((task) => task.projectTaskID === taskID)!;
  }

  // Add a new project task
  addProjectTask(newProjectTask: ProjectTask): void {
    newProjectTask.projectTaskID = this.projectTasks.length+1;
    this.projectTasks.push(newProjectTask);
  }

  // Update an existing project task
  updateProjectTask(updatedTask: ProjectTask): void {
    const index = this.projectTasks.findIndex((task) => task.projectTaskID === updatedTask.projectTaskID);
    if (index !== -1) {
      this.projectTasks[index] = updatedTask;
    }
  }

  // Delete a project task
  deleteProjectTask(projectTaskID: number): void {
    const index = this.projectTasks.findIndex(task => task.projectTaskID === projectTaskID);
    if (index !== -1) {
      this.projectTasks.splice(index, 1);
      this.projectTasksChangedSource.next(); // Notify subscribers that the task list has changed
    }
  }

  /** Emit events for projectTasks update */
  notifyProjectTasksChanged(): void {
    this.projectTasksChangedSource.next();
  }
}
