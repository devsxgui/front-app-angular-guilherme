import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';

//Import para a bendita data
import { DatePipe } from '@angular/common';

//Imports para Customer
import { Customer } from '../model/Customer';
import { CustomerService } from '../services/customer.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})

export class CustomerComponent implements OnInit{

  success: boolean = false;
  errors!: String[];
  displayedColumns: string[] = ['idCustomer', 'firstNameCustomer', 'lastNameCustomer', 'cpfCustomer', 'birthdateCustomer', 'dateCreatedCustomer', 'monthlyIncomeCustomer', 'emailCustomer', 'statusCustomer', 'optionsCustomer'];
  ELEMENT_DATA: Customer[] = [];
  dataSource = new MatTableDataSource<Customer>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.listCustomer();
  }

  constructor(
    private dialog: MatDialog,
    private toast: ToastrService,
    private router: Router,
    private service: CustomerService
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

  saveCustomer() {
    const datePipe = new DatePipe('en-US');
    this.customer.birthdateCustomer = datePipe.transform(
      this.customer.birthdateCustomer, 'dd/MM/yyyy');

    this.service.create(this.customer).subscribe({next: response => {
      this.success = true;
      this.errors = [];
      this.toast.success('O cliente '+ this.customer.firstNameCustomer +' '+ this.customer.lastNameCustomer +' foi cadastrado com sucesso!', 'Sucesso!!!');
    }, error: ex => {
      if (ex.error.errors) {
        this.errors = ex.error.errors;
        this.success = false;
        ex.error.errors.forEach((element:any) => {
          this.toast.error(element.message, 'Atenção!!!');
        });
      } else {
          this.success = false;
          this.errors = ex.error.errors;
          this.toast.error(ex.error.message, 'Atenção!');
      }
    }})

  }

  listCustomer() {
    this.service.list().subscribe((response: any) => {
      this.ELEMENT_DATA = response.result as Customer[]; // Verifique o tipo e faça a conversão
      this.dataSource = new MatTableDataSource<Customer>(this.ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
    });
  }

  deleteCustomer(idCustomer): void{
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Você realmente quer deletar esse Cliente?',
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.delete(idCustomer).subscribe({ next: () => {
          this.toast.success('Cliente deletado com sucesso!', this.customer.firstNameCustomer);
          this.router.navigate(['customer']);
          this.listCustomer()
        }, error: ex => {
          if (ex.error.errors) {
            ex.error.errors.forEach(element => {
              this.toast.error(element.message);
            });
          } else {
            this.toast.error(ex.error.message);
          }
        }})
      }
    })
  }
}
