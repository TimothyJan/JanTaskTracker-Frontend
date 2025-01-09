export class ProjectTask {
  projectTaskID: number;
  projectID: number;
  title: string;
  description: string;
  status: "Not Started" | "Active" | "Completed";
  assignedEmployeeID?: number | null;
  startDate?: Date;
  dueDate?: Date;

  constructor(
    projectTaskID: number,
    projectID: number,
    title: string,
    description: string,
    status: "Not Started" | "Active" | "Completed",
    assignedEmployeeID?: number | null,
    startDate?: Date,
    dueDate?: Date,
  ) {
    this.projectTaskID = projectTaskID;
    this.projectID = projectID,
    this.title = title,
    this.description = description,
    this.status = status,
    this.assignedEmployeeID = assignedEmployeeID,
    this.startDate = startDate,
    this.dueDate = dueDate
  }
}
