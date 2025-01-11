import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { ProjectListComponent } from "./components/project-list/project-list.component";
import { FooterComponent } from "./components/footer/footer.component";
import { DepartmentSectionComponent } from "./components/department-section/department-section.component";
import { RoleSectionComponent } from "./components/role-section/role-section.component";
import { EmployeeSectionComponent } from "./components/employee-section/employee-section.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    ProjectListComponent,
    FooterComponent,
    DepartmentSectionComponent,
    RoleSectionComponent,
    EmployeeSectionComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'JanTaskTracker';
}
