import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AfterCloseSidePageService {
 afterClose$=new BehaviorSubject<boolean>(false);
  constructor() { }

  setValue(value:boolean){
    this.afterClose$.next(value)
  }
  getValue():Observable<boolean>{
    return this.afterClose$.asObservable();
  }
}
