function combineReducers(reducers){
    return function combination(state={},action){
        let nextState={}
        for(let key in reducers){
            let prevStateForKey = state[key]
            let reducerForKey =reducers[key]
            let nextStateForKey = reducerForKey(prevStateForKey,action)
            nextState[key]=nextStateForKey
        }
        return nextState
    }
}
export default combineReducers