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
import { GetAllBranches } from '../../core/models/get-all-branches';

@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})      
export class EmployeeFormComponent implements OnInit {
  branches!:GetAllBranches
  Groups!:IGroupPages 
  EmpId!:any 
  constructor(private _router:Router,private _employeeServices:EmployeeService,private _route:ActivatedRoute,private _branchServices:BranchServives,private _location:Location){}
  EmpForm = new FormGroup({
    id:new FormControl(),      
    name: new FormControl('',[Validators.required,Validators.minLength(5)]),
    address: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required,Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)]),
    password: new FormControl(''),
    phoneNumber: new FormControl('',Validators.required),
    selectBranch: new FormControl(0),
    selectGroup: new FormControl(0) ,
  })

  ngOnInit(): void {
    this._route.paramMap.subscribe({
      next:(response)=>{this.EmpId =response.get('id')
        // console.log(this.EmpId)
      }  
      
    })
    if(this.EmpId!=0){
      this._employeeServices.GetById(this.EmpId).subscribe({
        next:(response)=>{
          this.GetId.setValue(this.EmpId),
           this.GetName.setValue(response.name),
          //  this.GetUserName.setValue(response.userName), 
           this.GetEmail.setValue(response.email),
           this.GetPhoneNumber.setValue(response.phoneNumber),
           this.GetSelectedGroup.setValue(2),
          this.GetSelectedBranch.setValue(Number(response.branches[0].id)) 
        }
      })  
    }
    this._branchServices.GetAll({ 
      pageIndex:1,
      pageSize:100,
    }).subscribe({
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
  get GetId(){
    return this.EmpForm.controls['id']
  }
  get GetSelectedBranch(){
    return this.EmpForm.controls['selectBranch']
  }
  get GetSelectedGroup(){
    return this.EmpForm.controls['selectGroup']
  }
  get GetAddress(){
    return this.EmpForm.controls['address']
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
          address:formValue.address??'',
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
        let newEmp:IAddEmployee ={ 
          id:formValue.id,   
          name:formValue.name??"",
          address:formValue.address??'',
          phoneNumber:formValue.phoneNumber ?? '',
          email:formValue.email ?? '',
          branchIds:formValue.selectBranch != null ? [formValue.selectBranch] : [], 
          groupId:formValue.selectGroup ?? 0  
        }
        this._employeeServices.UpdateEmployee(newEmp).subscribe({
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
