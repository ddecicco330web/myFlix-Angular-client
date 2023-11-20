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

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  @Input() user: User;
  @Input() password: string;

  originalUsername: string;
  movieIDs: string[];
  movieList: MovieList;
  favoriteList: MovieList;

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

  ngOnInit(): void {
    localStorage.getItem('user')
      ? (this.user.username = localStorage.getItem('user')!)
      : null;

    this.getUser();
    this.getFavoriteMovies();
  }

  getUser(): void {
    this.getUserService.getUser(this.user.username).subscribe({
      next: (res: User) => {
        this.user = res;
        this.originalUsername = this.user.username;
      },
    });
  }

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
          console.log(result);
          this.snackBar.open(result, 'OK', {
            duration: 2000,
          });
        },
      });
  }

  deleteUser(): void {
    const username = localStorage.getItem('user');

    if (username) {
      this.deleteUserService.deleteUser(username).subscribe({
        next: (resp) => {
          console.log('success');
          localStorage.clear();
          this.router.navigate(['welcome']);
        },
      });
    }
  }

  getFavoriteMovies(): void {
    this.getFavMoviesService.getFavoriteMovies(this.user.username).subscribe({
      next: (res: string[]) => {
        this.movieIDs = res;
        console.log(this.movieIDs);

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
        console.log(result);
        this.snackBar.open(result, 'OK', {
          duration: 2000,
        });
      },
    });
  }

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

  removeFavoriteMovie(movie: MovieResponse): void {
    console.log(movie.id, localStorage.getItem('token'));
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

  goToGenreInfo(genreName: string): void {
    this.router.navigate(['genres', genreName]);
  }

  goToDirectorInfo(directorName: string): void {
    this.router.navigate(['directors', directorName]);
  }

  goToMovieInfo(movieTitle: string): void {
    this.router.navigate(['movies', movieTitle]);
  }
}
