import { Component, inject, Input, OnInit } from '@angular/core';
import { ViewRequestService } from '../view-request.service';
import { NgClass, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { SIDE_PAGE_DATA, SIDE_PAGE_REF, SidePageInfo, SidePageRef, SidePageService } from 'ngx-side-page';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-view-resignation',
    standalone: true,
    imports: [NgIf, MatIcon, NgClass, MatButton],
    templateUrl: './view-resignation.component.html',
    styleUrl: './view-resignation.component.scss',
})
export class ViewResignationComponent implements OnInit {
    @Input() request: any;
    data: any;
    sidePage: boolean = false;
    readonly requestData: SidePageInfo<ViewResignationComponent> | null = inject(SIDE_PAGE_DATA, { optional: true });
    readonly refs: SidePageRef<ViewResignationComponent> | null = inject(SIDE_PAGE_REF, { optional: true });

    constructor(private view: ViewRequestService) {}
    ngOnInit(): void {
        console.log(this.request);
        if (this.request) {
            this.data = this.request;
            console.log(this.data)
        }
        if (this.requestData && this.requestData.data) {
            this.data = this.requestData.data;
            this.sidePage = true;
        }
        window.history.pushState(null, '', window.location.href);

        window.addEventListener('popstate', (event) => this.onBackPressed());
    }
    ngOnDestroy(): void {
        this.view.setOpen(false);
    }
    onBackPressed() {
        this.view.setOpen(false);
    }

    seeMore(){
        this.refs.close({seeMore: true});
    }
}
