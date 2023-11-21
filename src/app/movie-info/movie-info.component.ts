import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  MovieResponse,
  GetOneMovieService,
  GENRE_TYPES,
  GetFavortieMoviesService,
  AddFavoriteMovieService,
  DeleteFavoriteMovieService,
} from '../fetch-api-data.service';
import { Router } from '@angular/router';

/**
 * @description Component representing the detailed information of a movie.
 */
@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.scss'],
})
export class MovieInfoComponent implements OnInit {
  /**
   * Object containing information about the movie.
   */
  movieInfo: MovieResponse;

  /**
   * List of movie IDs that the user has marked as favorites.
   */
  favoriteIDList: string[] = [];

  /**
   * Constructor of the MovieInfoComponent.
   * @param route - ActivatedRoute service for accessing route parameters.
   * @param fetchApiData - Service for fetching information about a single movie.
   * @param fetchFavorites - Service for fetching the user's favorite movies.
   * @param addFavoriteService - Service for adding a movie to the user's favorites.
   * @param removeFavoriteService - Service for removing a movie from the user's favorites.
   * @param router - Angular router service for navigation.
   */
  constructor(
    public route: ActivatedRoute,
    public fetchApiData: GetOneMovieService,
    public fetchFavorites: GetFavortieMoviesService,
    public addFavoriteService: AddFavoriteMovieService,
    public removeFavoriteService: DeleteFavoriteMovieService,
    public router: Router
  ) {
    this.movieInfo = {
      id: '',
      title: '',
      genre: GENRE_TYPES.ACTION,
      director: '',
      cast: [],
      imgPath: '',
      description: '',
      releaseYear: '',
      favorite: false,
    };
  }

  /**
   * Lifecycle hook called after the component is initialized.
   * Subscribe to route parameters to get the movie title and fetch movie information.
   */
  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        this.movieInfo.title = params['movieTitle'];
        this.getMovieInfo();
      },
    });
  }

  /**
   * Fetches detailed information about the movie.
   * Updates the movieInfo object and fetches the user's favorite movies.
   */
  getMovieInfo(): void {
    this.fetchApiData.getOneMovie(this.movieInfo.title).subscribe({
      next: (res: MovieResponse) => {
        this.movieInfo = res;
        this.getFavorites();
      },
    });
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
   * Fetches the user's favorite movies and updates the movieInfo.favorite property.
   */
  getFavorites(): void {
    if (localStorage.getItem('user')) {
      this.fetchFavorites
        .getFavoriteMovies(localStorage.getItem('user')!)
        .subscribe({
          next: (resp) => {
            this.favoriteIDList = resp;

            const movie = this.favoriteIDList.find(
              (id: string) => id === this.movieInfo.id
            );
            if (movie) {
              this.movieInfo.favorite = true;
            }
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
}
