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

/**
 * @interface
 */
export enum GENRE_TYPES {
  ACTION = 'Action',
  DRAMA = 'Drama',
  COMEDY = 'Comedy',
  HORROR = 'Horror',
  THRILLER = 'Thriller',
}

/**
 * @interface
 */
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

/**
 * @interface
 */
export interface MovieList {
  movies: MovieResponse[];
}

/**
 * @interface
 */
export interface User {
  id: string;
  username: string;
  eMail: string;
  birthday: string;
}

/**
 * @interface
 */
export interface Genre {
  name: string;
  description: string;
}

/**
 * @interface
 */
export interface Director {
  name: string;
  bio: string;
  birthYear: string;
  imgPath: string;
}

export class FetchApiDataService {}
////////////////////////////// GET //////////////////////////////

/////////////// GET ALL MOVIES ///////////////
/**
 * Service to get all movies from the API.
 */
@Injectable({
  providedIn: 'root',
})
export class GetAllMoviesService {
  constructor(private http: HttpClient) {}

  /**
   * Retrieves all movies from the API.
   * @returns {Observable<any>} An Observable with a MovieList object.
   */
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
/**
 * Service to get details for a single movie from the API.
 */
@Injectable({
  providedIn: 'root',
})
export class GetOneMovieService {
  constructor(private http: HttpClient) {}

  /**
   * Retrieves details for a single movie from the API.
   * @param {string} id - The ID of the movie to retrieve.
   * @returns {Observable<any>} An Observable with a MovieResponse object.
   */
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
/**
 * Service to get details for a director from the API.
 */
@Injectable({
  providedIn: 'root',
})
export class GetDirectorService {
  constructor(private http: HttpClient) {}

  /**
   * Retrieves details for a director from the API.
   * @param {string} name - The name of the director to retrieve.
   * @returns {Observable<any>} An Observable with a Director object.
   */
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
/**
 * Service to get details for a genre from the API.
 */
@Injectable({
  providedIn: 'root',
})
export class GetGenreService {
  constructor(private http: HttpClient) {}

  /**
   * Retrieves details for a genre from the API.
   * @param {string} name - The name of the genre to retrieve.
   * @returns {Observable<any>} An Observable with a Genre object.
   */
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
/**
 * Service to get details for a user from the API.
 */
@Injectable({
  providedIn: 'root',
})
export class GetUserService {
  constructor(private http: HttpClient) {}

  /**
   * Retrieves details for a user from the API.
   * @param {string} username - The username of the user to retrieve.
   * @returns {Observable<any>} An Observable with a User object.
   */
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
/**
 * Service to get the list of favorite movies for a user from the API.
 */
@Injectable({
  providedIn: 'root',
})
export class GetFavortieMoviesService {
  constructor(private http: HttpClient) {}

  /**
   * Retrieves the list of favorite movies for a user from the API.
   * @param {string} username - The username of the user whose favorite movies to retrieve.
   * @returns {Observable<any>} An Observable with a string array of movie IDs.
   */
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
/**
 * Service for user registration.
 */
@Injectable({
  providedIn: 'root',
})
export class UserRegistrationService {
  constructor(private http: HttpClient) {}

  /**
   * Registers a new user.
   * @param {any} userDetails - Object containing user details.
   * @returns {Observable<any>} An Observable with the registration response.
   */
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
/**
 * Service for user login.
 */
@Injectable({
  providedIn: 'root',
})
export class UserLoginService {
  constructor(private http: HttpClient) {}

  /**
   * Logs in a user.
   * @param {string} username - The username of the user.
   * @param {string} password - The password of the user.
   * @returns {Observable<any>} An Observable with the login response.
   */
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
/**
 * Service for adding a movie to the user's favorite list.
 */
@Injectable({
  providedIn: 'root',
})
export class AddFavoriteMovieService {
  constructor(private http: HttpClient) {}

  /**
   * Adds a movie to the user's favorite list.
   * @param {string} username - The username of the user.
   * @param {string} movieID - The ID of the movie to add to the favorites.
   * @returns {Observable<any>} An Observable with the response.
   */
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
/**
 * Service for editing user details.
 */
@Injectable({
  providedIn: 'root',
})
export class EditUserService {
  constructor(private http: HttpClient) {}

  /**
   * Edits user details.
   * @param {string} originalUsername - The original username of the user.
   * @param {string} userData - Object containing updated user details.
   * @param {string} password - The password of the user.
   * @returns {Observable<any>} An Observable with the edit response.
   */
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
/**
 * Service for deleting a user.
 */
@Injectable({
  providedIn: 'root',
})
export class DeleteUserService {
  constructor(private http: HttpClient) {}

  /**
   * Deletes a user.
   * @param {string} username - The username of the user to delete.
   * @returns {Observable<any>} An Observable with the delete response.
   */
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
/**
 * Service for removing a movie from the user's favorite list.
 */
@Injectable({
  providedIn: 'root',
})
export class DeleteFavoriteMovieService {
  constructor(private http: HttpClient) {}

  /**
   * Removes a movie from the user's favorite list.
   * @param {String} username - The username of the user.
   * @param {string} movieID - The ID of the movie to remove from favorites.
   * @returns {Observable<any>} An Observable with the response.
   */
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
