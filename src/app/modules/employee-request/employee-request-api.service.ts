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
    getRequestNeedApproves(){
        return this._httpClient.get(this.apiUrl+'/get_employee_requests_to_approve');
    }
    createEmployeeRequest(data:any){
        return this._httpClient.post(this.apiUrl+'/create_employee_request',data);
    }
    updateEmployeeRequest(data:any,id:string){
        return this._httpClient.patch(this.apiUrl+'/update_employee_request/'+id,data);
    }
    updateRequestStatus(data:any,id:string){
        return this._httpClient.patch(this.apiUrl+'/update_request_status/'+id,data);
    }
    uploadAttchment(file: File, id: number) {
        const formData = new FormData();
        formData.append('file', file);  // ✅ Use 'file', not 'File'
      
        return this._httpClient.post(this.apiUrl + '/attach_document/' + id, formData);
      }
    getAttchemnt(id){
        return this._httpClient.get(this.apiUrl+'/get_attachments/'+id);
    }
    deleteAttchemnt(id){
          return this._httpClient.delete(this.apiUrl+'/delete_attachment/'+id);
        
      }
      
}