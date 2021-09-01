const FormData = require("form-data");
const { default: got } = require("got");
const fs = require("fs")

module.exports = async ({
    type,
    image=undefined,
    video=undefined,
    disable_audio = 0
}) => {
    const formData = new FormData()
    if(image) formData.append('image', fs.createReadStream(image.path))
    else if(video){
        formData.append('video', fs.createReadStream(video.path))
        formData.append('disable_audio', disable_audio)
    }
    formData.append('type', 'file')
    const response =
        await got.post(
            'https://api.imgur.com/3/upload',
            {
                headers:{
                    Authorization: "Client-ID bbe48d4e813cef8"
                },
                body: formData,
            }
        )
            
    fs.unlink("./uploads/"+(image||video).filename,(err)=>{
        if(err) console.log(err)
      })
    const res = (JSON.parse(response.body))
    return res.success ? res.data.link : res
}