import React, {createContext} from 'react'
import Welcome from '../components/Welcome/Welcome'

export  const SnackContext = createContext()

export const SnackAsProps = props => (
    <div>
        <SnackContext.Consumer>
            {snackBack => <Welcome {...props} snackBack={snackBack} />}
        </SnackContext.Consumer>
        {props.children}
    </div>
    
  )