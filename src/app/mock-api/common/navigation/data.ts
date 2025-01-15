/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboard',
        title: 'Dashboard',
        type : 'basic',
        icon : 'dashboard',
        link : '/dashboard'
    },
    // {
    //     id   : 'payroll',
    //     title: 'Payroll',
    //     type : 'basic',
    //     icon : 'payments',
    //     link : '/payroll'
    // },
    // {
    //     id   : 'loan',
    //     title: 'Loan',
    //     type : 'basic',
    //     icon : 'attach_money',
    //     link : '/loan'
    // },
    {
        id   : 'vacations',
        title: 'Vacations',
        type : 'basic',
        icon : 'mat_solid:beach_access',
        link : '/vacations'
    },
    /*    {
            id   : 'resignation',
            title: 'Resignation',
            type : 'basic',
            icon : 'emoji_people',
            link : '/regnation'
        },
      /*      {
            id   : 'iqama',
            title: 'Iqama',
            type : 'basic',
            icon : 'heroicons_outline:credit-card',
            link : '/iqama'
        },*/
    {
        id   : 'businessTrip',
        title: 'BusinessTrip',
        type : 'basic',
        icon : 'airplane_ticket',
        link : '/business-trips'
    },
    {
        id   : 'appraisal',
        title: 'Appraisal',
        type : 'basic',
        icon : 'speaker_notes',
        link : '/appraisal'
    },
    // {
    //     id   : 'expense',
    //     title: 'Expense',
    //     type : 'basic',
    //     icon : 'payments',
    //     link : '/expense'
    // }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example1',
        type : 'basic',
        icon : 'mat_solid:account_balance_wallet',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example2',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    ...defaultNavigation
];
