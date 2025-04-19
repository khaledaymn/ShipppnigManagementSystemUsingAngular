import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IBranch } from '../../core/models/ibranch';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BranchServives } from '../../core/services/branch-servives.service';
import { GetAllBranches } from '../../core/models/get-all-branches';

@Component({
  selector: 'app-branch',
  imports: [FormsModule, RouterLink],
  templateUrl: './branch.component.html',
  styleUrl: './branch.component.css'
})
export class BranchComponent implements OnInit {
    branches!:GetAllBranches
    BranchLength!:any
    branchWithOurPagination!:IBranch[]
    PageIndex:number=1
    PageSize:number=5
    SearchByName!:string
    constructor(private branchServices:BranchServives,private _router:Router){}
    ngOnInit(): void {
      this.loadBranches();

    }
    
    loadBranches(): void {
      this.branchServices.GetAll({
        pageIndex: this.PageIndex,
        pageSize: this.PageSize,
        SearchByName: this.SearchByName
      }).subscribe(data => {
        this.branches = data; 
      });
    }
  Pagination(index:number){
    this.PageIndex=index;
    this.loadBranches();
    }
  SearchHandler(param:string){
    this.SearchByName=param
    this.PageIndex=1
    this.loadBranches()
  } 
  DeleteHandeler(item:IBranch){ 
        this.branchServices.DeleteBranch(item.id??0).subscribe({ 
        next:(response)=>{
            // this._router.navigateByUrl("Branch");
            item.isDeleted=true
        }
      })   
  }

  isDeletedHandler(event:Event,item:IBranch){
    let checkbox = event.target as HTMLInputElement 
    item.isDeleted = !checkbox.checked 
    this.branchServices.DeleteBranch(item.id??0).subscribe({ 
      next: () => {}     
    });
  }
}
