/* eslint-disable*/

export const mapState = (arryList) => {
  let obj = {};
  for(let i=0;i<arryList.length;i++){
    let stateName = arryList[i]
    obj[stateName]=function(){
      return this.$store.state[stateName]
    }
  }
  return obj
};

export const mapGetters = (arryList) => {
  let obj = {};
  for(let i=0;i<arryList.length;i++){
    let stateName = arryList[i]
    obj[stateName]=function(){
      return this.$store.getters[stateName]
    }
  }
  return obj
};
export const mapMutations = (arryList) => {
  let obj = {};
  for(let i=0;i<arryList.length;i++){
    let stateName = arryList[i]
    obj[stateName]=function(payload){
      return this.$store.commit[stateName,payload]
    }
  }
  return obj
};

