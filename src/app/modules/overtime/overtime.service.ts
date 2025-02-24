import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
    providedIn:'root'
})

export class OvertimeService{
    apiUrl = environment.apiUrl + '/v1/api';
    constructor(private _httpClient:HttpClient){}
    
    getProject(){
    return this._httpClient.get(this.apiUrl+'/get_all_projects');
    }
    getEmployeeRequest(){
    return this._httpClient.get(this.apiUrl+'/get_overtime_requests');
    }
    getRequestNeedApproves(){
    return this._httpClient.get(this.apiUrl+'/get_overtime_requests_to_approve');
    }
    updateRequestStatus(data:any,id:string){
        return this._httpClient.patch(this.apiUrl+'/update_request_status/'+id,data);
    }
    getSalaryInfo(id){
        return this._httpClient.get(this.apiUrl+'/get_user_salary/'+id);

    }
        
}