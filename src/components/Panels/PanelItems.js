import React, { PureComponent } from 'react'
import fb from '../../Firebase/Firebase'
import { fsUpdate } from '../Firestore/firestore'
import CircularProgress from '@material-ui/core/CircularProgress'
import { getDistanceKm } from '../UserLatLon/userLatLon'
import NoPosts from '../NoPosts/NoPosts'

class panelItems extends PureComponent {

    state = {
        checked: true,
        noPosts:false,
        //fs
        isLoading: true,
        fsData: []
    }

    componentDidMount = () => {

        const { user, prop, val} = this.props
        console.log('query >>', prop,' --- ', val)

        fsUpdate(
            {
                doc: fb
                .firestore()
                .collection('posts'),
                querie: {
                    prop: prop,
                    cond: '==',
                    val: val
                }
            },

            ( noPosts, isLoading ) => this.setState( {noPosts, isLoading} ), // noPosts available

            ( data, isLoading ) => this.setState( state => { // added

                this.props.addModRmv( 'added' )

                data.forEach( post => { post.distance = getDistanceKm( 
                    user.location.lat, 
                    user.location.lon, 
                    post.user.location.lat, 
                    post.user.location.lon
                ) + ' km'})

                return {
                    fsData: [...state.fsData, ...data], 
                    isLoading,
                    updateType:'added',
                    noPosts:false
                }
            }),

            data => this.setState( state => { //modified

                this.props.addModRmv( 'modified' )

                data.distance = getDistanceKm( 
                    user.location.lat, 
                    user.location.lon, 
                    data.user.location.lat, 
                    data.user.location.lon
                ) + ' km'

                state.fsData.splice( state.fsData.findIndex( elm => (elm.key === data.key)), 1, data )
                
                return { fsData:state.fsData }
            }, 
            () => this.forceUpdate()),

            key => this.setState( state => { //removed

                this.props.addModRmv( 'removed' )

                return {
                    fsData: state.fsData.filter(p => p.key !== key)
                }
            }),

            this.props.openSnack
        )
    }

    postBar = event => {
        console.log(event)   
       }

    render() {

        const { isLoading, fsData, noPosts } = this.state
        const { Panel } = this.props 

        return (                  
            <div style={{marginTop:'35px', overflow:'auto', height:'85vh'}} >
                {
                    isLoading
                        ?   <div style={{display:'flex', alignContent:'center', justifyContent:'center', marginTop:'70px'}}>
                                <CircularProgress />
                            </div>

                        :   !noPosts                        
                                ?   fsData.map( (post, indx) => Panel( post, indx) )
                                :   <NoPosts
                                        text={
                                            `
                                                Looks like no posts are up in this location. 
                                                You can check back later. 
                                                Or post something, click bottom right.
                                            `
                                        }
                                    />
                }
            </div >
        )
    }
}

export default panelItems