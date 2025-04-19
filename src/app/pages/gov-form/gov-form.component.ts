import { Component, OnInit } from '@angular/core';
import { GovernorateService } from '../../core/services/governorate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IGovData } from '../../core/models/igov-data';

@Component({
  selector: 'app-gov-form',
  imports: [ReactiveFormsModule],
  templateUrl: './gov-form.component.html',
  styleUrl: './gov-form.component.css'
})
export class GovFormComponent implements OnInit {
  govId!:any
  constructor(private _goveronratServices:GovernorateService,
              private _activatedRoute:ActivatedRoute,
              private _router:Router
  ){}
  govForm = new FormGroup({
    name: new FormControl('',Validators.required)
  })
  get GetName(){
    return this.govForm.controls['name']
  }
  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe({
      next:(response)=>{this.govId=response.get('id')}
    })
    if(this.govId!=0){
      this._goveronratServices.getGovernorateById(this.govId).subscribe({
        next:(response)=>{
          this.GetName.setValue(response.name)
        }
      }) 
    }
  }
  Submit(){
    if(this.govForm.valid){
      if(this.govId==0){
        let FormValue =this.govForm.value
        let OBJ:IGovData={
          name:FormValue.name??''
        }
        this._goveronratServices.addGovernorate(OBJ).subscribe({
          next:()=>{
            this._router.navigateByUrl("governorates")
          }
        })
      }else{
        let FormValue =this.govForm.value
        let OBJ:IGovData={
          name:FormValue.name??'',
          id:this.govId
        }
        this._goveronratServices.updateGovernorate(this.govId,OBJ).subscribe({
          next:()=>{
            this._router.navigateByUrl("governorates")
          }
        })
      }
    }
  }
  Back(){
    this._router.navigateByUrl("governorates")
  }

}
