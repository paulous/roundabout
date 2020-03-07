import React, {Component} from 'react'
import fb from '../../Firebase/Firebase'
import CircularProgress from '@material-ui/core/CircularProgress'
import SwipeableViews from 'react-swipeable-views'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import styler from '../Styler/Styler'
import { AccountCircleIcon, ForumIcon, SquareIncCashIcon } from 'mdi-react'
import Profile from './Profile/Profile'
import Forum from './Forum/Forum'
import Money from './Money/Money'

class tabs extends Component {
    state = {
        value: 0,
        tabsData:null,
        isLoading:true
    }

    componentDidMount = () => {

        fb
            .firestore()
            .collection('tabs')
            .doc(this.props.data.user.uid)
            .get()
            .then( doc => {
                console.log(doc.data(), 'doc data stuff', 'userid?????? ',this.props.data.user.uid)
                this.setState({
                    isLoading: false,
                    tabsData: doc.data()
                })
            })
            .catch( error => console.log(error.code, error.message))
    }

    handleChange = (event, value) => {
        this.setState({value})
        console.log(value, ' value')
    }

    handleChangeIndex = index => {
        this.setState({value: index}) 
    }

    render() {

        const theme = styler(Tabs)(theme => theme)
        const {value, tabsData, isLoading} = this.state

        const iconMargin = {marginBottom:'20px'}

        return (
            <React.Fragment>
                <Tabs value={value} onChange={this.handleChange} style={{...iconMargin, marginTop:'20px'}}
                    //indicatorColor="primary"
                    //textColor="primary"
                    fullWidth scrollable scrollButtons="auto">
                    <Tab icon={<AccountCircleIcon style={iconMargin} size={40} color={'red'} />}/>
                    <Tab icon={<ForumIcon style={iconMargin} size={40} color={'red'} />}/>
                    <Tab icon={<SquareIncCashIcon style={iconMargin} size={40} color={'red'} />}/>
                </Tabs>
                <SwipeableViews
                    axis={theme.direction === 'rtl'
                    ? 'x-reverse'
                    : 'x'}
                    index={value}
                    onChangeIndex={this.handleChangeIndex}>
                    {isLoading ? <CircularProgress /> : <Profile data={tabsData} />}
                    {isLoading ? <CircularProgress /> : <Forum data={tabsData} />}
                    {isLoading ? <CircularProgress /> : <Money data={tabsData} />}
                </SwipeableViews>
            </React.Fragment>
        )
    }
}

export default tabs
