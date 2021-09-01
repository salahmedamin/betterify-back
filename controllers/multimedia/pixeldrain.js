const FormData = require("form-data");
const { default: got } = require("got");
const fs = require("fs");
const dtube = require("./dtube");

module.exports = async (file, isVideo = false) => {
    const formData = new FormData()
    formData.append('file', fs.createReadStream(file.path))
    const response = !isVideo ? 
        await got.post(
            'https://pixeldrain.com/api/file',
            {
                body: formData,
            }
        ) : await dtube({file})
            
    fs.unlink("./uploads/"+file.filename,(err)=>{
        if(err) console.log(err)
      })
    return !isVideo ? (JSON.parse(response.body)) : response
    // FORMAT
    // {
    //     "success": true,
    //     "id": "cvxx65sC"
    // }
}