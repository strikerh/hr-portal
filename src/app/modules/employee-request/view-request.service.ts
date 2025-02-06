import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ViewRequestService{

     private isOpenSubject = new BehaviorSubject<boolean>(false);
     constructor() { }
     
     isOpen$ = this.isOpenSubject.asObservable();
     
      // Method to toggle the state
      toggleOpen(): void {
        this.isOpenSubject.next(!this.isOpenSubject.value);
      }
    
      // Method to explicitly set the state
      setOpen(state: boolean): void {
        this.isOpenSubject.next(state);
      }
}