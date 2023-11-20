import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Genre, GetGenreService } from '../fetch-api-data.service';

@Component({
  selector: 'app-genre-info-component',
  templateUrl: './genre-info-component.component.html',
  styleUrls: ['./genre-info-component.component.scss'],
})
export class GenreInfoComponentComponent implements OnInit {
  genreInfo: Genre;

  constructor(
    public route: ActivatedRoute,
    public fetchApiData: GetGenreService
  ) {
    this.genreInfo = {
      name: '',
      description: '',
    };
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        this.genreInfo.name = params['genre'];
      },
    });

    this.getGenre();
  }

  getGenre(): void {
    this.fetchApiData.getGenre(this.genreInfo.name).subscribe({
      next: (res: Genre) => {
        this.genreInfo = res;
      },
    });
  }
}
