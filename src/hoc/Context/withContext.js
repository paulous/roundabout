import React, {createContext} from 'react'


export const LayoutContext = createContext()

export function withLayoutContext( Component ) {
  return function LayoutComponent( props ) {
    return (
      <LayoutContext.Consumer>
        { data => <Component {...props} layout={data} />}
      </LayoutContext.Consumer>
    )
  }
}


export const SnackbarContext = createContext()

export function withSnackbarContext( Component ) {
  return function SnackbarComponent( props ) {
    return (
      <SnackbarContext.Consumer>
        { data => <Component {...props} snackbar={data} />}
      </SnackbarContext.Consumer>
    )
  }
}