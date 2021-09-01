const multer = require("multer")
const makeid = length=>{
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')   
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + makeid(13)+"."+file.mimetype.split("/")[1])      
    }
})
module.exports = multer({ storage: storage })