const {default:axios} = require('axios')
const FormData = require('form-data')

const picpurifyUrl = 'https://www.picpurify.com/analyse/1.1';
module.exports = async ({id, moderate : {nudity=false,weapon=false,hate_sign=false}}) => {
    const form = new FormData()
    form.append('url_image', "https://pixeldrain.com/api/file/"+id)
    form.append('API_KEY', 'ERDdb4V6qDv9NIlfAqazVkSlN3PUjL0j')
    form.append('task', `porn_moderation,gore_moderation${nudity ? ",suggestive_nudity_moderation":""}${weapon ? ",weapon_moderation":""}${hate_sign ? ",obscene_gesture_moderation,hate_sign_moderation":""}`)

    const res = await axios.post(
        picpurifyUrl, 
        form, 
        { 
            headers: 
                form.getHeaders() 
            }
        )
    return res.data
}
