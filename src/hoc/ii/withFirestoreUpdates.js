
const firestoreUpdates = Wrapped => {

    return class updates extends Wrapped{

        fsUpdate = () => {

            const { collection, querie } = this.state
            
            collection
            .where( querie.prop, querie.cond, querie.val )
            .onSnapshot( snapshot => {

                if(snapshot.docChanges().length === 1) console.log('is this just once?')

                snapshot.docChanges().forEach( (key, i) => {
        
                    let data = key.doc.data()
                    data['key'] = key.doc.id
                            
                    if (key.type === "added") {
                        this.setState( prev => ({
                            isLoading: false,
                            fsData: [...prev.fsData, data]
                        }))
                        //console.log("Added posts", data.timestamp)
                    }
                    else if (key.type === "modified") {

                        this.setState( state => {
                            let index = state.fsData.indexOf( key.doc.id )
                            state.fsData.splice(index, 1, data)
                            
                            console.log("Modified posts, post should be removed?", state.fsData)
                            return {fsData: state.fsData}
                        })
                        //console.log("Modified posts", data)
                    }
                    else if (key.type === "removed") {
                        
                        this.setState({
                            fsData: this.state.fsData.filter( p => p.key !== key.doc.id)
                        })
                        //console.log("Removed posts use this.state...")
                    }
        
                }, err => this.props.snackOpen( err.message ))
            })
        }


        render(){
            return super.render()
        }
    }

}

export default firestoreUpdates