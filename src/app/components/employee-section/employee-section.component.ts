import { Component } from '@angular/core';
import { EmployeeCreateComponent } from "./employee-create/employee-create.component";
import { EmployeeListComponent } from "./employee-list/employee-list.component";

@Component({
  selector: 'app-employee-section',
  standalone: true,
  imports: [EmployeeCreateComponent, EmployeeListComponent],
  templateUrl: './employee-section.component.html',
  styleUrl: './employee-section.component.css'
})
export class EmployeeSectionComponent {

}
