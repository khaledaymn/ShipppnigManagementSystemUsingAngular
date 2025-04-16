import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../core/services/employee.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IBranch } from '../../core/models/ibranch';
import { ICityToSelectIdForBranch } from '../../core/models/icity-to-select-id-for-branch';
import { IGroupPages } from '../../core/models/igroup-pages';
import { IAddEmployee } from '../../core/models/iadd-employee';
import { NEVER } from 'rxjs';
import { IUpdateEmployee } from '../../core/models/iupdate-employee';
import { BranchServives } from '../../core/services/branch-servives.service';

@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit {
  branches!:IBranch[]
  Groups!:IGroupPages
  EmpId!:any
  constructor(private _router:Router,private _employeeServices:EmployeeService,private _route:ActivatedRoute,private _branchServices:BranchServives,private _location:Location){}
  EmpForm = new FormGroup({
    name: new FormControl('',[Validators.required,Validators.minLength(5)]),
    userName: new FormControl('',[Validators.required,Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/)]),
    email: new FormControl('',[Validators.required,Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)]),
    password: new FormControl(''),
    phoneNumber: new FormControl('',Validators.required),
    selectBranch: new FormControl(0),
    selectGroup: new FormControl(0) ,
  })

  ngOnInit(): void {
    this._route.paramMap.subscribe({
      next:(response)=>{this.EmpId =response.get('id')} 
    })
    if(this.EmpId!=0){
      this._employeeServices.GetById(this.EmpId).subscribe({
        next:(response)=>{
           this.GetName.setValue(response.name),
           this.GetUserName.setValue(response.userName),
           this.GetEmail.setValue(response.email),
           this.GetPhoneNumber.setValue(response.phoneNumber),
           this.GetSelectedGroup.setValue(response.groupId),
          this.GetSelectedBranch.setValue(Number(response.branchIds)) 
        }
      })  
    }
    this._branchServices.GetAllWithOutPagination().subscribe({
      next:(response)=>{
        this.branches = response
      }
    })
    this._employeeServices.GetAllGroup().subscribe({
      next:(response)=>{
        this.Groups =response 
      }
    }) 
  }

  get GetName(){
    return this.EmpForm.controls['name']
  }
  get GetSelectedBranch(){
    return this.EmpForm.controls['selectBranch']
  }
  get GetSelectedGroup(){
    return this.EmpForm.controls['selectGroup']
  }
  get GetUserName(){
    return this.EmpForm.controls['userName']
  }
  get GetEmail(){
    return this.EmpForm.controls['email']
  }
  get GetPassword(){
    return this.EmpForm.controls['password']
  }
  get GetPhoneNumber(){
    return this.EmpForm.controls['phoneNumber'] 
  }
  Submit(){
    if(this.EmpForm.valid){
      if(this.EmpId==0){
        let formValue = this.EmpForm.value 
        let newEmp:IAddEmployee ={    
          name:formValue.name??"",
          userName:formValue.userName??'',
          phoneNumber:formValue.phoneNumber ?? '',
          email:formValue.email ?? '',
          password:formValue.password ?? '' ,
          branchIds:formValue.selectBranch != null ? [formValue.selectBranch] : [], 
          groupId:formValue.selectGroup ?? 0
        }

        this._employeeServices.AddEmployee(newEmp).subscribe({
          next:(response)=>{
            this._router.navigateByUrl("/Employee")  
          },
          // error:(response)=>{this._router.navigateByUrl("/Employee")}
        })
      }
      else{ 
        let formValue = this.EmpForm.value 
        let newEmp:IUpdateEmployee ={    
          name:formValue.name??"",
          userName:formValue.userName??'',
          phoneNumber:formValue.phoneNumber ?? '',
          email:formValue.email ?? '',
          branchIds:formValue.selectBranch != null ? [formValue.selectBranch] : [], 
          groupId:formValue.selectGroup ?? 0  
        }
        this._employeeServices.UpdateEmployee(this.EmpId,newEmp).subscribe({
          next:(Response)=>{
            this._router.navigateByUrl("/Employee")
          } 
        })
    }
   }
  }
  Back(){
    this._location.back()
  }
}
