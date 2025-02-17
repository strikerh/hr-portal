import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class resignationApiService{

     apiurl = environment.apiUrl  + '/v1/api';
     constructor(private _httpClient:HttpClient) { }

     getEmployeeRequests(){
      return this._httpClient.get(this.apiurl + '/get_resignation_requests');
     }
     getRequestNeedApproves(){
      return this._httpClient.get(this.apiurl + '/get_resignation_requests_to_approve');
     }
     updateRequestStatus(data:any,id:string){
      return this._httpClient.patch(this.apiurl+'/update_request_status/'+id,data);
  }
  uploadAttchment(file: File, id: number) {
    const formData = new FormData();
    formData.append('file', file);  // ✅ Use 'file', not 'File'
  
    return this._httpClient.post(this.apiurl + '/attach_document/' + id, formData);
  }
  getAttchemnt(id){
    return this._httpClient.get(this.apiurl+'/get_attachments/'+id);
}
     
    
}