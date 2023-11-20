import { Component, OnInit } from '@angular/core';
import {
  GetAllMoviesService,
  MovieList,
  GetFavortieMoviesService,
  MovieResponse,
  AddFavoriteMovieService,
  DeleteFavoriteMovieService,
} from '../fetch-api-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movieList: MovieList = { movies: [] };
  favoriteIDList: string[] = [];

  constructor(
    public fetchMovies: GetAllMoviesService,
    public router: Router,
    public fetchFavorites: GetFavortieMoviesService,
    public addFavoriteService: AddFavoriteMovieService,
    public removeFavoriteService: DeleteFavoriteMovieService
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchMovies.getAllMovies().subscribe({
      next: (resp: MovieList) => {
        this.movieList = resp;
        this.getFavorites();
        return this.movieList;
      },
    });
  }

  getFavorites(): void {
    if (localStorage.getItem('user')) {
      this.fetchFavorites
        .getFavoriteMovies(localStorage.getItem('user')!)
        .subscribe({
          next: (resp) => {
            this.favoriteIDList = resp;
            this.favoriteIDList.forEach((id: string) => {
              const currMovie = this.movieList.movies.find(
                (m: MovieResponse) => m.id === id
              );

              if (currMovie) currMovie.favorite = true;
            });
          },
        });
    }
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
