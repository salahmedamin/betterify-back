const FormData = require("form-data")
const formdata = new FormData()
const fs = require("fs")
const { default: got } = require("got/dist/source")
const check = require("./dtube/check")

module.exports = async({ file }) => {
    try {
        formdata.append('files', fs.createReadStream(file.path))
        const data = JSON.parse((await got.post(
            'https://2.btfsu.d.tube/uploadVideo?videoEncodingFormats=240p,480p,720p,1080p&sprite=true',
            {
                body: formdata,
            }
        )).body).token
        const checked = await check({data})
        if(checked?.error) throw new Error(checked?.message)
        return checked?.encodedVideos?.map(a => ({
            hash: a.ipfsAddEncodeVideo?.hash,
            quality: a.ipfsAddEncodeVideo?.encodeSize
        }))
    }
    catch (e) {
        return {
            error: true,
            message: e.message
        }
    }
}