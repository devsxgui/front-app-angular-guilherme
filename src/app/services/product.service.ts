import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product } from '../model/Product';

@Injectable({
  providedIn: 'root'
})

export class ProductService{

  constructor(private http: HttpClient) { }

  create(product: Product): Observable<Product[]> {
    return this.http.post<Product[]>('http://localhost:8080/api/product/create', product);
  }

  list(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:8080/api/product/list');
  }

  findById(idProduct: any): Observable<Product> {
    return this.http.get<Product>(`http://localhost:8080/api/product/findProductById/${idProduct}`);
  }

  delete(idProduct: any): Observable<Product> {
    return this.http.delete<Product>(`http://localhost:8080/api/product/delete/${idProduct}`);
  }

}
