import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserLoginService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

/**
 * @description Component representing the user login form.
 */
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent {
  /**
   * Input property for user data, including username and password.
   */
  @Input() userData = { Username: '', Password: '' };

  /**
   * Constructor of the UserLoginFormComponent.
   * @param fetchApiData - Service for making API calls related to user login.
   * @param dialogRef - Reference to the dialog opened by this component.
   * @param snackBar - Service for displaying snack bar notifications.
   * @param router - Angular router service for navigation.
   */
  constructor(
    public fetchApiData: UserLoginService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  /**
   * Logs in the user by calling the userLogin method from fetchApiData service.
   * Handles the success and error responses.
   */
  loginUser(): void {
    this.fetchApiData
      .userLogin(this.userData.Username, this.userData.Password)
      .subscribe({
        next: (result) => {
          localStorage.setItem('user', result.user.Username);
          localStorage.setItem('token', result.token);
          this.dialogRef.close();
          this.snackBar.open('Login Successful', 'OK', {
            duration: 2000,
          });
          this.router.navigate(['movies']);
        },

        error: (result) => {
          this.dialogRef.close();
          this.snackBar.open(result, 'OK', {
            duration: 2000,
          });
        },
      });
  }
}
