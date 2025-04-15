import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BranchServivesService } from '../../core/services/branch-servives.service';
import { IBranch } from '../../core/models/ibranch';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-branch',
  imports: [FormsModule, RouterLink],
  templateUrl: './branch.component.html',
  styleUrl: './branch.component.css'
})
export class BranchComponent implements OnInit {
    branches!:IBranch[]
    BranchLength!:any
    branchWithOurPagination!:IBranch[]
    PageIndex:number=1
    PageSize:number=3
    SearchByName!:string
    constructor(private branchServices:BranchServivesService,private _router:Router){}
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
  DeleteHandeler(item:any){
        this.branchServices.DeleteBranch(item.brancheID).subscribe({
        next:(response)=>{
            // this._router.navigateByUrl("Branch");
            item.isDeleted=response.isDeleted;
        }
      })   
  }

  isDeletedHandler(event:Event,item:IBranch){
    let checkbox = event.target as HTMLInputElement 
    item.isDeleted = !checkbox.checked 
    this.branchServices.UpdateBranch(item.brancheID??0,item).subscribe({
      next: () => {}     
    });
  }
}
