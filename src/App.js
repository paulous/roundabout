import React, {Component} from 'react'
import Layout from './hoc/Layout/Layout'
import CssBaseline from '@material-ui/core/CssBaseline'
import withSnackbar from './hoc/pp/withSnackbar'
import withWidth, { isWidthUp }  from '@material-ui/core/withWidth'
/*import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
    palette: {
      type: 'dark', // Switching the dark mode on is a single property value change.
    },
    typography: {
      useNextVariants: true,
    },
  })*/

const LayoutWithSnack = withSnackbar(Layout)
const LayoutWithWidthSnack = withWidth()(LayoutWithSnack)

class App extends Component {


    render() {

        return (
                <CssBaseline>           
                    <LayoutWithWidthSnack withWidth={withWidth}  isWidthUp={ isWidthUp } />
                </CssBaseline>
        )
    }
}

export default App