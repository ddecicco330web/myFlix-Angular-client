import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Director, GetDirectorService } from '../fetch-api-data.service';

@Component({
  selector: 'app-director-info',
  templateUrl: './director-info.component.html',
  styleUrls: ['./director-info.component.scss'],
})
export class DirectorInfoComponent implements OnInit {
  directorInfo: Director;

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

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        this.directorInfo.name = params['director'];
      },
    });

    this.getDirector();
  }

  getDirector(): void {
    this.fetchApiData.getDirector(this.directorInfo.name).subscribe({
      next: (res: Director) => {
        this.directorInfo = res;
      },
    });
  }
}
