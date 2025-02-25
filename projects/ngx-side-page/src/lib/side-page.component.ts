import {
  Component,
  OnInit,
} from '@angular/core';
import {SidePageInfo, SidePageOption, SidePageService} from './side-page.service';
import {CommonModule} from '@angular/common';
import {animations} from './animation';
import {PageComponent} from "./page/page.component";

@Component({
  selector: 'app-side-page',
  standalone: true,
  imports: [
    CommonModule,
    PageComponent
  ],
  templateUrl: './side-page.component.html',
  styleUrl: './side-page.component.scss',
  animations: animations(),

})
export class SidePageComponent implements OnInit {

  sidePages: SidePageInfo[] = [];

  key = '';
  options: SidePageOption = {};

  constructor(
    private sidePageService: SidePageService,
  ) {
  }

  ngOnInit() {
    console.log('ezz after updates')
    this.sidePageService.initiated = true;
    this.sidePageService.getSidePage().subscribe((sidePages) => {
      this.sidePages = sidePages;

    });
  }

  close(sidePage: SidePageInfo, value: any = null) {
    if (sidePage.options.disableClose)
      return;
    if(this.sidePageService){
      console.log('key',sidePage.key)
      console.log('value',value)
      this.sidePageService.closeSidePage(sidePage.key,value);
      this.sidePageService.closeLastSidePage(value);
    }
  //   if (this.sidePageService)
  //     this.sidePageService.closeLastSidePage(value);

  // }
  }


}
