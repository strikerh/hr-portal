import {Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {SidePageInfo, SidePageOption, SidePageService} from "../side-page.service";
import {animations} from "../animation";
import {NgIf} from "@angular/common";
import {SIDE_PAGE_DATA, SIDE_PAGE_REF} from "../side-page-data.token";

@Component({
  selector: 'lib-page',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css',
  animations: animations(),
})
export class PageComponent implements OnInit {

  @ViewChild('contentContainer', {read: ViewContainerRef, static: true}) contentContainer!: ViewContainerRef;

  @Input() sidePage!: SidePageInfo;
  @Output() close: EventEmitter<SidePageInfo> = new EventEmitter();

  _isOpen = false;
  _key = '';
  _options: SidePageOption = {};

  sidePages: SidePageInfo[] = [];

  constructor(
    private sidePageService: SidePageService,
    private injector: Injector
  ) {
  }

  ngOnInit() {
    const sp = this.sidePage;
    if (sp?.state) {
      this._isOpen = sp.state;
      this._key = sp.key;
      this._options = {...sp.options, key: sp.key};

      const injector = Injector.create({
        providers: [
          {provide: SIDE_PAGE_DATA, useValue: {key: sp.key, ...sp.options}},
          {provide: SIDE_PAGE_REF, useValue: sp.ref}],
        parent: this.injector
      });

      this.contentContainer.createComponent(sp.component, {injector});
    }


  }


  closeClicked() {
    this._isOpen = false;
    this.sidePageService.closeLastSidePage();
    setTimeout(() => {
      this.contentContainer.clear();
    }, 300);
    this.close.emit(this.sidePage);
  }
}
