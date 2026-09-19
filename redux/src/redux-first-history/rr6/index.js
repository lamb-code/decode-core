import React, { useState } from "react";
import { Router } from "react-router-dom";
export function HistoryRouter({ history, children }) {
  const { state, setState } = useState({
    action: history.action,
    location: history.location,
  });
  React.useLayoutEffect(() => {
    history.listen(({ action, location }) => {
      setState({ action, location });
    });
  }, [history]);
  return (
    <Router
      location={state.location}
      action={state.action}
      navigator={history}
      navigationType={state.action}
    >
      {children}
    </Router>
  );
}
