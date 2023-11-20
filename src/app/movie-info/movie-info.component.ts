import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  MovieResponse,
  GetOneMovieService,
  GENRE_TYPES,
} from '../fetch-api-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.scss'],
})
export class MovieInfoComponent implements OnInit {
  movieInfo: MovieResponse;

  constructor(
    public route: ActivatedRoute,
    public fetchApiData: GetOneMovieService,
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
      },
    });

    this.getMovieInfo();
  }

  getMovieInfo(): void {
    this.fetchApiData.getOneMovie(this.movieInfo.title).subscribe({
      next: (res: MovieResponse) => {
        this.movieInfo = res;
      },
    });
  }

  goToGenreInfo(genreName: string): void {
    this.router.navigate(['genres', genreName]);
  }

  goToDirectorInfo(directorName: string): void {
    this.router.navigate(['directors', directorName]);
  }
}
