import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  public static getItem(itemName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(JSON.parse(localStorage.getItem(itemName)));
    });
  }

  public get(itemName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(JSON.parse(localStorage.getItem(itemName)));
    });
  }

  public set(itemName: string, itemToStore: any): Promise<any> {
    return new Promise((resolve, reject) => {
      localStorage.setItem(itemName, JSON.stringify(itemToStore));
      resolve(null);
    });
  }

  public remove(itemName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      localStorage.removeItem(itemName);
      resolve(null);
    });
  }

}
