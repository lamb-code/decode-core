import { pathToRegexp } from 'path-to-regexp'
let {regexp} = pathToRegexp('/home')
console.log(regexp)
console.log(regexp.test('/home'))