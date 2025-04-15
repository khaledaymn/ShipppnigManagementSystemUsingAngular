import { Component, OnInit } from '@angular/core';
import { IStandrdData } from '../../core/models/istandrd-data';
import { StandardService } from '../../core/services/standard.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-standard',
  imports: [RouterLink],
  templateUrl: './standard.component.html',
  styleUrl: './standard.component.css'
})
export class StandardComponent implements OnInit {
    standard!:IStandrdData
    constructor(private _standardServices:StandardService){}
  ngOnInit(): void {
    this.LoadData()
  }         
  LoadData(){
    this._standardServices.GetStandard().subscribe({
      next:(response)=>{this.standard=response[0]}
    })
  }
}
