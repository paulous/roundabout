import React, {createContext} from 'react'


export const UserContext = createContext();

export function withUserContext(Component) {
  return function userComponent(props) {
    return (
      <SnackContext.Consumer>
        {data => <Component {...props} data={data} />}
      </SnackContext.Consumer>
    );
  };
}