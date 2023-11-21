import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Director, GetDirectorService } from '../fetch-api-data.service';

/**
 * @description Component representing the detailed information about a specific movie director.
 */
@Component({
  selector: 'app-director-info',
  templateUrl: './director-info.component.html',
  styleUrls: ['./director-info.component.scss'],
})
export class DirectorInfoComponent implements OnInit {
  /**
   * Information about the movie director, including name, biography, birth year, and image path.
   */
  directorInfo: Director;

  /**
   * Constructor of the DirectorInfoComponent.
   * @param route - The activated route for retrieving route parameters.
   * @param fetchApiData - Service for fetching movie director information.
   */
  constructor(
    public route: ActivatedRoute,
    public fetchApiData: GetDirectorService
  ) {
    this.directorInfo = {
      name: '',
      bio: '',
      birthYear: '',
      imgPath: '',
    };
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties.
   * Retrieves the director name from route parameters and fetches director information.
   */
  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        this.directorInfo.name = params['director'];
      },
    });

    this.getDirector();
  }

  /**
   * Fetches detailed information about the movie director.
   */
  getDirector(): void {
    this.fetchApiData.getDirector(this.directorInfo.name).subscribe({
      next: (res: Director) => {
        this.directorInfo = res;
      },
    });
  }
}
