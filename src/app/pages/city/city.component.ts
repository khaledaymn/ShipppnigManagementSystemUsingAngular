import { Component, OnInit } from '@angular/core';
import { CityService } from '../../core/services/city.service';
import { IGetAllEmployee } from '../../core/models/iget-all-employee';
import { ICityGetAllData } from '../../core/models/icity-get-all-data';
import { RouterLink } from '@angular/router';
import { ICityData } from '../../core/models/icity-data';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-city',
  imports: [RouterLink,FormsModule],
  templateUrl: './city.component.html',
  styleUrl: './city.component.css'
})
export class CityComponent implements OnInit {
  Cities!:ICityGetAllData
  Pagesize:number=5
  PageIndex:number=1
  Search!:string
  constructor(private _cityServices:CityService){}
  ngOnInit(): void {
    this.LoadData()
  }
  SearchHandel(inp:string){
    this.Search = inp
    this.LoadData()
  }
  LoadData(){
    this._cityServices.GetAll({
      pageIndex:this.PageIndex,
      pageSize:this.Pagesize,
      SearchByName:this.Search
    }).subscribe({
      next:(response)=>{this.Cities=response}
    })
  }
  ApplyPagination(param:number){
    this.PageIndex=param
    this.LoadData()
  }
  DeleteHandler(city:ICityData){
    this._cityServices.DeleteCity(city.id??0).subscribe({
      next:()=>{
        city.isDeleted=!city.isDeleted 
      }
    })
  }
  isDeletHandler(event:Event,city:ICityData){
    let checked = event.target as HTMLInputElement
    city.isDeleted = checked.checked ? false : true;
    this._cityServices.DeleteCity(city.id??0).subscribe({
      next:()=>{
        
      }
    })
  }
}
