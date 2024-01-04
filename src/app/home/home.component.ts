import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Film } from "../Model/film";
import { FilmService } from "../Service/film.service";
import {HomeFilmComponent} from "../home-film/home-film.component";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {FilmDetails} from "../Model/filmDetails";
import {forkJoin} from "rxjs";



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HomeFilmComponent,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  films!:Film[]
  filmsfiltred!:Film[]
  all_ids!:number[]
  id_gender: any[] = []; // Initialize id_gender as an empty array
  filmdetails!: FilmDetails;


  genres: string[] = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family',
    'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction',
    'Thriller', 'TV Movie', 'War', 'Western'
  ];

  selectedGenre: string = ''; // Initialize with an empty string or a default genre if needed

  constructor(private filmservice:FilmService) {
  }
  ngOnInit(): void {
    this.getAllDetails()
  }

  currentPage: number=1;
  getAllDetails() { // get all popular movie with all detail aller retour get
    this.filmservice.getPopularMovies().subscribe((data) => {
      this.films = data[this.currentPage-1].results;
      this.filmsfiltred = data[this.currentPage-1].results;
      this.all_ids = this.films.map(film => film.id);

      // Now that all_ids is defined, you can make the specific API call
      if (this.all_ids.length > 0) {
        const requests = this.all_ids.map(id => this.filmservice.getPopularMoviesById(id));

        forkJoin(requests).subscribe((results) => {
          results.forEach((result, index) => {
            this.id_gender.push({ "idfilm": this.all_ids[index], "genres": result.genres });
          });
        });
      }
    });
  }

  //scroll pages
  loadNextPage(): void {
    this.currentPage++;
    this.getAllDetails();
  }

  loadPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getAllDetails();
    }
  }


  filterResults(text: string) {
    if (!text) {
      this.filmsfiltred = this.films;
      return;
    }

    this.filmservice.searchMovies(text).subscribe((results) => {
      this.filmsfiltred = results;
    });
  }

  isFavorite: boolean = false;


}



