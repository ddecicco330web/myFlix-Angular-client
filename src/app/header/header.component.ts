import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * @description Component representing the header of the application, containing navigation links and sign-out functionality.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  /**
   * Constructor of the HeaderComponent.
   * @param router - Angular router service for navigation.
   */
  constructor(public router: Router) {}

  /**
   * Navigates to the user profile view.
   */
  goToUserProfileView() {
    this.router.navigate(['userProfile']);
  }

  /**
   * Navigates to the view displaying all movies.
   */
  goToAllMoviesView() {
    this.router.navigate(['movies']);
  }

  /**
   * Signs out the user by clearing local storage and navigating to the welcome page.
   */
  signOut() {
    localStorage.clear();
    this.router.navigate(['welcome']);
  }
}
