import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Customer } from '../app/model/Customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  create(customer: Customer): Observable<Customer[]>{
    //Estamos chamando um endpoint HTTP do tipo POST com aquela model de Customer que criamos
    //e passando a URL desse endpoint
    return this.http.post<Customer[]>('http://localhost:8080/api/customer/create', customer);
  }

  findById(idCustomer: any): Observable<Customer> {
    return this.http.get<Customer>(`http://localhost:8084/api/customer/findProduct/${idCustomer}`);
  }

  /*
  findAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`http://localhost:8084/api/v1/customer/list`);
  }

  update(customer: Customer): Observable<Customer[]> {
    return this.http.put<Customer[]>(`http://localhost:8084/api/v1/customer/update`, customer);
  }

  delete(idCustomer: any): Observable<Customer> {
    return this.http.delete<Customer>(`http://localhost:8084/api/v1/customer/delete/${idCustomer}`);
  }
  */
}
