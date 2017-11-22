import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Recipe } from '../models/recipe.model';

@Injectable()
export class RecipeService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private serverUrl = environment.serverUrl + '/recipes'; // URL to web api
  private recipes: Recipe[] = [];

  //
  //
  //
  constructor(private http: Http) { }

  //
  //
  //
  public getRecipes(): Promise<Recipe[]> {
    console.log('items ophalen van server');
    return this.http.get(this.serverUrl, { headers: this.headers })
      .toPromise()
      .then(response => {
        console.dir(response.json());
        return response.json() as Recipe[];
      })
      .catch(error => {
        return this.handleError(error);
      });
  }

  public getRecipe(id:String):Promise<Recipe> {
      console.log('recipe ophalen met id');
      return this.http.get(this.serverUrl+ '/' + id, { headers: this.headers })
        .toPromise()
        .then(response => {
            console.dir(response.json());
            return response.json() as Recipe;
        })
        .catch( error => {
            return this.handleError(error);
        });
  }

  //
  //
  //
  private handleError(error: any): Promise<any> {
    console.log('handleError');
    return Promise.reject(error.message || error);
  }

}
