import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Material Modules
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';

// App Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ManagementComponent } from './management/management.component';

// Services
import { EmployeeService } from './services/employee.service';

@NgModule({
  declarations: [
    AppComponent,          // Root component
    ManagementComponent,   // Management component for the employees
  ],
  imports: [
    BrowserModule,         // Basic browser functionalities
    BrowserAnimationsModule, // Required for Angular Material animations
    AppRoutingModule,      // Handles app routing
    HttpClientModule,      // For HTTP requests
    ReactiveFormsModule,   // For reactive forms
    FormsModule,           // For template-driven forms
    MatSortModule,         // For sorting the table
    MatChipsModule,        // For chips in the filter
    

    // Angular Material modules
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [EmployeeService], // Service for API calls
  bootstrap: [AppComponent],    // Root component to bootstrap
})
export class AppModule {}
