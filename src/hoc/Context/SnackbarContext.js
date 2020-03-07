import React, {creatContext, createContext} from 'react'
import Snackbar from '../../components/Snackbar/Snackbar'

const SnackContext = createContext() 

export const Snackbar = props => {

    return(
        <SnackContext.Producer>

            <Snackbar {...props} data={data} />

        </SnackContext.Producer>
    )
}