import React from 'react'
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'
import { FaceIcon, MapMarkerIcon, ShapeIcon, MapMarkerDistanceIcon } from 'mdi-react'
import styled from 'styled-components'
import styler from '../Styler/Styler'

const StyledInfoChips = styled('div')`
    display:flex;
    flex-flow: row wrap;
    justify-content:center;
    align-items:flex-start;
    align-content:center;

    @media ( max-width: 800px ) {
    };
`
const avatarStyles = { background:'white', border:'1px solid lightgray' }

const chipbar = ({ post, iconSize, fontSize }) => {

    const StyledChip = styler( Chip )( theme => ({ margin: '5px', fontSize:fontSize }) )

     return(
        <StyledInfoChips>
            <StyledChip avatar={
                <Avatar style={ avatarStyles }>
                    <FaceIcon size={iconSize} />
                </Avatar>
            }
                label={ post.user.name }
                variant="outlined"
            />
            <StyledChip avatar={
                <Avatar style={ avatarStyles }>
                    <ShapeIcon size={iconSize} />
                </Avatar>
            } 
                label={ post.category }
                variant="outlined"
            />
            <StyledChip avatar={
                <Avatar style={ avatarStyles }>
                    <MapMarkerIcon size={iconSize} />
                </Avatar>
            }
                label={ `${post.user.location.lev_0}, ${post.user.location.lev_2}, ${post.user.location.address.road}`}
                variant="outlined"
            />
            <StyledChip avatar={
                <Avatar style={ avatarStyles }>
                    <MapMarkerDistanceIcon size={iconSize} />
                </Avatar>
            }
                label={ post.distance }
                variant="outlined"
            />
        </StyledInfoChips>
     )
}

export default chipbar