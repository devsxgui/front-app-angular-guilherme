import { Component } from '@angular/core';
import { Customer } from '../model/Customer';
import { CustomerService } from '../service/customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent {
  constructor(private service: CustomerService) {}

  ngOnInit(): void {
    this.saveCustomer();
  }

  customer: Customer = {
    idCustomer: '',
    firstNameCustomer: 'Jefferson',
    lastNameCustomer: 'Restani',
    birthdateCustomer: '21/04/1979',
    dateCreatedCustomer: '',
    monthlyIncomeCustomer: '1000',
    cpfCustomer: '80456061002',
    emailCustomer: 'jefferson@teste.com',
    passwordCustomer: '123456',
    statusCustomer: true,
  };

  saveCustomer() {
    this.service.save(this.customer).subscribe((response) => {
      console.log(response);
    });
  }
}
