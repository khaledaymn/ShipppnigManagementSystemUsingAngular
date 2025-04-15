import { Component, OnInit } from '@angular/core';
import { IStandrdData } from '../../core/models/istandrd-data';
import { StandardService } from '../../core/services/standard.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-standard-form',
  imports: [ReactiveFormsModule],
  templateUrl: './standard-form.component.html',
  styleUrl: './standard-form.component.css'
})
export class StandardFormComponent implements OnInit {
  standerd!:IStandrdData 
  constructor(private _standardServices:StandardService,private _router:Router){}
  standardForm= new FormGroup({
    standardWeight: new FormControl('',[Validators.required]),
    villagePrice:new FormControl('',[Validators.required]),
    kGprice: new FormControl('',[Validators.required]),     
  })
  ngOnInit(): void {
    this._standardServices.GetStandard().subscribe({
      next:(response)=>{
        this.standerd=response[0]
        this.GetkGprice.setValue(this.standerd.kGprice.toString()),
        this.GetstandardWeight.setValue(this.standerd.standardWeight.toString()),
        this.GetvillagePrice.setValue(this.standerd.villagePrice.toString())
      }
    })
  }
    get GetkGprice(){
      return this.standardForm.controls['kGprice']
    }
    get GetstandardWeight(){
      return this.standardForm.controls['standardWeight']
    }

    get GetvillagePrice(){
      return this.standardForm.controls['villagePrice']
    }
    Back(){
      this._router.navigateByUrl("/weightSetting")
    }
    Submit(){
      let formValue = this.standardForm.value
      let OBJ:IStandrdData={
        kGprice:Number(formValue.kGprice),
        standardWeight:Number(formValue.standardWeight),
        villagePrice:Number(formValue.villagePrice)
      }
      this._standardServices.Update(1,OBJ).subscribe({
        next:()=>{
          this._router.navigateByUrl("/weightSetting")
        }
      })
    }
    
}
