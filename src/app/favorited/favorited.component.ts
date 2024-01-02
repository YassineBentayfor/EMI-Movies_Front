import { Component, OnInit } from '@angular/core';
import { Film } from '../Model/film';
import { FilmService } from '../Service/film.service';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {forkJoin} from "rxjs";
import {HomeFilmComponent} from "../home-film/home-film.component";
import {NgFor} from "@angular/common";
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs';
import {UsersloginService} from "../Service/users.login.service";
import {FavoriteMovies} from "../Model/FavoriteMovies";


@Component({
  selector: 'app-favorited',
  templateUrl: './favorited.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    HomeFilmComponent,
    NgFor,
  ],
  styleUrls: ['./favorited.component.css']
})
export class FavoritedComponent implements OnInit {
  favoriteMovieIds: number[] = [];
  favoriteMovies: Film[] = [];


  constructor(private filmService: FilmService, private userService: UsersloginService) { }

  ngOnInit(): void {
    this.loadFavoriteMovies();
    console.log(this.favoriteMovies);
  }



  loadFavoriteMovies() {
    const userEmail: string = this.userService.getEmailFromLocalStorage(); // Retrieve user's email from the appropriate source (UserService or local storage)
    console.log('Fetching favorite movies for user with email:', userEmail);

    this.filmService.getFavoriteMovieIdsByEmail(userEmail).subscribe(
      (movieIds: number[]) => {
        console.log('Favorite movie IDs:', movieIds);
        const requests: Observable<any>[] = [];

        for (let i = 0; i < movieIds.length; i++) {
          const movieId = movieIds[i]; // Assuming the movieId field holds the ID
          console.log('Fetching details for movie ID:', movieId);

          const request = this.filmService.getPopularMoviesById(movieId);
          requests.push(request);
        }
        if (requests.length > 0) {
          forkJoin(requests).subscribe((movies: any[]) => {
            console.log('Favorite movies details:', movies);

            for (let i = 0; i < movies.length; i++) {
              this.favoriteMovies.push(movies[i]);
            }

            console.log(this.favoriteMovies); // Verify favoriteMovies array here
          }, error => {
            console.error('Error fetching favorite movies details:', error);
          });
        // You can handle/use the retrieved movie IDs as needed
      } else {
      console.log('No favorite movie IDs found.');
    }
  });
}




  loadFavoriteMoviessss() {
    console.log('Fetching favorite movie IDs...');
    this.filmService.getFavoriteMovieIds().subscribe((ids: any[]) => {
      console.log('Received favorite movie IDs:', ids);

      const requests: Observable<any>[] = [];

      for (let i = 0; i < ids.length; i++) {
        const movieId = ids[i]; // Assuming the movieId field holds the ID
        console.log('Fetching details for movie ID:', movieId);

        const request = this.filmService.getPopularMoviesById(movieId);
        requests.push(request);
      }

      if (requests.length > 0) {
        forkJoin(requests).subscribe((movies: any[]) => {
          console.log('Favorite movies details:', movies);

          for (let i = 0; i < movies.length; i++) {
            this.favoriteMovies.push(movies[i]);
          }

          console.log(this.favoriteMovies); // Verify favoriteMovies array here
        }, error => {
          console.error('Error fetching favorite movies details:', error);
        });
      } else {
        console.log('No favorite movie IDs found.');
      }
    });
  }



  onFavoriteRemoved(movieId: number) {
    console.log('Removing favorite movie with ID:', movieId);

    // Find the index of the movie to remove from the favoriteMovies array
    const indexToRemove = this.favoriteMovies.findIndex(movie => movie.id === movieId);

    if (indexToRemove !== -1) {
      // Remove the movie from the favoriteMovies array
      this.favoriteMovies.splice(indexToRemove, 1);
    }
  }












}
