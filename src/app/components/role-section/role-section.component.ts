import { Component } from '@angular/core';
import { RoleCreateComponent } from "./role-create/role-create.component";
import { RoleListComponent } from "./role-list/role-list.component";

@Component({
  selector: 'app-role-section',
  standalone: true,
  imports: [RoleCreateComponent, RoleListComponent],
  templateUrl: './role-section.component.html',
  styleUrl: './role-section.component.css'
})
export class RoleSectionComponent {

}
