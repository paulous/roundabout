import React, {PureComponent} from 'react'


const firestoreUpdates = Wrapped => {
    
    return class updates extends PureComponent{
        
        
        fsUpdate = ( { collection, querie }, added, modified, removed ) => {
            
            collection
            .where( querie.prop, querie.cond, querie.val )
            .onSnapshot( snapshot => {
                
                const fsData = []
                const doc = snapshot.docChanges()

                doc.forEach( ( key, i ) => {

                    let data = key.doc.data()
                    data['key'] = key.doc.id
                    fsData.push( data )
                            
                    if (key.type === "added" && i === doc.length-1 ) {// remember pure component

                        added( fsData, false )
                        console.log("Added posts", i, doc.length-1)
                    }
                    else if (key.type === "modified") {

                        modified( ...fsData )
                        console.log("Modified posts")
                    }
                    else if (key.type === "removed") {
                        
                        removed( key.doc.id )
                        console.log("Removed posts")
                    }
        
                }, err => this.props.snackOpen( err.message ))
            })
        }


        render(){

           return  <Wrapped {...this.props} fsUpdate={this.fsUpdate} />
        }
    }

}

export default firestoreUpdates