/**
 * @fileOverview User Registration Form Component
 */

import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserRegistrationService } from '../fetch-api-data.service';

/**
 * @description Represents the User Registration Form Component.
 */
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
})
export class UserRegistrationFormComponent {
  /**
   * @description Input property to receive user data.
   * @type {object}
   */
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  /**
   * @description Creates an instance of UserRegistrationFormComponent.
   * @constructor
   * @param {UserRegistrationService} fetchApiData - The user registration service for making API calls.
   * @param {MatDialogRef<UserRegistrationFormComponent>} dialogRef - Reference to the dialog opened by the component.
   * @param {MatSnackBar} snackBar - Service for displaying snack bar messages.
   */
  constructor(
    public fetchApiData: UserRegistrationService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  /**
   * @description Handles the user registration process.
   * @method
   * @returns {void}
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe({
      next: (result) => {
        this.dialogRef.close();
        this.snackBar.open('User registration successful', 'OK', {
          duration: 2000,
        });
      },
      /**
       * @description Callback function executed on registration error.
       * @param {any} result - The error result of the registration.
       * @returns {void}
       */
      error: (result) => {
        this.snackBar.open(result, 'OK', {
          duration: 2000,
        });
      },
    });
  }
}
