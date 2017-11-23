import { Component, OnInit, OnDestroy } from '@angular/core';

import { Ingredient } from '../../models/ingredient.model';
import { ShoppingListService } from '../../services/shopping-list.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private subscription : Subscription;
  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.slService.getIngredients()
      .then((ingredients) => {
        this.ingredients = ingredients
        this.subscription = this.slService.ingredientsChanged
        .subscribe(
        (ingredients: Ingredient[]) => {
          this.ingredients = ingredients;
        });
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
