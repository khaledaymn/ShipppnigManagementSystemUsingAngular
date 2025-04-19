// import { Component, OnInit } from '@angular/core';
// import { MeduleService } from '../../core/services/medule.service';
// import { IMeduleGetAllData } from '../../core/models/imedule-get-all-data';

// @Component({
//   selector: 'app-medule',
//   imports: [],
//   templateUrl: './medule.component.html',
//   styleUrl: './medule.component.css'
// })
// export class MeduleComponent implements OnInit {
//   medules!:IMeduleGetAllData

//   constructor(private _meduleServices:MeduleService){}

//   ngOnInit(): void {
//     this.LoadData()
//   }
//   LoadData(){
//     this._meduleServices.GetAll().subscribe({
//       next:(response)=>{this.medules=response}
//     })
//   }
// }



import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MeduleService } from '../../core/services/medule.service';
import { IMeduleGetAllData } from '../../core/models/imedule-get-all-data';
import { IGroupPayload } from '../../core/models/igroup-payload';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medule',
  imports:[CommonModule,ReactiveFormsModule],
  templateUrl: './medule.component.html',
  styleUrls: ['./medule.component.css']
})
export class MeduleComponent implements OnInit {
  medules!: IMeduleGetAllData;
  form!: FormGroup;

  // خريطة العمليات: Add, Delete, Update, Read
  ops = [
    { label: 'Add',    value: 1 },
    { label: 'Delete', value: 3 },
    { label: 'Update', value: 2 },
    { label: 'Read',   value: 0 },
  ];

  constructor(
    private meduleService: MeduleService,
    private fb: FormBuilder,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.meduleService.GetAll().subscribe({
      next: res => {
        this.medules = res;
        this.initForm();
      },
      error: err => console.error(err)
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: [''],  // لو عايز تحط اسم للـ group
      permissions: this.fb.array(
        this.medules.data.map(m => this.fb.group({
          id:    [m.id],
          values: this.fb.array<number>([])
        }))
      )
    });
  }

  get permissionsControls() {
    return (this.form.get('permissions') as FormArray).controls;
  }

  onCheckboxChange(
    permIndex: number,
    opValue: number,
    event: Event
  ) {
    const valuesArray = (this.permissionsControls[permIndex].get('values') as FormArray);
    if ((event.target as HTMLInputElement).checked) {
      valuesArray.push(this.fb.control(opValue));
    } else {
      const idx = valuesArray.value.indexOf(opValue);
      if (idx >= 0) valuesArray.removeAt(idx);
    }
  }

  submit(): void {
    const payload: IGroupPayload = this.form.value;
    console.log('▶ Payload to send:', payload);
    this.router.navigateByUrl("/Group")
  }
}
