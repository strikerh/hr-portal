import {animate, state, style, transition, trigger} from "@angular/animations";

export const animations = () =>
{
  const computedStyle = window.getComputedStyle(document.documentElement).direction;

  // const direction = document.documentElement.getAttribute('dir') || document.body.getAttribute('dir') || 'ltr';
  const isRtl = computedStyle === 'rtl';
  const val1 =isRtl?  ['-100%', '0%']: ['100%', '0%'];
  const val2 =isRtl?   ['100%', '0%']: ['-100%', '0%'];
  return   [

    trigger('slideInOut', [
      /*    state('in', style({
            transform: 'translateX(0)'
          })),
          state('out', style({
            transform: 'translateX(-100%)',
            display: 'none'
          })),*/
      transition(':enter', [
        style({ transform: `translateX(${val1[0]})`  }),
        animate('150ms ease-in-out', style({ transform: `translateX(${val1[1]})`  }))
      ]),
      transition(':leave', [
        animate('150ms ease-in-out', style({ transform: `translateX(${val1[0]})`  }))
      ]),
      transition('in => out', animate('200ms ease-in-out')),
      transition('out => in', animate('200ms ease-in-out'))
    ]),

    trigger('slideInOutStart', [
      // state('in', style({
      //   transform: 'translateX(0)'
      // })),
      // state('out', style({
      //   transform: 'translateX(100%)',
      //   display: 'none'
      // })),
      transition(':enter', [
        style({ transform: `translateX(${val2[0]})`  }),
        animate('150ms ease-in-out', style({ transform: `translateX(${val2[1]})`  }))
      ]),
      transition(':leave', [
        animate('150ms ease-in-out', style({ transform: `translateX(${val2[0]})`  }))
      ]),
      transition('in => out', animate('200ms ease-in-out')),
      transition('out => in', animate('200ms ease-in-out'))
    ]),





    trigger('show', [
      state('in', style({
        opacity: '1'
      })),
      state('out', style({
        opacity: '0',
        display: 'none'
      })),
      transition('in => out', animate('200ms ease-out')),
      transition('out => in', animate('200ms ease-in'))
    ]),
    trigger('remove', [
      state('in', style({})),
      state('out', style({
        display: 'none'
      })),
      transition('in => out', animate('300ms ease-out')),
      transition('out => in', animate('300ms ease-in'))
    ])

  ]
}

