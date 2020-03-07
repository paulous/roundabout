
export const fsUpdate = ( { doc, querie }, noPosts, added, modified, removed, snackOpen ) => {
            
    doc
    .where( querie.prop, querie.cond, querie.val )
    .onSnapshot( snapshot => {
        
        const fsData = []
        const changed = snapshot.docChanges()

        !changed.length 
        ? noPosts( true, false )

        : changed.forEach( ( key, i ) => {

            let data = key.doc.data()
            data['key'] = key.doc.id
            fsData.push( data )
                    
            if (key.type === "added" && i === changed.length-1 ) {

                added( fsData, false )
                console.log("Added posts", i, changed.length-1)
            }
            else if (key.type === "modified") {

                modified( ...fsData )
                console.log("Modified posts")
            }
            else if (key.type === "removed") {
                
                removed( key.doc.id )
                console.log("Removed posts")
            }

        }, err => snackOpen( err.message ))
    })
}

