const got = require('got')

const apiKey = 'acc_77af64829ca7587'
const apiSecret = '69a40376fae1c17761511f713952e010'

const fetchData = async (url) => {
    try {
        const response = 
            await got(
                'https://api.imagga.com/v2/tags?image_url='+url,
                {
                    username: apiKey,
                    password: apiSecret
                }
            )
        
        return JSON.parse(response.body).result.tags
            .filter((a,i)=>i<3)
            .map(a=>({
                score: a.confidence/100,
                hashtag: a.tag.en
            }))
    } catch (error) {
        return {
            error:true,
            message: error.message
        }
    }
}

module.exports = async(file)=>{
    return await fetchData(file)
}