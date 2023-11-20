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

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.scss'],
})
export class MovieInfoComponent implements OnInit {
  movieInfo: MovieResponse;
  favoriteIDList: string[] = [];

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

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        this.movieInfo.title = params['movieTitle'];
        this.getMovieInfo();
      },
    });
  }

  getMovieInfo(): void {
    this.fetchApiData.getOneMovie(this.movieInfo.title).subscribe({
      next: (res: MovieResponse) => {
        this.movieInfo = res;
        this.getFavorites();
      },
    });
  }

  goToGenreInfo(genreName: string): void {
    this.router.navigate(['genres', genreName]);
  }

  goToDirectorInfo(directorName: string): void {
    this.router.navigate(['directors', directorName]);
  }

  getFavorites(): void {
    if (localStorage.getItem('user')) {
      this.fetchFavorites
        .getFavoriteMovies(localStorage.getItem('user')!)
        .subscribe({
          next: (resp) => {
            this.favoriteIDList = resp;
            console.log(this.movieInfo);
            console.log(this.favoriteIDList);

            const movie = this.favoriteIDList.find(
              (id: string) => id === this.movieInfo.id
            );
            if (movie) {
              console.log('true');
              this.movieInfo.favorite = true;
            } else console.log('false');
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
}
