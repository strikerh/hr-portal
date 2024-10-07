
export interface CreateTripLookupResponse {
    approval_types: { id: number; name: string }[];
    other_trip_types: { key: string; value: string }[];
    projects: { id: number; name: string }[];
    distances?: { key: string; name: string }[];
    categories?: { id: number; name: string }[];
}

export interface DtoCreateTripRequest {
    employee_id: number;
    location_of_the_trip: string;
    start_date: string;
    end_date: string;
    distance: string;
    approval_cycle_type: string;
    accommodation_paid_by_company: boolean;
    international_trip: boolean;
    car_provided: boolean;
    tickets_allowance: boolean;
    category_id: number;
    trip_type: string;
    project_id: number;
    number_of_trips: number;
}

export interface ApproveLineStatus {
    msg: string;
    'status line': {
        status: string;
        user_id: number;
        user_name: string;
    }[];
}

export interface TripResponse {
    msg: string;
    trips: Trip[];
}

export interface Trip {
    id: number;
    date_end: string;
    date_start: string;
    employee: any;
    status: string;
    approval_cycle_type: string;
    employee_grade: string;
    location_trip:boolean;
    total_compensation:number;
    total_days:number;
    trip_type:string;
    request_manager:string;

}
