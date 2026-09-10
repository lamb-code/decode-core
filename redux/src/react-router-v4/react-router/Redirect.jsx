import React from "react";
import RouterContext from "./RouterContext";
import Lifecycle from "./Lifecycle";
// export default class Redirect extends React.Component {
//   static contextType = RouterContext;
//   // 挂载完成后执行一次跳转（不要在 render 里 push）
//   componentDidMount() {
//     this.perform();
//   }
//   // to 变化时才再次跳转
//   componentDidUpdate(prevProps) {
//     if (prevProps.to !== this.props.to) this.perform();
//   }
//   perform() {
//     const { history } = this.context;
//     // v4 语义：Redirect 默认 replace，避免产生多余历史记录导致循环
//     history.replace(this.props.to);
//   }
//   render() {
//     return null;
//   }
// }

// export default class Redirect extends React.Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     return (
//       <RouterContext.Consumer>
//         {(value) => {
//           value.history.push(this.props.to);
//           return null;
//         }}
//       </RouterContext.Consumer>
//     );
//   }
// }

export default class Redirect extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <RouterContext.Consumer>
        {(value) => {
          return (
            <Lifecycle onMount={() => value.history.push(this.props.to)} />
          );
        }}
      </RouterContext.Consumer>
    );
  }
}
