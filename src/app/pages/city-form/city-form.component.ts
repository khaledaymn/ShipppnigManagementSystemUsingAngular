import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CityService } from '../../core/services/city.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ICityToSelectIdForBranch } from '../../core/models/icity-to-select-id-for-branch';
import { IGovGetAllData } from '../../core/models/igov-get-all-data';
import { ICityData } from '../../core/models/icity-data';

@Component({
  selector: 'app-city-form',
  imports: [ReactiveFormsModule],
  templateUrl: './city-form.component.html',
  styleUrl: './city-form.component.css'
})
export class CityFormComponent implements OnInit {
  AllGov!:IGovGetAllData
  CityId!:any
  CityForm = new FormGroup({
    name: new FormControl('',[Validators.required,Validators.minLength(3)]),
    chargePrice : new FormControl('',Validators.required),
    pickUpPrice: new FormControl('',Validators.required),
    selectedGov : new FormControl(0,Validators.required),
    ID : new FormControl()
 }) 
   constructor(private _cityServices:CityService, 
     private _rout:Router,
     private _activatedRoute:ActivatedRoute,   
   ){}
  ngOnInit(): void {
    this._cityServices.GetAllGov().subscribe({
      next:(response)=>{this.AllGov=response}
    })
    this._activatedRoute.paramMap.subscribe({
      next:(response)=>{
        this.CityId=response.get('id')
        if(this.CityId!=0){
          this._cityServices.GetById(this.CityId).subscribe({
            next:(response)=>{
               this.GetName.setValue(response.name),
               this.GetChargePrice.setValue(response.chargePrice.toString()),
               this.GetPickUpPrice.setValue(response.pickUpPrice.toString()),
               this.GetSelectedGov.setValue(response.governorateId),
               this.GetId.setValue(response.id)
            }
          })
        }
      } 
    })
  }
  get GetName(){
    return this.CityForm.controls['name']
  }
  get GetId(){
    return this.CityForm.controls['ID']
  }
  get GetChargePrice(){
    return this.CityForm.controls['chargePrice']
  }
  get GetPickUpPrice(){
    return this.CityForm.controls['pickUpPrice']
  }
  get GetSelectedGov(){
    return this.CityForm.controls['selectedGov']
  }
  Submit(){
    if(this.CityForm.valid){
      if(this.CityId==0){
        let OBJ = this.CityForm.value 
        let NewCity:ICityData={
          name:OBJ.name ??"",
          pickUpPrice:Number(OBJ.pickUpPrice),
          chargePrice:Number(OBJ.chargePrice),
          governorateId:OBJ.selectedGov ?? 0
        }
        this._cityServices.AddCity(NewCity).subscribe({
          next:()=>{
            this._rout.navigateByUrl("/City"); 
          }
        })
      }else{
        let OBJ = this.CityForm.value 
        let NewCity:ICityData={
          id:OBJ.ID,
          name:OBJ.name ??"",
          pickUpPrice:Number(OBJ.pickUpPrice),
          chargePrice:Number(OBJ.chargePrice),
          governorateId:OBJ.selectedGov ?? 0
        }
        this._cityServices.UpdateCity(NewCity).subscribe({
          next:()=>{
            this._rout.navigateByUrl("/City")
          }
        })
    }
  }
  }
  Back(){
    this._rout.navigateByUrl("/City")
  }
}
