const axios = require("axios").default

module.exports = async(req,res)=>{
    const link = `https://api.meaningcloud.com/summarization-1.0?key=2abbbcfb2d734ebc576137b7561041c4&limit=${req.body.percentage||0.75}&txt=${req.body.txt}`
    
    const data = await axios.get(link)
    res.send(data.data)
}