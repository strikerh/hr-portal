import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ViewRequestService } from '../view-request.service';
import { InsuranceApiService } from '../insurance-api.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-view-insurance',
  standalone: true,
  imports: [NgIf,NgFor,MatIcon,NgClass],
  templateUrl: './view-insurance.component.html',
  styleUrl: './view-insurance.component.scss'
})
export class ViewInsuranceComponent {
  @Input()request:any
  files:any
constructor(private view:ViewRequestService,private api:InsuranceApiService){}
ngOnInit(): void {
  console.log(this.request)
  window.history.pushState(null, '', window.location.href);

  window.addEventListener('popstate', (event) => this.onBackPressed());
  this.api.getAttchemnt(this.request.id).subscribe((data:any)=>{
    this.files=data.attachments;
    console.log(this.files)
  })
}
ngOnDestroy(): void {
  this.view.setOpen(false);
}
onBackPressed() {
  this.view.setOpen(false);
}
viewAttachment(url: string) {
  window.open(this.getFullUrl(url).split('?')[0], '_blank');
}

getFullUrl(url: string): string {
  return `${environment.apiUrl}${url}`;
}
}
