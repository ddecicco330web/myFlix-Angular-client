import { Component, OnInit, Input } from '@angular/core';
import {
  GetUserService,
  User,
  EditUserService,
  GetFavortieMoviesService,
  GetAllMoviesService,
  MovieList,
  MovieResponse,
  GENRE_TYPES,
} from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    public getMoviesService: GetAllMoviesService
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
              if (movie) this.favoriteList.movies.push(movie);
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
}
