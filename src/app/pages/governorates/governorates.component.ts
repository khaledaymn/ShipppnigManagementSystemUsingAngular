import { Component, OnInit } from '@angular/core';
import { IGovGetAllData } from '../../core/models/igov-get-all-data';
import { GovernorateService } from '../../core/services/governorate.service';
import { FormsModule } from '@angular/forms';
import { IGovData } from '../../core/models/igov-data';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-governorates',
  imports: [FormsModule,RouterLink],
  templateUrl: './governorates.component.html',
  styleUrl: './governorates.component.css'
})
export class GovernoratesComponent implements OnInit {
  governorates!:IGovGetAllData
  PageSize:number=5
  PageIndex:number=1
  Search!:string
  constructor(private _governorateServices:GovernorateService){}
  ngOnInit(): void {
    this.LoadData()
  }
  LoadData(){
    this._governorateServices.getGovernorates({
      pageIndex:this.PageIndex,
      pageSize:this.PageSize,
      search:this.Search
    }).subscribe({
      next:(response)=>{
        this.governorates=response
      }
    })
  }
  SearchHandel(param:string){
    this.Search=param
    this.LoadData()
  }
  DeleteHandler(gov:IGovData){
    this._governorateServices.deleteGovernorate(gov.id??0).subscribe({
      next:()=>{
        gov.isDeleted=true
      }
    })
  }     
  isDeletHandler(event:Event,gov:IGovData){
    let value = event.target as HTMLInputElement 
    gov.isDeleted = !value.checked
    this._governorateServices.deleteGovernorate(gov.id??0).subscribe({
      next:()=>{}
    })
  } 
  ApplyPagination(param:number){
    this.PageIndex=param
    this.LoadData()    
  }


}
