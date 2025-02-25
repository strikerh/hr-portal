import { InjectionToken } from '@angular/core';
import {SidePageInfo, SidePageRef} from "./side-page.service";

export const SIDE_PAGE_DATA = new InjectionToken<SidePageInfo<any>>('SIDE_PAGE_DATA');

export const SIDE_PAGE_REF = new InjectionToken<SidePageRef<any>>('SIDE_PAGE_REF');
