import Route from "../react-router/Route";
import Link from "./Link";

export default function NavLink(props) {
  //访问谁或者点击谁 哪个Link就被激活，核心原理就是地址栏中的location.pathname和to一致
  const {
    to,
    exact,
    activeClassName,
    activeStyle,
    className,
    style,
    children,
  } = props;
  return (
    <Route path={to} exact={exact}>
      {({ match }) => {
        let linkProps = {
          className: match ? `${className} ${activeClassName}` : className,
          style: match ? { ...style, ...activeStyle } : style,
          to,
          children,
        };
        return <Link {...linkProps}></Link>;
      }}
    </Route>
  );
}
