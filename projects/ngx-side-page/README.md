# ngx-side-page

`ngx-side-page` is a versatile Angular library for creating and managing side pages with ease. This library allows you to easily integrate side pages into your Angular applications. It is inspired by the dialog component in Angular Material.

## Installation

To install the library, run:

```sh
npm install ngx-side-page
```

## Usage

### Injecting the Service

To use the library, inject the `SidePageService` into your component:

```typescript
import { Component } from '@angular/core';
import { SidePageService } from 'ngx-side-page';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private sidePageService: SidePageService) {}

  openSidePage() {
    this.sidePageService.openSidePage('unique-key', YourComponent);
  }

  closeSidePage() {
    this.sidePageService.closeLastSidePage();
  }
}
```

### API

#### SidePageService

##### Methods

- `openSidePage(key: string, component: any, options?: SidePageOption): SidePageRef`
  - Opens a side page with the specified key and component.
  - **Parameters:**
    - `key`: A unique key for the side page (That will help you to found it in the service if you need).
    - `component`: The component to be displayed in the side page.
    - `options`: Optional configuration options for the side page.
  - **Returns:** a `SidePageRef` instance.


- `closeLastSidePage(someValue?: any)`
  - Closes the last opened side page.
  - **Parameters:**
    - `someValue`: Optional value to pass when closing the side page.


- `closeSidePage(key: string, someValue?: any)`
  - Closes the side page with the specified key.
  - **Parameters:**
    - `key`: The unique key of the side page to close.
    - `someValue`: Optional value to pass when closing the side page.

- `getSidePage()`
  - Returns an observable of the current side pages.


##### Options

The `SidePageOption` interface provides the following configuration options:

- `position?: 'end' | 'start'`
- `disableClose?: boolean`
- `showCloseBtn?: boolean`
- `width?: string`
- `maxWidth?: string`
- `minWidth?: string`
- `panelClass?: string`
- `backdropClass?: string`
- `hasBackdrop?: boolean`
- `zIndex?: number`
- `data?: any`

#### SidePageRef

The `SidePageRef` class provides methods to interact with the opened side page.

##### Methods

- `afterClosed(): Observable<any>`
  - Returns an observable that emits when the side page is closed.

- `afterOpened(): Observable<void>`
  - Returns an observable that emits when the side page is opened.

- `backdropClick(): Observable<MouseEvent>`
  - Returns an observable that emits when the backdrop is clicked.

- `beforeClosed(): Observable<any>`
  - Returns an observable that emits before the side page is closed.

- `getState()`
  - Returns the current state of the side page.

- `close(someValue: any): void`
  - Closes the side page and optionally passes a value.

### Injecting Data and Reference

- `data`: This property is used to inject the data passed to the side page. It is of type `SidePageInfo<SidePageExampleComponent>`.
- `ref`: This property is used to inject the reference to the side page. It is of type `SidePageRef<SidePageExampleComponent>`.

### Examples

Here is an example of how to use the `SidePageRef` class in your Angular component:

```typescript
import { Component } from '@angular/core';
import { SidePageService, SidePageRef } from 'ngx-side-page';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private sidePageRef: SidePageRef;

  constructor(private sidePageService: SidePageService) {}

  openSidePage() {
    this.sidePageRef = this.sidePageService.openSidePage('unique-key', YourComponent);

    // Subscribe to afterClosed event
    this.sidePageRef.afterClosed().subscribe(result => {
      console.log('Side page closed with result:', result);
    });

    // Subscribe to afterOpened event
    this.sidePageRef.afterOpened().subscribe(() => {
      console.log('Side page opened');
    });

    // Subscribe to beforeClosed event
    this.sidePageRef.beforeClosed().subscribe(result => {
      console.log('Side page is about to close with result:', result);
    });
  }

  closeSidePage() {
    if (this.sidePageRef) {
      this.sidePageRef.close('some value');
    }
  }
}
```

Here is an example of how to use the `data` and `ref` properties in your Angular component:

```typescript
import { Component, inject } from '@angular/core';
import { SidePageService, SidePageRef, SIDE_PAGE_DATA, SIDE_PAGE_REF, SidePageInfo } from 'ngx-side-page';

@Component({
  selector: 'app-side-page-example',
  template: `<p>Data: {{ data.message }}</p>`
})
export class SidePageExampleComponent {
  readonly data: SidePageInfo<SidePageExampleComponent> = inject(SIDE_PAGE_DATA);
  readonly ref: SidePageRef<SidePageExampleComponent> = inject(SIDE_PAGE_REF);

  constructor() {
    console.log('Injected data:', this.data);
    console.log('Injected ref:', this.ref);
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private sidePageRef: SidePageRef<SidePageExampleComponent>;

  constructor(private sidePageService: SidePageService) {}

  openSidePage() {
    const data = { message: 'Hello from AppComponent!' };
    this.sidePageRef = this.sidePageService.openSidePage('unique-key', SidePageExampleComponent, { data });

    // Subscribe to afterClosed event
    this.sidePageRef.afterClosed().subscribe(result => {
      console.log('Side page closed with result:', result);
    });

    // Subscribe to afterOpened event
    this.sidePageRef.afterOpened().subscribe(() => {
      console.log('Side page opened');
    });

    // Subscribe to beforeClosed event
    this.sidePageRef.beforeClosed().subscribe(result => {
      console.log('Side page is about to close with result:', result);
    });
  }

  closeSidePage() {
    if (this.sidePageRef) {
      this.sidePageRef.close('some value');
    }
  }
}
```

In this example:
- `openSidePage` method opens a side page and stores the `SidePageRef` instance.
- Subscriptions to `afterClosed`, `afterOpened`, and `beforeClosed` events are set up to log messages when these events occur.
- `closeSidePage` method closes the side page and optionally passes a value.
- The `SidePageExampleComponent` uses the `data` and `ref` properties to access the injected data and reference.
- The `AppComponent` demonstrates how to open and close the side page, passing data to it.

## Further Help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
