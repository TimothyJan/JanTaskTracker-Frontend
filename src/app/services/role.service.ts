import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private rolesChangedSource = new Subject<void>();  // Emit events when role is added
  rolesChanged$ = this.rolesChangedSource.asObservable();

  roleID: number = 10;

  roles: Role[] = [
    new Role(0, "Accountant", 0),
    new Role(1, "Financial Analyst", 0),
    new Role(2, "Finance Manager", 0),
    new Role(3, "HR Assistant", 1),
    new Role(4, "HR Specialist", 1),
    new Role(5, "HR Director", 1),
    new Role(6, "Software Engineer", 2),
    new Role(7, "Front-End Developer", 2),
    new Role(8, "Back-End Developer", 2),
    new Role(9, "Full-Stack Developer", 2),
  ];

  constructor() { }

  /** Get Roles */
  getRoles(): Role[] {
    return this.roles;
  }

  /** Get Roles based on DepartmenIDd */
  getRolesFromDepartmentID(departmentID: number) {
    let departmentRoles = [];
    for(let i=0; i<this.roles.length; i++) {
      if(this.roles[i].departmentID == departmentID) {
        departmentRoles.push(this.roles[i]);
      }
    }
    return departmentRoles
  }

  /** Get Role based on id */
  getRole(id: number): Role | undefined {
    for(let i=0; i<this.roles.length; i++) {
      if(this.roles[i].roleID == id) {
        return this.roles[i];
      }
    }
    return undefined
  }

  /** Post new Role */
  addRole(role: Role): void {
    let newRole = new Role(this.roleID++, role.roleName, role.departmentID);
    this.roles.push(newRole);
    // console.log(this.roles);
  }

  /** Update existing Role based on id */
  updateRole(role: Role): void {
    for(let i=0; i<this.roles.length; i++) {
      if(this.roles[i].roleID == role.roleID) {
        this.roles[i] = role;
      }
    }
  }

  /** Delete Role based on id */
  deleteRole(id: number): void {
    for(let i=0; i<this.roles.length; i++) {
      if(this.roles[i].roleID == id) {
        this.roles.splice(i, 1);
      }
    }
  }

  /** Emit events for roles update */
  notifyRolesChanged(): void {
    this.rolesChangedSource.next();
  }
}
