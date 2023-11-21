import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import {
  UserRegistrationService,
  UserLoginService,
} from './fetch-api-data.service';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from './user-login-form/user-login-form.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { HeaderComponent } from './header/header.component';
import { GenreInfoComponentComponent } from './genre-info-component/genre-info-component.component';
import { DirectorInfoComponent } from './director-info/director-info.component';
import { MovieInfoComponent } from './movie-info/movie-info.component';

/**
 * Defines the routes for the application.
 */
const appRoutes: Routes = [
  { path: 'welcome', component: WelcomePageComponent },
  { path: 'movies', component: MovieCardComponent },
  { path: 'userProfile', component: UserProfileComponent },
  { path: 'genres/:genre', component: GenreInfoComponentComponent },
  { path: 'directors/:director', component: DirectorInfoComponent },
  { path: 'movies/:movieTitle', component: MovieInfoComponent },
  { path: '', redirectTo: 'welcome', pathMatch: 'prefix' },
];

/**
 * Main application module that manages dependencies, components, and routes.
 */
@NgModule({
  declarations: [
    AppComponent,
    UserRegistrationFormComponent,
    UserLoginFormComponent,
    MovieCardComponent,
    WelcomePageComponent,
    UserProfileComponent,
    HeaderComponent,
    GenreInfoComponentComponent,
    DirectorInfoComponent,
    MovieInfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    MatIconModule,
    MatMenuModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [UserRegistrationService, UserLoginService],
  bootstrap: [AppComponent],
})
export class AppModule {}
