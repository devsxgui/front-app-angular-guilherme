import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/model/Category';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})

export class CategoryComponent {
  success: boolean = false;
  errors!: String[];
  displayedColumns: string[] = [
    'idCategory',
    'nameCategory',
    'descriptionCategory',
    'deleteCategory',
    'findCategory'];
  ELEMENT_DATA: Category[] = [];
  message: string = '';
  dataSource = new MatTableDataSource<Category>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: CategoryService,
    private toast: ToastrService
  ){}

  ngOnInit(): void {
    this.listCategory();
  }

  category: Category = {
    idCategory: '',
    nameCategory: '',
    descriptionCategory: ''
  }

  clearFields(){
    this.category.nameCategory = " ",
    this.category.descriptionCategory = " "
  }

  saveCategory() {

    this.service.save(this.category).subscribe((response: any) => {
      this.success = true;
      this.errors = [];
      this.category = response.result as Category;
      this.toast.success('A categoria '+ this.category.nameCategory + ' foi salva com sucesso!');
      this.clearFields();
      this.listCategory();
    });
  }

  listCategory() {
    this.service.list().subscribe((response: any) => {
      this.ELEMENT_DATA = response.result as Category[];
      this.dataSource = new MatTableDataSource<Category>(this.ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
    });

  }

  deleteCategory(category: Category) {
    if (window.confirm('Deseja realmente excluir esta categoria?')) {
      this.service.delete(category.idCategory).subscribe((response: any) => {
        this.message = response.result.result as string;
        window.alert(this.message);
        this.listCategory();
      });
    }
  }

  findCategory(category: Category) {
    this.service.findById(category.idCategory).subscribe((response: any) => {
      this.category = response.result as Category;
    });
  }
}
