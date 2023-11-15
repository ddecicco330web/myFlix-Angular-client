import { Component, OnInit } from '@angular/core';
import { GetAllMoviesService, MovieList } from '../fetch-api-data.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movieList: MovieList = { movies: [] };

  constructor(public fetchMovies: GetAllMoviesService) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchMovies.getAllMovies().subscribe({
      next: (resp: MovieList) => {
        this.movieList = resp;
        return this.movieList;
      },
    });
  }
}
