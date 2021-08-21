// const { default: axios } = require("axios")
// const decrypt = require("../../functions/files/decrypt")
// const fs = require("fs")
// const { Readable } = require('stream');
const { default: got } = require("got/dist/source")

module.exports = ({link,res}) => {
    got.stream(link).pipe(res)
}

// function bufferToStream(buffer) { 
//     var stream = new Readable();
//     stream.push(buffer);
//     stream.push(null);
//     stream.pipe(fs.createWriteStream("test.png"))
//     return stream;
//   }

// module.exports = async({link, res, ext, key, iv})=>{
//     const gotten = (await axios.get(link)).data
//     const data = decrypt(gotten, key, iv)
//     // console.log(fs.createReadStream(data))
//     // fs.writeFileSync(`text.${ext}`,data)
//     // got.stream(bufferToStream(Buffer.from(data))).pipe(res)
//     return true
// }