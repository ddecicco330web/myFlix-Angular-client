import { Component, OnInit, Input } from '@angular/core';
import {
  GetUserService,
  User,
  EditUserService,
  GetFavortieMoviesService,
  GetAllMoviesService,
  MovieList,
  MovieResponse,
  AddFavoriteMovieService,
  DeleteFavoriteMovieService,
  DeleteUserService,
} from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

/**
 * @description Component for displaying and managing user profiles.
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  /** Input property for the user information. */
  @Input() user: User;
  /** Input property for the user's password. */
  @Input() password: string;

  /** Original username before any edits. */
  originalUsername: string;
  /** Array of movie IDs associated with the user. */
  movieIDs: string[];
  /** List of all movies. */
  movieList: MovieList;
  /** List of favorite movies. */
  favoriteList: MovieList;

  /**
   * Constructor for UserProfileComponent.
   * @param getUserService - Service for fetching user data.
   * @param editUserService - Service for editing user data.
   * @param snackBar - Angular Material component for snack bar notifications.
   * @param getFavMoviesService - Service for fetching favorite movies.
   * @param getMoviesService - Service for fetching all movies.
   * @param addFavoriteService - Service for adding a movie to favorites.
   * @param removeFavoriteService - Service for removing a movie from favorites.
   * @param deleteUserService - Service for deleting user accounts.
   * @param router - Angular router for navigation.
   */
  constructor(
    public getUserService: GetUserService,
    public editUserService: EditUserService,
    public snackBar: MatSnackBar,
    public getFavMoviesService: GetFavortieMoviesService,
    public getMoviesService: GetAllMoviesService,
    public addFavoriteService: AddFavoriteMovieService,
    public removeFavoriteService: DeleteFavoriteMovieService,
    public deleteUserService: DeleteUserService,
    public router: Router
  ) {
    this.user = {
      id: '',
      username: '',
      eMail: '',
      birthday: '',
    };
    this.password = '';
    this.originalUsername = '';
    this.movieIDs = [];
    this.movieList = { movies: [] };
    this.favoriteList = { movies: [] };
  }

  /**
   * Lifecycle hook called after the component is initialized.
   * Retrieves user and favorite movie data on initialization.
   */
  ngOnInit(): void {
    localStorage.getItem('user')
      ? (this.user.username = localStorage.getItem('user')!)
      : null;

    this.getUser();
    this.getFavoriteMovies();
  }

  /**
   * Fetches user data from the server.
   */
  getUser(): void {
    this.getUserService.getUser(this.user.username).subscribe({
      next: (res: User) => {
        this.user = res;
        this.originalUsername = this.user.username;
      },
    });
  }

  /**
   * Updates user information on the server.
   */
  updateUser(): void {
    this.editUserService
      .editUser(this.originalUsername, this.user, this.password)
      .subscribe({
        next: (result) => {
          localStorage.setItem('user', this.user.username);
          this.snackBar.open('User update successful', 'OK', {
            duration: 2000,
          });
        },
        error: (result) => {
          this.snackBar.open(result, 'OK', {
            duration: 2000,
          });
        },
      });
  }

  /**
   * Deletes the user account.
   */
  deleteUser(): void {
    const username = localStorage.getItem('user');

    if (username) {
      this.deleteUserService.deleteUser(username).subscribe({
        next: (resp) => {
          localStorage.clear();
          this.router.navigate(['welcome']);
        },
      });
    }
  }

  /**
   * Fetches the user's favorite movies from the server.
   */
  getFavoriteMovies(): void {
    this.getFavMoviesService.getFavoriteMovies(this.user.username).subscribe({
      next: (res: string[]) => {
        this.movieIDs = res;

        this.getMoviesService.getAllMovies().subscribe({
          next: (res: MovieList) => {
            this.movieList = res;
            this.movieIDs.forEach((id: string) => {
              let movie = this.movieList.movies.find(
                (movie: MovieResponse) => movie.id === id
              );
              if (movie) {
                movie.favorite = true;
                this.favoriteList.movies.push(movie);
              }
            });
          },
        });
      },
      error: (result) => {
        this.snackBar.open(result, 'OK', {
          duration: 2000,
        });
      },
    });
  }

  /**
   * Adds a movie to the user's list of favorite movies.
   * @param movie - The movie to be added to favorites.
   */
  addFavoriteMovie(movie: MovieResponse): void {
    if (localStorage.getItem('user')) {
      this.addFavoriteService
        .addFavoriteMovie(localStorage.getItem('user')!, movie.id)
        .subscribe({
          next: (resp) => {
            movie.favorite = true;
          },
        });
    }
  }

  /**
   * Removes a movie from the user's list of favorite movies.
   * @param movie - The movie to be removed from favorites.
   */
  removeFavoriteMovie(movie: MovieResponse): void {
    if (localStorage.getItem('user')) {
      this.removeFavoriteService
        .deleteFavoriteMovie(localStorage.getItem('user')!, movie.id)
        .subscribe({
          next: (resp) => {
            movie.favorite = false;
          },
        });
    }
  }

  /**
   * Navigates to the genre information page.
   * @param genreName - The name of the genre to navigate to.
   */
  goToGenreInfo(genreName: string): void {
    this.router.navigate(['genres', genreName]);
  }

  /**
   * Navigates to the director information page.
   * @param directorName - The name of the director to navigate to.
   */
  goToDirectorInfo(directorName: string): void {
    this.router.navigate(['directors', directorName]);
  }

  /**
   * Navigates to the movie information page.
   * @param movieTitle - The title of the movie to navigate to.
   */
  goToMovieInfo(movieTitle: string): void {
    this.router.navigate(['movies', movieTitle]);
  }
}
