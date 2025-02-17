import { Component, Input } from '@angular/core';
import { ViewRequestService } from '../view-request.service';
import { OvertimeService } from '../overtime.service';
import { environment } from 'environments/environment';
import { MatIcon } from '@angular/material/icon';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-view-overtime',
  standalone: true,
  imports: [MatIcon,NgIf,NgFor,NgClass],
  templateUrl: './view-overtime.component.html',
  styleUrl: './view-overtime.component.scss'
})
export class ViewOvertimeComponent {
 @Input()request:any
  files:any
  projects:any[]=[]
constructor(private view:ViewRequestService,private api:OvertimeService){}
ngOnInit(): void {
  console.log(this.request)
  window.history.pushState(null, '', window.location.href);

  window.addEventListener('popstate', (event) => this.onBackPressed());
  this.api.getProject().subscribe({
    next:(response:any)=>{
      this.projects=response.projects
    }
  })
}
getProjectName(id){
  return this.projects.find(m => m.id === id)?.name || '';
}
ngOnDestroy(): void {
  this.view.setOpen(false);
}
onBackPressed() {
  this.view.setOpen(false);
}

}
