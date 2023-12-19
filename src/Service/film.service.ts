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
    return this.http.get<any>(`${this.baseurl}?api_key=${this.apikey}`);
  }


  getPopularMoviesById(id: number): Observable<any> {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${this.apikey}`;
    return this.http.get<any>(url);
    console.log(url)
  }
  getimagefromapi( poster_path: string){
    return 'https://image.tmdb.org/t/p/w300' + poster_path
  }
  searchMovies(moviePrefix: string): Observable<any> {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${this.apikey}&language=en-US&query=${moviePrefix}%20&page=1&include_adult=true`
    return this.http.get<any>(url).pipe(map((res: any) => res.results))
  }



  getAllMovies(): Observable<any[]> {
    const popularMoviesUrl = `${this.baseurl}?api_key=${this.apikey}&page=1`;

    return this.http.get<any>(popularMoviesUrl).pipe(
      mergeMap((initialResponse: any) => {
        const totalPages = initialResponse.total_pages;
        const requests = [];

        for (let page = 1; page <= totalPages; page++) {
          requests.push(this.http.get<any>(`${this.baseurl}?api_key=${this.apikey}&page=${page}`));
        }

        return forkJoin(requests);
      }),
      mergeMap((responses: any[]) => responses),
      map((response: any) => response.results),
      toArray()
    );
  }








}



