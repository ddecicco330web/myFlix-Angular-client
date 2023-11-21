import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';

/**
 * WelcomePageComponent represents the main component for the welcome page.
 *
 * This component is responsible for displaying the welcome page and handling
 * user registration and login dialogs.
 */
@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent {
  /**
   * Creates an instance of WelcomePageComponent.
   *
   * @param dialog - The MatDialog service for opening dialogs.
   */
  constructor(public dialog: MatDialog) {}

  /**
   * Opens the user registration dialog.
   *
   * @example
   * openUserRegistrationDialog();
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, { width: '500px' });
  }

  /**
   * Opens the user login dialog.
   *
   * @example
   * openUserLoginDialog();
   */
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, { width: '500' });
  }
}
