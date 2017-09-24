import { Injectable } from '@angular/core';

@Injectable()
export class LocalDataStorageService {

  // Récupère un élément du LocalStorage
  public getItem (key) {
    return localStorage.getItem(key);
  }

  // Ajoute un élément au LocalStorage
  public setItem (key, value) {
    localStorage.setItem(key, value);
  }

  // Ajoute un élément au LocalStorage
  public removeItem (key) {
    localStorage.removeItem(key);
  }

  // Supprime tous les éléments du LocalStorage
  public clear() {
    localStorage.clear();
  }
  
}
