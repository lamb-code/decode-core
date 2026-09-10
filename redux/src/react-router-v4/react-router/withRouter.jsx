import { _ReactContext as RouterContext } from "./RouterContext";
export default function withRouter(Component) {
  return (props) => {
    return (
      <RouterContext.Consumer>
        {(value) => {
          return <Component {...props} {...value}></Component>;
        }}
      </RouterContext.Consumer>
    );
  };
}
