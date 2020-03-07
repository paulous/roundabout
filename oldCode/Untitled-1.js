export const chatSocket = {

  data(){
    return{
      //inputTxt:'',
      messages:[],
      joined:{},
      exited:{},
      inRoom:'',
      user:eventBus.userdata
    }
  },

  sockets:{

    connect(){
      console.log('connected');
      eventBus.postrooms.forEach( post => {
        console.log('connected with eb rooms');

        this.$socket.emit( 'join room', { post, evBus:true } )
      })
      /*var sockId = this.$socket.id
      this.$socket.emit('initRoom', sockId)*/
    },

    disconnecting(d){
      console.log('disconnecting client');
      //this.$socket.emit('room', {this.inRoom'...has disconnected'})
    },

    disconnect(d){
      console.log('disconnect client');
    },

    message( data ){

      if( data.joinedMsg ){

        console.log('from message... joined');
        this.joined = data
      }
      else if( data.post.key == this.inRoom ){

        console.log('from message... you are in this room');
        //Your message or someone elses
        data.email = data.email === this.user.email ? true : false
        // Just joined or member
        this.joined = {}
        this.messages.push( data )

      }
      else{

        console.log('from message... your room but your not in it');
        // Just joined or member
          this.joined = {}
          console.log('data', data);
          eventBus.navalerts.push( data )
      }
    },

    getMessages( msgs ){

      msgs.forEach(v => {
        v.email = v.email === this.user.email ? true : false
      })
      console.log('get messages...');

      this.messages = msgs
    },

    leftRoom( data ){
      console.log('exited room...');
      this.exited = data
    }
  },

  methods:{

    joinRoom( post ){

      let data = {
        joinedMsg:true,
        name:this.user.name,
        email:this.user.email,
        post
      }
      // join via postroom
      if( eventBus.postrooms.some( p => p.key === post.key )){
          console.log('join postroom');
          this.$socket.emit( 'join postroom', data )
        }
        else{// join via join
          console.log('join room');
          this.$socket.emit( 'join room', data )
        }

      this.inRoom = post.key
      this.joined = data
    },

    leaveRoom( post ){

      this.inRoom = ''
      this.messages = []
      //if it was your room that you left
      if( eventBus.postrooms.some( p => p.key === post.key )) return

      let data = {
        exitedMsg:true,
        name:this.user.name,
        email:this.user.email,
        post
      }

      this.$socket.emit( 'leave room', data )
    },

    emitMsg( msg, post, callback ){

      let data = {
        name:this.user.name,
        email:this.user.email,
        msg:msg,
        post
      }

      this.$socket.emit('message', data)

      data.email = true
      this.messages.push( data )
      callback()
    },

    deleteRooms( rooms ){

      this.$socket.emit( 'delete rooms', rooms )

      if( rooms.hasOwnProperty( this.inRoom ) ) {
        this.messages = []
      }
    },

    disconnectServer(){
      this.$socket.emit( 'disconnect', 'Just disconnected')
    }
  },

  created(){
    eventBus.joinRoom = this.joinRoom
    eventBus.leaveRoom = this.leaveRoom
    eventBus.emitMsg = this.emitMsg
  }
}