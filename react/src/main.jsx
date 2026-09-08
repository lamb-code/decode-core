import {createRoot} from 'react-dom/client'

let element =(<div>hello<span style={{color:'red'}}>World</span></div>)
const root = createRoot(document.getElementById('root'))
root.render(element)
