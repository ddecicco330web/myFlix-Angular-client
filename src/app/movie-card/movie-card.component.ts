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

/**
 * @description Component representing a grid of movie cards displaying basic information about each movie.
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  /**
   * Object containing a list of movies to be displayed.
   */
  movieList: MovieList = { movies: [] };

  /**
   * List of movie IDs that the user has marked as favorites.
   */
  favoriteIDList: string[] = [];

  /**
   * Constructor of the MovieCardComponent.
   * @param fetchMovies - Service for fetching a list of all movies.
   * @param router - Angular router service for navigation.
   * @param fetchFavorites - Service for fetching the user's favorite movies.
   * @param addFavoriteService - Service for adding a movie to the user's favorites.
   * @param removeFavoriteService - Service for removing a movie from the user's favorites.
   */
  constructor(
    public fetchMovies: GetAllMoviesService,
    public router: Router,
    public fetchFavorites: GetFavortieMoviesService,
    public addFavoriteService: AddFavoriteMovieService,
    public removeFavoriteService: DeleteFavoriteMovieService
  ) {}

  /**
   * Lifecycle hook called after the component is initialized.
   * Calls the method to fetch the list of movies.
   */
  ngOnInit(): void {
    this.getMovies();
  }

  /**
   * Fetches a list of all movies and the user's favorite movies.
   */
  getMovies(): void {
    this.fetchMovies.getAllMovies().subscribe({
      next: (resp: MovieList) => {
        this.movieList = resp;
        this.getFavorites();
        return this.movieList;
      },
    });
  }

  /**
   * Fetches the user's favorite movies and updates the movieList.favorite property.
   */
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

  /**
   * Adds a movie to the user's favorites.
   * @param {MovieResponse} movie - The movie to be added to favorites.
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
   * Removes a movie from the user's favorites.
   * @param {MovieResponse} movie - The movie to be removed from favorites.
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
   * @param {string} genreName - The name of the genre to navigate to.
   */
  goToGenreInfo(genreName: string): void {
    this.router.navigate(['genres', genreName]);
  }

  /**
   * Navigates to the director information page.
   * @param {string} directorName - The name of the director to navigate to.
   */
  goToDirectorInfo(directorName: string): void {
    this.router.navigate(['directors', directorName]);
  }

  /**
   * Navigates to the detailed information page of a specific movie.
   * @param {string} movieTitle - The title of the movie to navigate to.
   */
  goToMovieInfo(movieTitle: string): void {
    this.router.navigate(['movies', movieTitle]);
  }
}
