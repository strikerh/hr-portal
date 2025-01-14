import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { appraisalDTO } from './appraisalsModels';

@Injectable({
  providedIn: 'root'
})
export class APIAppraisalService {
 apiUrl = environment.apiUrl + '/v1/api';
    constructor(private _httpClient: HttpClient) {}
    
        getAllAppraisal() {
          // debugger;
            return this._httpClient
                .get<appraisalDTO[]>(this.apiUrl + '/get_appraisal');
    
        }
}
