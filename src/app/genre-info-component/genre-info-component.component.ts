import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Genre, GetGenreService } from '../fetch-api-data.service';

/**
 * @description Component representing the detailed information about a specific movie genre.
 */
@Component({
  selector: 'app-genre-info-component',
  templateUrl: './genre-info-component.component.html',
  styleUrls: ['./genre-info-component.component.scss'],
})
export class GenreInfoComponentComponent implements OnInit {
  /**
   * Information about the movie genre, including its name and description.
   */
  genreInfo: Genre;

  /**
   * Constructor of the GenreInfoComponentComponent.
   * @param route - The activated route for retrieving route parameters.
   * @param fetchApiData - Service for fetching movie genre information.
   */
  constructor(
    public route: ActivatedRoute,
    public fetchApiData: GetGenreService
  ) {
    this.genreInfo = {
      name: '',
      description: '',
    };
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties.
   * Retrieves the genre name from route parameters and fetches genre information.
   */
  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        this.genreInfo.name = params['genre'];
      },
    });

    this.getGenre();
  }

  /**
   * Fetches detailed information about the movie genre.
   */
  getGenre(): void {
    this.fetchApiData.getGenre(this.genreInfo.name).subscribe({
      next: (res: Genre) => {
        this.genreInfo = res;
      },
    });
  }
}
