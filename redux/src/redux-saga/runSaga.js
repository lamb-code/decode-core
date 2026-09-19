import effectTypes from './effectTypes'
function runSaga(saga) {
  let it = saga();
  function next() {
    let { done, value: effect } = it.next();
    if (!done) {
        switch(effect.type){
            case effectTypes.TAKE:
        }
    }
  }
  next();
}
export default runSaga;
