import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IGetAllEmployee } from '../../core/models/iget-all-employee';
import { EmployeeService } from '../../core/services/employee.service';
import { FormsModule } from '@angular/forms';
import { IUpdateEmployee } from '../../core/models/iupdate-employee';



@Component({
  selector: 'app-employee',
  imports: [RouterLink,FormsModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit {
  employees!:IGetAllEmployee[]
  PageSize:number =3
  PageIndex:number=1
  Search!:string
  constructor(private _employeeServices:EmployeeService){}
  ngOnInit(): void {
    this.LoadData()
  }
  LoadData(){
    this._employeeServices.GetAll({
      pageIndex:this.PageIndex,
      pageSize: this.PageSize,
      SearchByName:this.Search
    }).subscribe({
      next:(response)=>this.employees=response 
    })
  }
  Pagination(Index:number){
    this.PageIndex = Index
    this.LoadData()
  }
  SearchHandle(param:string){
    this.Search=param
    this.PageIndex=1
    this.LoadData()
  }
  DeleteHandler(emp:IGetAllEmployee){
    this._employeeServices.DeleteEmployee(emp.id).subscribe({
      next:(response)=>
        emp.isDeleted=response.isDeleted
    })
  }
  isDeletedHandler(event:Event,emp:IGetAllEmployee){
    let check = event.target as HTMLInputElement
    emp.isDeleted = !check.checked 
    this._employeeServices.DeleteEmployee(emp.id).subscribe({
      next:(response)=>{}
           
    })
  }
}
