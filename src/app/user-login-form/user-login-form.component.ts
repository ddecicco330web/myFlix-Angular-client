import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserLoginService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent {
  @Input() userData = { Username: '', Password: '' };
  constructor(
    public fetchApiData: UserLoginService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  loginUser(): void {
    this.fetchApiData
      .userLogin(this.userData.Username, this.userData.Password)
      .subscribe({
        next: (result) => {
          console.log(result);
          this.dialogRef.close();
          this.snackBar.open('Login Successful', 'OK', {
            duration: 2000,
          });
        },

        error: (result) => {
          console.log(result);
          this.dialogRef.close();
          this.snackBar.open(result, 'OK', {
            duration: 2000,
          });
        },
      });
  }
}
