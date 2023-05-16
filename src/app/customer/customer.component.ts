import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

//Import para a bendita data
import { DatePipe } from '@angular/common';

//Imports para Customer
import { Customer } from '../model/Customer';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})

export class CustomerComponent {
  constructor(
    private toast: ToastrService,
    private service: CustomerService,
    private router: Router
  ) {}

  //Aqui não tem jeito, iremos repétir código
  //Estamos limpando todos valores
  customer: Customer = {
    idCustomer: '',
    firstNameCustomer: '',
    lastNameCustomer: '',
    cpfCustomer: '',
    birthdateCustomer: '',
    monthlyIncomeCustomer: '',
    emailCustomer: '',
    passwordCustomer: ''
  }

  //Estamos falando que esse atributo só será valido quando tiver um tamanho de no
  //mínimo 3 caracteres
  firstNameCustomer: FormControl = new FormControl(null, Validators.minLength(3));
  lastNameCustomer: FormControl = new FormControl(null, Validators.minLength(3));

  //Estamos falando que esse atributo é requerido/obrigatório
  cpfCustomer: FormControl = new FormControl(null, Validators.required);

  //monthlyIncomeCustomer: FormControl = new FormControl(null, Validators.minLength(3));
  //Estamos falando que esse atributo só é valido quando tiver um formato de e-mail
  //que já tem a validação nesse Validators
  emailCustomer: FormControl = new FormControl(null, Validators.email);
  passwordCustomer: FormControl = new FormControl(null, Validators.minLength(3));

  //OBS: Não consegui fazer a validação de birthdate e monthlyIncome
  //Função que verifica se os campos estão validos

  validateFields(): boolean {
    //Iremos ter um botão que só é habilitado se tudo estiver preenchido
    //ou seja, se isso retornar falso, o botão ficará desabilitado
    return this.firstNameCustomer.valid &&
    this.lastNameCustomer.valid &&
    this.cpfCustomer.valid &&
    this.emailCustomer.valid &&
    this.passwordCustomer.valid
  }

  createCustomer() {
    //DatePipe para transformar a data no formato desejado
    const datePipe = new DatePipe('en-US');
    this.customer.birthdateCustomer = datePipe.transform(this.customer.birthdateCustomer, 'dd/MM/yyyy');

    //Estamos chamando o método da nossa service passando nosso customer
    this.service.create(this.customer).subscribe({ next: () => {
      this.toast.success('O Cliente foi cadastrado com sucesso!', 'Cadastro');
      //this.router.navigate(['customer']); //nos leva até a rota de listagem que ainda não temos

    }, error: ex => {

      //Se tem erros
      if(ex.error.errors) {

        //Laço condicional de erros
        ex.error.errors.forEach((element: { message: string | undefined; }) => {
          this.toast.error(element.message, 'Erro');
          //Aparece o erro (mas não temos o devido tratamento no backend)
        });

      } else {
        this.toast.error(ex.error.message, 'Erro');
        //Aparece o erro (mas não temos o devido tratamento no backend)
      }
    }});
  }

}
