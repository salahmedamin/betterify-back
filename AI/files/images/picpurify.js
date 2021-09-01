const {default:axios} = require('axios')
const FormData = require('form-data')

const picpurifyUrl = 'https://www.picpurify.com/analyse/1.1';
module.exports = async ({id, moderate : {nudity=false,weapon=false,hate_sign=false,gore=false}}) => {
    const form = new FormData()
    form.append('url_image', "https://ipfs.infura.io/ipfs/"+id)
    form.append('API_KEY', 'ERDdb4V6qDv9NIlfAqazVkSlN3PUjL0j')
    form.append('task', `porn_moderation,gore_moderation,suggestive_nudity_moderation,weapon_moderation,obscene_gesture_moderation,hate_sign_moderation`)

    const res = await axios.post(
        picpurifyUrl, 
        form, 
        { 
            headers: 
                form.getHeaders() 
            }
        )
    if(res?.data.porn_moderation?.porn_content) return {
        error: true,
        reason: "porn"
    }
    return res.data
}
