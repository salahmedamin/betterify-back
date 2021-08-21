const FormData = require("form-data");
const { default: got } = require("got");
const fs = require("fs")

module.exports = async (file) => {
    const formData = new FormData()
    formData.append('file', fs.createReadStream(file.path))
    const response =
        await got.post(
            'https://pixeldrain.com/api/file',
            {
                body: formData,
            }
        )
            
    fs.unlink("./uploads/"+file.filename,(err)=>{
        if(err) console.log(err)
      })
    return (JSON.parse(response.body))
    // FORMAT
    // {
    //     "success": true,
    //     "id": "cvxx65sC"
    // }
}