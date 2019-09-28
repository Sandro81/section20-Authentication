import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import {RecipeService} from '../recipes/recipe.service';
import {Recipe} from '../recipes/recipe.model';
import {exhaust, exhaustMap, map, take, tap} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    return this.http.
    put('https://section20-auth.firebaseio.com/recipes.json',
      recipes)
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        return this.http.get<Recipe[]>(
          'https://section20-auth.firebaseio.com/recipes.json?auth', {
            params: new HttpParams().set('auth', user.token)
          }
        );
      }),
      map(recipes => {
        return recipes.map(recipe => {
          return {...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []};
        });
      }),
      tap(recipes  => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }
}
