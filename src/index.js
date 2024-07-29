import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import TextExpand from './TextExpand';
import './index.css';
import App from './App';
//  import App from './App_updates';


// function Test(){
//   const[movierate, setmovierates] = useState(0)
//   return(
//     <div>
//       <div>

//     <StarRating maxrating={5}
//     color='blue'
//     movierating = {setmovierates}

//     />
//     </div>
//     <p>This is reated {movierate} by the customers</p>

//     </div>
//   )
// }




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  {/* <Test/> */}
    <App />
    {/* <TextExpand/> */}
    
  </React.StrictMode>
);