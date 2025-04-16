import { Component, OnInit } from '@angular/core';
import { ICityToSelectIdForBranch } from '../../core/models/icity-to-select-id-for-branch';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IBranch } from '../../core/models/ibranch';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BranchServives } from '../../core/services/branch-servives.service';

@Component({
  selector: 'app-branch-form',
  imports: [ReactiveFormsModule],
  templateUrl: './branch-form.component.html',
  styleUrl: './branch-form.component.css'
})
export class BranchFormComponent implements OnInit {
  CityBranch!:ICityToSelectIdForBranch[]
  branchId!:any
   branchForm = new FormGroup({
     name: new FormControl('',[Validators.required,Validators.minLength(3)]),
     CreationDate : new FormControl('',Validators.required),
     Location: new FormControl('',Validators.required),
     citySelect : new FormControl(0,Validators.required)
  }) 
    constructor(private _branchServices:BranchServives, 
      private _router:Router,
      private _activatedRoute:ActivatedRoute,   
      private _location:Location
    ){}
  ngOnInit(): void {
    this._branchServices.GetCity().subscribe({
      next:(response)=>this.CityBranch=response
    })
    this._activatedRoute.paramMap.subscribe({
      next:(response)=>{
        this.branchId = response.get('id');          
      }
    })   
    if(this.branchId !=0){
    let bra =  this._branchServices.GetBranchById(this.branchId).subscribe({
        next:(response)=>{
            this.GetName.setValue(response.name);
            this.GetCreationDate.setValue(response.creationDate.toString());
            this.GetLocation.setValue(response.location);
            this.GetSelectedCity.setValue(response.cityId)
        }
      })
    }
  }
  get GetName(){
    return this.branchForm.controls['name']
  }
  get GetCreationDate(){
    return this.branchForm.controls['CreationDate']
  }
  get GetLocation(){
    return this.branchForm.controls['Location']
  }
  get GetSelectedCity(){
    return this.branchForm.controls['citySelect']
  }
  FormHandler(){
    if(this.branchForm.valid){
      if(this.branchId==0){             
        let formValue = this.branchForm.value
        let newBranch:IBranch ={
          name:formValue.name ??'',
          creationDate: new Date(formValue.CreationDate ?? ''),
          location: formValue.Location ?? '',
          cityId: formValue.citySelect ?? 0,
        }
        this._branchServices.AddBranch(newBranch).subscribe({
            next:(response)=>{
                this._router.navigateByUrl("/Branch")
            }
        })
      }else{
        let formValue = this.branchForm.value
        let newBranch:IBranch ={
          name:formValue.name ??'',
          creationDate: new Date(formValue.CreationDate ?? ''),
          location: formValue.Location ?? '',
          cityId: formValue.citySelect ?? 0,
        }
        this._branchServices.UpdateBranch(this.branchId,newBranch).subscribe({
          next:(response)=>{
            this._router.navigateByUrl("Branch")
          }
        })
      }
    }
  }
  Back(){
    this._location.back()
  }

}
