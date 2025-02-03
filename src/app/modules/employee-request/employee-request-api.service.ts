import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
    providedIn: 'root',
})

export class EmployeeRequestService {
    apiUrl = environment.apiUrl + '/v1/api';
constructor(private _httpClient:HttpClient){}
    getRequestLookup(){
       return this._httpClient.get(this.apiUrl+'/lookup_employee_requests');
    }
    getEmployeeRequest(){
        return this._httpClient.get(this.apiUrl+'/get_employee_requests');
    }
    createEmployeeRequest(data:any){
        return this._httpClient.post(this.apiUrl+'/create_employee_request',data);
    }
}