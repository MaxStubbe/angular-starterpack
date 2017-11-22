import { Component, OnInit, ViewEncapsulation,Output,EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../../services/recipe.service';
import { Recipe } from '../../../models/recipe.model'

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[];

  constructor(private recipeService: RecipeService,
              private router: Router,
              private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.recipeService.getRecipes()
    .then(recipes => this.recipes = recipes)
    .catch(error => console.log(error));
  }

  onNewRecipe(){
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
