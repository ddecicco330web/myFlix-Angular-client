import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://my-flix330.herokuapp.com/';

export enum GENRE_TYPES {
  ACTION = 'Action',
  DRAMA = 'Drama',
  COMEDY = 'Comedy',
  HORROR = 'Horror',
  THRILLER = 'Thriller',
}

export interface MovieResponse {
  id: string;
  title: string;
  genre: GENRE_TYPES;
  director: string;
  cast: string[];
  imgPath: string;
  description: string;
  releaseYear: string;
  favorite: boolean;
}

export interface MovieList {
  movies: MovieResponse[];
}

export interface User {
  id: string;
  username: string;
  eMail: string;
  birthday: string;
}

export interface Genre {
  name: string;
  description: string;
}

export interface Director {
  name: string;
  bio: string;
  birthYear: string;
  imgPath: string;
}
////////////////////////////// GET //////////////////////////////

/////////////// GET ALL MOVIES ///////////////
@Injectable({
  providedIn: 'root',
})
export class GetAllMoviesService {
  constructor(private http: HttpClient) {}

  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        map((res: any) => this.extractResponseData(res)),
        catchError(this.handleError)
      );
  }
  // Non-typed response extraction
  private extractResponseData(res: any): MovieList {
    const movies: MovieList = {
      movies: res.map((movie: any) => {
        const date: Date = new Date(movie.ReleaseYear[0]);
        const formatedDate: string =
          date.getUTCFullYear().toString().padStart(2, '0') +
          '-' +
          (date.getUTCMonth() + 1).toString().padStart(2, '0') +
          '-' +
          date.getUTCDate().toString().padStart(2, '0');
        const ret: MovieResponse = {
          id: movie._id,
          title: movie.Title,
          genre: movie.Genre.Name,
          director: movie.Director[0]?.Name,
          cast: movie.Actors,
          imgPath: movie.ImagePath,
          description: movie.Description,
          releaseYear: formatedDate,
          favorite: false,
        };

        return ret;
      }),
    };
    return movies || [];
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError(() => 'Something bad happened; please try again later.');
  }
}

/////////////// GET ONE MOVIE ///////////////
@Injectable({
  providedIn: 'root',
})
export class GetOneMovieService {
  constructor(private http: HttpClient) {}

  public getOneMovie(id: string): Observable<MovieResponse> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/' + id, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      ) as Observable<MovieResponse>;
  }
  // Non-typed response extraction
  private extractResponseData(res: any): MovieResponse {
    const date: Date = new Date(res.ReleaseYear[0]);
    const formatedDate: string =
      date.getUTCFullYear().toString().padStart(2, '0') +
      '-' +
      (date.getUTCMonth() + 1).toString().padStart(2, '0') +
      '-' +
      date.getUTCDate().toString().padStart(2, '0');

    const body: MovieResponse = {
      id: res._id,
      title: res.Title,
      genre: res.Genre.Name,
      director: res.Director[0].Name,
      releaseYear: formatedDate,
      cast: res.Actors,
      description: res.Description,
      imgPath: res.ImagePath,
      favorite: false,
    };
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError(() => 'Something bad happened; please try again later.');
  }
}

/////////////// GET DIRECTOR ///////////////
@Injectable({
  providedIn: 'root',
})
export class GetDirectorService {
  constructor(private http: HttpClient) {}

  public getDirector(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/directors/' + name, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }
  // Non-typed response extraction
  private extractResponseData(res: any): Director {
    const date: Date = new Date(res[0].BirthYear);
    const formatedDate: string =
      date.getUTCFullYear().toString().padStart(2, '0') +
      '-' +
      (date.getUTCMonth() + 1).toString().padStart(2, '0') +
      '-' +
      date.getUTCDate().toString().padStart(2, '0');

    const body: Director = {
      name: res[0].Name,
      bio: res[0].Bio,
      birthYear: formatedDate,
      imgPath: res[0].ImagePath,
    };
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError(() => 'Something bad happened; please try again later.');
  }
}

/////////////// GET GENRE ///////////////
@Injectable({
  providedIn: 'root',
})
export class GetGenreService {
  constructor(private http: HttpClient) {}

  public getGenre(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/genres/' + name, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }
  // Non-typed response extraction
  private extractResponseData(res: any): Genre {
    const body: Genre = {
      name: res.Name,
      description: res.Description,
    };
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError(() => 'Something bad happened; please try again later.');
  }
}

/////////////// GET USER ///////////////
@Injectable({
  providedIn: 'root',
})
export class GetUserService {
  constructor(private http: HttpClient) {}

  public getUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'users/' + username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }
  // Non-typed response extraction
  private extractResponseData(res: any): User {
    if (!res) {
      const empty: User = {
        id: '',
        username: '',
        eMail: '',
        birthday: '',
      };
      return empty;
    }
    const date: Date = new Date(res.Birthday);
    const formatedDate: string =
      date.getUTCFullYear().toString().padStart(2, '0') +
      '-' +
      (date.getUTCMonth() + 1).toString().padStart(2, '0') +
      '-' +
      date.getUTCDate().toString().padStart(2, '0');

    const body: User = {
      id: res._id,
      username: res.Username,
      eMail: res.Email,
      birthday: formatedDate,
    };
    return body;
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError(() => 'Something bad happened; please try again later.');
  }
}

/////////////// GET FAVORITE MOVIE ///////////////

@Injectable({
  providedIn: 'root',
})
export class GetFavortieMoviesService {
  constructor(private http: HttpClient) {}

  public getFavoriteMovies(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'users/' + username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }
  // Non-typed response extraction
  private extractResponseData(res: any): string[] {
    console.log(res);
    let movieIDs: string[] = res.FavoriteMovies;
    return movieIDs || [];
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError(() => 'Unable to get movie list');
  }
}

////////////////////////////// POST //////////////////////////////

/////////////// USER REGISTRATION ///////////////
@Injectable({
  providedIn: 'root',
})
export class UserRegistrationService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}
  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    userDetails.Birthday = new Date(userDetails.Birthday);
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError(() => 'Something bad happened; please try again later.');
  }
}

/////////////// USER LOGIN ///////////////
@Injectable({
  providedIn: 'root',
})
export class UserLoginService {
  constructor(private http: HttpClient) {}

  public userLogin(username: string, password: string): Observable<any> {
    return this.http
      .post(
        apiUrl + 'login?Username=' + username + '&Password=' + password,
        null
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError(() => 'Something bad happened; please try again later.');
  }
}

/////////////// ADD FAVORITE MOVIE ///////////////
@Injectable({
  providedIn: 'root',
})
export class AddFavoriteMovieService {
  constructor(private http: HttpClient) {}

  public addFavoriteMovie(username: string, movieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .post(
        apiUrl + 'users/' + username + '/movies/' + movieID,
        {},
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError(() => 'Something bad happened; please try again later.');
  }
}

////////////////////////////// PUT //////////////////////////////

/////////////// EDIT USER ///////////////
@Injectable({
  providedIn: 'root',
})
export class EditUserService {
  constructor(private http: HttpClient) {}

  public editUser(
    originalUsername: string,
    userData: User,
    password: string
  ): Observable<any> {
    const token = localStorage.getItem('token');
    const userInfo = {
      Username: userData.username,
      Password: password,
      Email: userData.eMail,
      Birthday: userData.birthday,
    };
    return this.http
      .put(apiUrl + 'users/' + originalUsername, userInfo, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError(() => 'Something bad happened; please try again later.');
  }
}

////////////////////////////// DELETE //////////////////////////////

/////////////// DELETE USER ///////////////
@Injectable({
  providedIn: 'root',
})
export class DeleteUserService {
  constructor(private http: HttpClient) {}

  public deleteUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + 'users/' + username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
        responseType: 'text' as 'json',
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): any {
    console.log(error);
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError(() => 'Something bad happened; please try again later.');
  }
}

/////////////// DELETE FAVORITE MOVIE ///////////////
@Injectable({
  providedIn: 'root',
})
export class DeleteFavoriteMovieService {
  constructor(private http: HttpClient) {}

  public deleteFavoriteMovie(
    username: string,
    movieID: string
  ): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + 'users/' + username + '/movies/' + movieID, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError(() => 'Something bad happened; please try again later.');
  }
}
