const fs = require("fs");
const dtube = require("./dtube");
const ipfs = require("./ipfs");

module.exports = async (file, isVideo = false) => {
    const response = !isVideo ? 
        await ipfs({file}) : await dtube({file})
            
    fs.unlink("./uploads/"+file.filename,(err)=>{
        if(err) console.log(err)
      })
    return response
}