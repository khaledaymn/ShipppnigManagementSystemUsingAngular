import { Component, OnInit } from '@angular/core';
import { IGroupPages } from '../../core/models/igroup-pages';
import { GroupService } from '../../core/services/group.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-group',
  imports: [RouterLink],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css'
})
export class GroupComponent implements OnInit {
  groups!:IGroupPages
  constructor(private _groupServices:GroupService){}


  ngOnInit(): void {
    this.LoadData()
  }
  LoadData(){
    this._groupServices.GetAll().subscribe({
      next:(response)=>{this.groups=response}
    })
  }
}
