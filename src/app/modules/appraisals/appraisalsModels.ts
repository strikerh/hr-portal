export interface appraisalDTO{
    id:number,
    employee_id:{},
    manager_ids:[{}],
    state:string,
    employee_feedback_published:boolean,
    employee_feedback:string
    manager_feedback_published:boolean,
    manager_feedback:string,
    type:string
    result:string
    managerDetails:{name:string}
}