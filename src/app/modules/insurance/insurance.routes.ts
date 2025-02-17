import { Routes } from '@angular/router';
import { InsuranceComponent } from './insurance.component';
import { ViewInsuranceComponent } from './view-insurance/view-insurance.component';

export default [
    {
        path     : '',
        component: InsuranceComponent,
    },
    {
        path:"view-insurance",
        component:ViewInsuranceComponent
    }
] as Routes;
