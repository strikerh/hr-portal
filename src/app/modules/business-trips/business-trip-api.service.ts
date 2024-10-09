import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    ApproveLineStatus,
    CreateTripLookupResponse,
    DtoCreateTripRequest,
    TripResponse,
} from './businessTripModels';
import {
    fk_api_get_all_trip_by_employee_id,
    fk_api_get_trips_to_approves_by_user_id,
    fk_create_trip_lookup,
    fk_get_approve_line_status,
} from './fakeData';

@Injectable({
    providedIn: 'root',
})
export class BusinessTripApiService {
    apiUrl = environment.apiUrl + '/v1/api';

    constructor(private _httpClient: HttpClient) {}

    fetchCreateTripLookup() {
        return this._httpClient
            .get<CreateTripLookupResponse>(this.apiUrl + '/create_trip_lookup');

    }

    createTripRequest(data: DtoCreateTripRequest) {
        return this._httpClient.post<any>(
            this.apiUrl + '/approval_request',
            data
        );
    }

    approveTrip(trip_id: number) {
        return this._httpClient.post<any>(this.apiUrl + '/approve_trip', {
            trip_id,
        });
    }

    refuse_trip(trip_id: number) {
        return this._httpClient.post<any>(this.apiUrl + '/refuse_trip', {
            trip_id,
        });
    }

    getApproveLineStatus() {
        return this._httpClient.get<ApproveLineStatus>(
            this.apiUrl + '/get_approve_line_status'
        )  .pipe(
            catchError(() => {
                return of(fk_get_approve_line_status);
            })
        );
    }

    api_get_all_trip_by_employee_id(employee_id: number) {
        return this._httpClient.get<TripResponse>(
            this.apiUrl + '/api_get_all_trips_by_employee_id/'+employee_id
        );
    }

    api_get_trips_to_approves_by_user_id() {
        return this._httpClient.get<TripResponse>(this.apiUrl + '/api_get_trips_to_approves_by_user_id');
    }
}
