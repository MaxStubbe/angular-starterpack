import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Recipe } from '../models/recipe.model';
import { Ingredient } from '../models/ingredient.model';

@Injectable()
export class RecipeService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private serverUrl = environment.serverUrl + '/recipes'; // URL to web api
  private ingredientsUrl = environment.serverUrl + '/shopping-list'; //URL naar ingredients
  private recipes: Recipe[] = [];

  recipesChanged = new Subject<Recipe[]>();

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
        this.recipes = response.json() as Recipe[];
        return this.recipes;
      })
      .catch(error => {
        return this.handleError(error);
      });
  }

  public getRecipe(index: number):Promise<Recipe> {
      console.log('recipe ophalen met id');
      return this.http.get(this.serverUrl + '/' + this.recipes[index]._id, { headers: this.headers })
        .toPromise()
        .then(response => {
            console.dir(response.json());
            return response.json() as Recipe;
        })
        .catch( error => {
            return this.handleError(error);
        });
  }

  public addRecipe(recipe: Recipe) {
    console.log('recipe opslaan');
    this.http.post(this.serverUrl, { name: recipe.name, description: recipe.description, imagePath: recipe.imagePath, ingredients: recipe.ingredients})
      .toPromise()
      .then( () =>{
        console.log("recipe toegevoegd")
        this.getRecipes()
        .then(
          recipes => {
            this.recipes = recipes
            this.recipesChanged.next(this.recipes.slice());
          }
        )
        .catch(error => console.log(error));
      }
      )
      .catch( error => { return this.handleError(error) } );
      
      
  }

  public updateRecipe(index: number, newRecipe : Recipe){
    console.log("recipe updaten");
    
    this.http.put(this.serverUrl + "/" + this.recipes[index]._id, { name: newRecipe.name, description: newRecipe.description, imagePath: newRecipe.imagePath, ingredients: newRecipe.ingredients})
      .toPromise()
      .then( () => {
        console.log("recipe veranderd")
        this.getRecipes()
        .then(
          recipes => {
            this.recipes = recipes
            this.recipesChanged.next(this.recipes.slice());
          }
        )
        .catch(error => console.log(error));
    })
      .catch( error => { return this.handleError(error) } );
  }

  public deleteRecipe(index: number){
    console.log("recipe updaten");
    
    this.http.delete(this.serverUrl + "/" + this.recipes[index]._id)
      .toPromise()
      .then( () => {
        console.log("recipe verwijderd")
        this.getRecipes()
        .then(
          recipes => {
            this.recipes = recipes
            this.recipesChanged.next(this.recipes.slice());
          }
        )
        .catch(error => console.log(error));
    })
      .catch( error => { return this.handleError(error) } );
  }


  public addIngredientsToShoppingList(recipe: Recipe){
    console.log("voeg ingredienten toe");
    recipe.ingredients.forEach(ingredient => {
      this.http.post(this.ingredientsUrl, { name: ingredient.name, amount: ingredient.amount })
      .toPromise()
      .then( () =>
        console.log("ingredient toegevoegd")
      )
      .catch( error => { return this.handleError(error) } );
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
