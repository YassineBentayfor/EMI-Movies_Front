import { Injectable } from '@angular/core';
import { Film } from "../Model/film";
import {HttpClient} from "@angular/common/http";
import {forkJoin, map, mergeMap, Observable, of, toArray} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class FilmService {
  constructor(private http: HttpClient) { }

  baseurl = "https://api.themoviedb.org/3/discover/movie";
  apikey = "4722616a8836f0b929a9cb3a04f6a6a4";

  secondBaseUrl="http://localhost:9999/Commentaire"
  private favoritesUrl = 'http://localhost:9999/api';

  number_page:number=100;

  extractMovieIdsFromFavorites(favoriteMovies: any[]): number[] {
    return favoriteMovies.map((favorite) => favorite.movieId);
  }
  // Get favorite movie IDs
  getFavoriteMovieIds(): Observable<number[]> {
    return this.http.get<any[]>(`${this.favoritesUrl}/favorite`).pipe(
      map((response: any[]) => {
        console.log('Received favorite movies:', response);

        const movieIds = this.extractMovieIdsFromFavorites(response);
        console.log('Extracted movie IDs:', movieIds);

        return movieIds; // Return extracted movie IDs
      })
    );
  }
  getFavoriteMovieIdsByEmail(email: string): Observable<number[]> {
    return this.http.get<any[]>(`${this.favoritesUrl}/favorite/${email}`).pipe(
      map((response: any[]) => {
        console.log('Received favorite movie IDs for email', email, ':', response);

        const movieIds: number[] = response.map(movie => movie.movieId);
        console.log('Extracted movie IDs:', movieIds);

        return movieIds; // Return extracted movie IDs associated with the email
      })
    );
  }


  // Add a movie to favorites
  addFavoriteMovie(movieId: number, email: string): Observable<any> {
    return this.http.post<any>(`${this.favoritesUrl}/add/${movieId}/${email}`, {});
  }


  // Remove a movie from favorites
  removeFavoriteMovie(id: number): Observable<any> {
    return this.http.delete<any>(`${this.favoritesUrl}/delete/${id}`);
  }





  getCommentaire():Observable<any>{
    return this.http.get<any>(`${this.secondBaseUrl}/commentaires`)
  }
  getCommentaireFiltred(idFilm:number):Observable<any>{
    return this.http.get<any>(`${this.secondBaseUrl}/find/${idFilm}`)
  }
  addComment(commentData: any): Observable<any> {
    return this.http.post<any>(`${this.secondBaseUrl}/add`, commentData);
  }
  deleteComment(id:number): Observable<any> {
    return this.http.delete<any>(`${this.secondBaseUrl}/delete/${id}`);
  }








  getPopularMovies(): Observable<any> {
    const requests: Observable<any>[] = [];

    // Iterate over the first 8 pages
    for (let page = 1; page <= this.number_page; page++) {
      const request = this.http.get<any>(`${this.baseurl}?api_key=${this.apikey}&page=${page}`);
      requests.push(request);
    }

    // Use forkJoin to make parallel requests and combine results
    return forkJoin(requests);
  }

  //######################################""



  //######################################""


  getPopularMoviesById(id: number): Observable<any> {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${this.apikey}`;
    return this.http.get<any>(url);

  }
  getimagefromapi( poster_path: string){
    return 'https://image.tmdb.org/t/p/w300' + poster_path
  }
  searchMovies(moviePrefix: string): Observable<any> {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${this.apikey}&language=en-US&query=${moviePrefix}%20&page=1&include_adult=true`
    return this.http.get<any>(url).pipe(map((res: any) => res.results))
  }










}



