import React from "react";
import "dc/dist/style/dc.css";
export const CXContext = React.createContext("CXContext");

export const DataContext = (props)=> {
  const divRef = React.useRef();
  return (
    <CXContext.Provider value={{ ndx: props.ndx }}>
      <div ref={divRef}>{props.children}</div>
    </CXContext.Provider>
  );
}


// export class DataContext extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { loading: false, hasNDX: false };
//   }
//   console.log(this.props.ndx)
//   render() {
   
    
//   }
// }