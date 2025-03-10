import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AfterCloseSidePageService {
 afterClose$=new BehaviorSubject<string | null>(null);
  constructor() { }

  setValue(value:string){
    this.afterClose$.next(value)
  }
  getValue():Observable<string>{
    return this.afterClose$.asObservable();
  }
}
