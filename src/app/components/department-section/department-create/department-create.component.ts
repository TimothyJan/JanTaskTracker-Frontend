import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DepartmentService } from '../../../services/department.service';

@Component({
  selector: 'app-department-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './department-create.component.html',
  styleUrl: './department-create.component.css'
})
export class DepartmentCreateComponent {
  departmentForm: FormGroup = new FormGroup({
    departmentName: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)])
  });

  constructor(private _departmentService: DepartmentService) {}

  onSubmit(): void {
    if (this.departmentForm.valid) {
      // console.log('Form Submitted:', this.departmentForm.value);
      this._departmentService.addDepartment(this.departmentForm.value);
      this.departmentForm.reset();
      this._departmentService.notifyDepartmentsChanged();
    }
  }
}
