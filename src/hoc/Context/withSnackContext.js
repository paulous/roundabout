import React, {createContext} from 'react'


export const SnackContext = createContext();

export function withSnackContext(Component) {
  return function snackComponent(props) {
    return (
      <SnackContext.Consumer>
        {data => <Component {...props} data={data} />}
      </SnackContext.Consumer>
    );
  };
}