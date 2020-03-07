import React, {Component} from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import styler from '../../Styler/Styler'
import { FirestoreCollection } from 'react-firestore'


const MyButton = styler(Button)({
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .30)'
})

class message extends Component {

    state = {count:0}

    counter = bool => {       
        
        this.setState(prev => ({count:bool ? prev.count +1 : prev.count -1}))       
    }

    render(){

        const {count} = this.state

        return (
          <div>
            <Paper elevation={0}>
              <Typography variant="headline" component="h3">
                This is a sheet of paper. Message
              </Typography>
              <Typography component="div">
                {this.props.data.details}
              </Typography>
              <MyButton onClick={this.counter.bind(this, true)}>Up</MyButton>
              <MyButton onClick={this.counter.bind(this, false)}>Down</MyButton>
              <br/>
              {count}
              <br/>
              <FirestoreCollection
                path="users"
                //sort="publishedDate:desc,authorName"
                render={({ isLoading, data }) => {
                  return isLoading ? (
                    <div>loading...</div>
                  ) : (
                    <div>
                      <h2>user Details - distance, expanded rep </h2>
                      <ul>
                        {data.map(story => (
                          <li key={story.id}>
                            {story.id}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }}
              />
            </Paper>
          </div>
        )
    }
}

export default message