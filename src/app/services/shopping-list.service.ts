import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Ingredient } from '../models/ingredient.model';
import { Subject } from 'rxjs/Subject'

@Injectable()
export class ShoppingListService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private serverUrl = environment.serverUrl + '/shopping-list'; // URL to web api
  private ingredients: Ingredient[] = [];
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  //
  //
  //
  constructor(private http: Http) { }

  //
  //
  //
  public getIngredients(): Promise<Ingredient[]> {
    console.log('items ophalen van server');
    return this.http.get(this.serverUrl, { headers: this.headers })
      .toPromise()
      .then(response => {
        console.dir(response.json());
        this.ingredients = response.json() as Ingredient[];
        return this.ingredients;
      })
      .catch(error => {
        return this.handleError(error);
      });
  }

  public getIngredient(index: number):Promise<Ingredient> {
    console.log('ingredient ophalen met id');
    return this.http.get(this.serverUrl + '/' + this.ingredients[index]._id, { headers: this.headers } )
      .toPromise()
      .then(response => {
          console.dir(response.json());
          return response.json() as Ingredient;
      })
      .catch( error => {
          return this.handleError(error);
      });
}

  public addIngredient(ingredient: Ingredient) {
      console.log('ingredient opslaan');
      this.http.post(this.serverUrl, { name: ingredient.name, amount: ingredient.amount })
        .toPromise()
        .then( () => {
          console.log("ingredient toegevoegd")
          this.getIngredients()
          .then(
            ingredients => {
              this.ingredients = ingredients
              this.ingredientsChanged.next(this.ingredients.slice());
            }
          )
          .catch(error => console.log(error));
        }
        )
        .catch( error => { return this.handleError(error) } );
  }

  public updateIngredient(index: number, newIngredient : Ingredient){
    console.log("ingredient updaten");
    this.http.put(this.serverUrl + "/" + this.ingredients[index]._id, { name: newIngredient.name, amount: newIngredient.amount })
      .toPromise()
      .then( () => {
        console.log("ingredient veranderd")
        this.getIngredients()
        .then(
          ingredients => {
            this.ingredients = ingredients
            this.ingredientsChanged.next(this.ingredients.slice());
          }
        )
        .catch(error => console.log(error));
      })
      .catch( error => { return this.handleError(error) } );
  }

  public deleteIngredient(index: number){
    console.log("ingredient updaten");
    this.http.delete(this.serverUrl + "/" + this.ingredients[index]._id)
      .toPromise()
      .then( () => {
        console.log("ingredient verwijderd")
        this.getIngredients()
        .then(
          ingredients => {
            this.ingredients = ingredients
            this.ingredientsChanged.next(this.ingredients.slice());
          }
        )
        .catch(error => console.log(error));
      })
      .catch( error => { return this.handleError(error) } );
  }

  //
  //
  //
  private handleError(error: any): Promise<any> {
    console.log('handleError');
    return Promise.reject(error.message || error);
  }

}
