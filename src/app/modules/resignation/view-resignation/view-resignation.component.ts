import { Component, Input, OnInit } from '@angular/core';
import { ViewRequestService } from '../view-request.service';
import { NgClass, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-view-resignation',
  standalone: true,
  imports: [NgIf,MatIcon,NgClass],
  templateUrl: './view-resignation.component.html',
  styleUrl: './view-resignation.component.scss'
})
export class ViewResignationComponent implements OnInit {
@Input() request:any 
constructor(private view:ViewRequestService){}
ngOnInit(): void {
  console.log(this.request)
  window.history.pushState(null, '', window.location.href);

  window.addEventListener('popstate', (event) => this.onBackPressed());
}
ngOnDestroy(): void {
  this.view.setOpen(false);
}
onBackPressed() {
  this.view.setOpen(false);
}
}
