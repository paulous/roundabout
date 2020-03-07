import React from 'react'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Logo from '../Logo/Logo'

export default props => (
    <div style={{display:'flex', flexFlow:'column', alignItems:'center', marginTop:'30px', padding:'0 15%'}}>
        <Logo 
            //className={}
            color={'#ccc'}
            size={72}
        /> 
        <Typography variant="body1" gutterBottom align='center'>
            {props.text}
        </Typography>
    </div>
)