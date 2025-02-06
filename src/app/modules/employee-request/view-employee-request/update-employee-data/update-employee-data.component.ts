import { Component, Input, OnInit } from '@angular/core';
import { ViewRequestService } from '../../view-request.service';
import { NgClass, NgFor } from '@angular/common';
import { EmployeeRequestService } from '../../employee-request-api.service';
import { environment } from 'environments/environment';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-update-employee-data',
  standalone: true,
  imports: [NgClass,NgFor,MatIcon],
  templateUrl: './update-employee-data.component.html',
  styleUrl: './update-employee-data.component.scss'
})
export class UpdateEmployeeDataComponent implements OnInit{
  @Input() request:any;
  attachments
  constructor(private veiw:ViewRequestService,private api:EmployeeRequestService){
    console.log(this.request)
  }
  ngOnInit(): void {
    this.api.getAttchemnt(this.request.id).subscribe({
      next:(response:any)=>{
        console.log(response)
        this.attachments=response.attachments
        this.attachments[0].url=environment.apiUrl+this.attachments[0].url
      }
    })
  }
  closeView(){
    this.veiw.setOpen(false)
  }
}
