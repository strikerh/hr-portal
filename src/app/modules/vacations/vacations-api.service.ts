import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    ApproveLineStatus,
    VacationLookupResponse,
    DtoCreateVacationRequest,
    TripResponse, GetAllLeaveTypesRemainingLeavesDTO,
    vacation,
} from './vacationsModels';


@Injectable({
    providedIn: 'root',
})
export class VacationsApiService {
    apiUrl = environment.apiUrl + '/v1/api';

    constructor(private _httpClient: HttpClient) {}

    fetchCreateTripLookup() {
        return this._httpClient
            .get<VacationLookupResponse>(this.apiUrl + '/create_time_off_lookup');

    }

    createTripRequest(data: FormData) {
        return this._httpClient.post<any>(
            this.apiUrl + '/create_time_off_request',
            data
        );
    }

    approveTrip(time_off_request_id: number) {
        return this._httpClient.post<any>(this.apiUrl + '/approve_time_off_request', {
            time_off_request_id,
        });
    }

    refuse_trip(time_off_request_id: number) {
        return this._httpClient.post<any>(this.apiUrl + '/refuse_time_off_request', {
            time_off_request_id,
        });
    }

    getApproveLineStatus() {
        return this._httpClient.get<ApproveLineStatus>(
            this.apiUrl + '/get_approve_line_status'
        ) ;
    }

    api_get_all_vacation_by_employee_id() {
        return this._httpClient.get<TripResponse>(
            this.apiUrl + '/get_all_time_off_request/'
        );
    }

    api_get_vacation_to_approves_by_user_id() {
        console.log('adsa')
        return this._httpClient.get<vacation>(this.apiUrl + '/get_all_time_off_can_approve');
    }

    get_all_leave_types_remaining_leaves() {
        return this._httpClient.get<GetAllLeaveTypesRemainingLeavesDTO>(this.apiUrl + '/get_all_leave_types_remaining_leaves');
    }
    get_team_remaining_leaves(){
        return this._httpClient.get<vacation>(this.apiUrl + '/get_team_remaining_leaves');
    }
    cancel_request(data:object){
        return this._httpClient.post<any>(
        (this.apiUrl + '/cancel_request'),data
    );
    }
}
