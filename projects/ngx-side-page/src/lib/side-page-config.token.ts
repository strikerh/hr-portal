// file: projects/ngx-side-page/src/lib/side-page-config.token.ts
import { InjectionToken } from '@angular/core';
import {SidePageConfig} from "./side-page.service";

export const SIDE_PAGE_CONFIG = new InjectionToken<SidePageConfig>('SidePageConfig');
