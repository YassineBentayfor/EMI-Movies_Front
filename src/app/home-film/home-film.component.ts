import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Film} from "../Model/film";
import {FilmService} from "../Service/film.service";
import {DetailsComponent} from "../details/details.component";
import {RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {findLastMappingIndexBefore} from "@angular/compiler-cli/src/ngtsc/sourcemaps/src/source_file";
import {UsersloginService} from "../Service/users.login.service";


@Component({
  selector: 'app-home-film',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './home-film.component.html',
  styleUrl: './home-film.component.css'
})
export class HomeFilmComponent {
  @Input() film!: Film;
  @Output() favoriteRemoved: EventEmitter<number> = new EventEmitter<number>();

  constructor(private filmService: FilmService, private userService: UsersloginService) { }

  ngOnInit(): void {
    this.checkFavoriteStatus(this.film);
  }

  getUrl(name: any) {
    return this.filmService.getimagefromapi(name);
  }

  toggleFavorite(film: Film) {
    film.favorite = !film.favorite;

    const userEmail = this.userService.getEmailFromLocalStorage(); // Assuming this method gets the user's email

    if (film.favorite) {
      this.filmService.addFavoriteMovie(film.id, userEmail).subscribe(
        () => {
          console.log('Movie added to favorites:', film.id);
          // Handle success if needed
        },
        (error) => {
          console.error('Error adding movie to favorites:', error);
          // Handle error if needed
        }
      );
    } else {
      this.filmService.removeFavoriteMovie(film.id).subscribe(
        () => {
          console.log('Movie removed from favorites: AAAAAAAAAAAA', film.id);
          this.favoriteRemoved.emit(film.id); // Emit event for favorite removal
          // Handle success if needed
        },
        (error) => {
          console.error('Error removing movie from favorites:', error);
          // Handle error if needed
        }
      );
    }
  }

  checkFavoriteStatus(film: Film) {
    const userEmail = this.userService.getEmailFromLocalStorage(); // Get user's email from local storage

    if (userEmail) {
      this.filmService.getFavoriteMovieIdsByEmail(userEmail).subscribe(
        (favoriteMovieIds: number[]) => {
          if (favoriteMovieIds.includes(film.id)) {
            film.favorite = true; // Movie is already a favorite
          } else {
            film.favorite = false; // Movie is not a favorite
          }
        },
        (error) => {
          console.error('Error retrieving favorite movie IDs:', error);
          // Handle error if needed
        }
      );
    } else {
      film.favorite = false; // No user logged in, set favorite to false
    }
  }


  // Optionally, you can implement a method to check if the movie is a favorite and set isFavorite accordingly
  // checkFavoriteStatus() {
  //   this.filmService.getFavoriteMovieIds().subscribe(
  //     (favoriteMovieIds: number[]) => {
  //       this.isFavorite = favoriteMovieIds.includes(this.film.id);
  //     },
  //     (error) => {
  //       console.error('Error retrieving favorite movie IDs:', error);
  //       // Handle error if needed
  //     }
  //   );
  // }



}
