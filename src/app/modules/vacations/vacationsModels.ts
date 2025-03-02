export interface VacationLookupResponse {
    custom_hours: string[][];
    time_off_type: TimeOffType[];
}

export interface TimeOffType {
    id: number;
    name: string;
    request_unit: string;
    support_document: boolean;
}

export interface DtoCreateVacationRequest {
    holiday_status_id: number;
    description: string;
    request_hour_from: string;
    request_hour_to: string;
    date_to: string;
    date_from: string;
}

export interface ApproveLineStatus {
    msg: string;
    'status line': {
        status: string;
        user_id: number;
        user_name: string;
    }[];
}

export interface GetAllLeaveTypesRemainingLeavesDTO {
    msg: string;
    leave_types: {
        id: number;
        leave_type_name: string;
        remaining_leaves: number;
    }[];
}

export interface TripResponse {
    msg: string;
    time_off_list: Vacation[];
}

export interface Vacation {
    time_off_list: any;
    description: string;
    duration: string;
    employee_name: string;
    end_date: string;
    id: number;
    start_date: string;
    state: string;
    time_off_type: string;
}

