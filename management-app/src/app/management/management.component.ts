import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css'],
})
export class ManagementComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['employeeId', 'firstName', 'lastName', 'company', 'department', 'action'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  employeeForm: FormGroup;
  isModalOpen = false;
  isEditing = false;
  currentEditEmployee: any = null;

  constructor(private fb: FormBuilder, private employeeService: EmployeeService) {
    this.employeeForm = this.fb.group({
      employeeId: ['', [Validators.required]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      company: ['', Validators.required],
      department: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadEmployees();

    this.dataSource.filterPredicate = (data, filter) => {
      const transformedFilter = filter.trim().toLowerCase();
      return (
        data.employeeId.toString().includes(transformedFilter) ||
        data.firstName.toLowerCase().includes(transformedFilter) ||
        data.lastName.toLowerCase().includes(transformedFilter) ||
        data.company.toLowerCase().includes(transformedFilter) ||
        data.department.toLowerCase().includes(transformedFilter)
      );
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      (error) => console.error('Error loading employees:', error)
    );
  }

  getNextEmployeeId(): void {
    this.employeeService.getNextEmployeeId().subscribe(
      (id) => {
        this.employeeForm.controls['employeeId'].setValue(id);
      },
      (error) => console.error('Error fetching next employee ID:', error)
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openModal(employee: any = null): void {
    this.isEditing = !!employee;
    this.currentEditEmployee = employee;

    if (employee) {
      this.employeeForm.patchValue(employee);
    } else {
      this.employeeForm.reset();
      this.getNextEmployeeId(); // Fetch and set the next employee ID
    }

    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.employeeForm.reset();
  }

  saveEmployee(): void {
    if (this.employeeForm.valid) {
      const newEmployee = this.employeeForm.value;

      if (this.isEditing && this.currentEditEmployee) {
        this.employeeService.updateEmployee(this.currentEditEmployee._id, newEmployee).subscribe(
          () => {
            this.loadEmployees();
            this.closeModal();
          },
          (error) => console.error('Error updating employee:', error)
        );
      } else {
        this.employeeService.addEmployee(newEmployee).subscribe(
          () => {
            this.loadEmployees();
            this.closeModal();
          },
          (error) => console.error('Error saving employee:', error)
        );
      }
    }
  }

  deleteEmployee(id: string): void {
    this.employeeService.deleteEmployee(id).subscribe(
      () => this.loadEmployees(),
      (error) => console.error('Error deleting employee:', error)
    );
  }

  // Add a method to format employeeId with leading zeros
  formatEmployeeId(employeeId: number): string {
    return employeeId.toString().padStart(5, '0');
  }
}
