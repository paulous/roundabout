import React, {Component} from 'react'
import styled from'styled-components'
import Aux from '../../hoc/Aux/Aux'
//import styler from '../Styler/Styler'
import Panels from '../Panels/Panels'

class cards extends Component{


    render(){
        
        const panelData = [
            {   
                message:{ 
                heading:'some heading one',
                secondHeading:'some sub head one',
                details:'some details one'},
                forum:{one:'something', two:'else'},
                money:{one:'one dollar', two:'two dollar' }
            },
            {   
                message:{    
                heading:'some heading two',
                secondHeading:'some sub head two',
                details:'some details two'},
                forum:{one:'something', two:'else'},
                money:{one:'one dollar', two:'two dollar' }
            },
            {   
                message:{    
                heading:'some heading three',
                secondHeading:'some sub head three',
                details:'some details three'},
                forum:{one:'something', two:'else'},
                money:{one:'one dollar', two:'two dollar' }
            },
            {   
                message:{    
                heading:'some heading one',
                secondHeading:'some sub head one',
                details:'some details one'},
                forum:{one:'something', two:'else'},
                money:{one:'one dollar', two:'two dollar' }
            },
            {   
                message:{    
                heading:'some heading two',
                secondHeading:'some sub head two',
                details:'some details two'},
                forum:{one:'something', two:'else'},
                money:{one:'one dollar', two:'two dollar' }
            },
            {   
                message:{    
                heading:'some heading three',
                secondHeading:'some sub head three',
                details:'some details three'},
                forum:{one:'something', two:'else'},
                money:{one:'one dollar', two:'two dollar' }
            },
            {   
                message:{    
                heading:'some heading one',
                secondHeading:'some sub head one',
                details:'some details one'},
                forum:{one:'something', two:'else'},
                money:{one:'one dollar', two:'two dollar' }
            },
            {   
                message:{    
                heading:'some heading two',
                secondHeading:'some sub head two',
                details:'some details two'},
                forum:{one:'something', two:'else'},
                money:{one:'one dollar', two:'two dollar' }
            },
            {   
                message:{    
                heading:'some heading three',
                secondHeading:'some sub head three',
                details:'some details three'},
                forum:{one:'something', two:'else'},
                money:{one:'one dollar', two:'two dollar' }
            },
            {   
                message:{    
                heading:'some heading one',
                secondHeading:'some sub head one',
                details:'some details one'},
                forum:{one:'something', two:'else'},
                money:{one:'one dollar', two:'two dollar' }
            },
            {   
                message:{    
                heading:'some heading two',
                secondHeading:'some sub head two',
                details:'some details two'},
                forum:{one:'something', two:'else'},
                money:{one:'one dollar', two:'two dollar' }
            },
            {   
                message:{    
                heading:'some heading three',
                secondHeading:'some sub head three',
                details:'some details three'},
                forum:{one:'something', two:'else'},
                money:{one:'one dollar', two:'two dollar' }
            }
        ]

        panelData.map((v,i) => v.indx = i)  
    return(
        <Aux>
            <Panels data={panelData} />            
        </Aux>
    )
}}

export default cards