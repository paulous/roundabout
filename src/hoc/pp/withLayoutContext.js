import React, {createContext} from 'react'


export const LayoutContext = createContext();

export function withLayoutContext( Component ) {
  return function LayoutComponent( props ) {
    return (
      <LayoutContext.Consumer>
        { data => <Component {...props} layout={data} />}
      </LayoutContext.Consumer>
    );
  };
}