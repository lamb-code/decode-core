export const CALL_HISTORY_METHOD='@@router/CALL_HISTORY_METHOD'
export const LOCATION_CHANGE='@@router/LOCATION_CHANGE'
export function locationChangeAction(location,action){
    return {
        type:LOCATION_CHANGE,
        payload:{action,location}
    }
}
export function push(...args){
    return {
        type:CALL_HISTORY_METHOD,
        payload:{method:'push',args}
    }
}