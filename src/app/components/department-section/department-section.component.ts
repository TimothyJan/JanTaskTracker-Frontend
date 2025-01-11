import { Component } from '@angular/core';
import { DepartmentCreateComponent } from "./department-create/department-create.component";
import { DepartmentListComponent } from "./department-list/department-list.component";

@Component({
  selector: 'app-department-section',
  standalone: true,
  imports: [DepartmentCreateComponent, DepartmentListComponent],
  templateUrl: './department-section.component.html',
  styleUrl: './department-section.component.css'
})
export class DepartmentSectionComponent {

}
