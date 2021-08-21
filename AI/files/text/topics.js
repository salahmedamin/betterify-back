const axios = require("axios").default

module.exports = async(req,res)=>{
    const link = `https://api.meaningcloud.com/topics-2.0?key=2abbbcfb2d734ebc576137b7561041c4&txt=${req.body.txt}&lang=auto&tt=e`
    const data = await axios.get(
        link,
        {
            headers:{
                "Content-Type": 'multipart/form-data'
            }
        }
    )
    res.send(data.data)
}