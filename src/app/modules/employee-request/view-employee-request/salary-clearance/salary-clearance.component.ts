import { Component, Input, OnInit } from '@angular/core';
import { ViewRequestService } from '../../view-request.service';
import { NgClass, NgFor, NgForOf, NgIf } from '@angular/common';
import { EmployeeRequestService } from '../../employee-request-api.service';
import { environment } from 'environments/environment';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-salary-clearance',
  standalone: true,
  imports: [NgIf,NgClass,NgForOf,NgFor,MatIcon],
  templateUrl: './salary-clearance.component.html',
  styleUrl: './salary-clearance.component.scss'
})
export class SalaryClearanceComponent implements OnInit {
@Input() request:any;
attachments;
constructor(private veiw:ViewRequestService,private api:EmployeeRequestService){
  console.log(this.request)
}
closeView(){
  this.veiw.setOpen(false)
}
ngOnInit(): void {
  this.api.getAttchemnt(this.request.id).subscribe((response:any)=>{
    console.log(response)
    this.attachments=response.attachments
  })
}

viewAttachment(url: string) {
  window.open(this.getFullUrl(url), '_blank');
}

// Get full URL for the file
getFullUrl(url: string): string {
  return `${environment.apiUrl}${url}`;
}
}
