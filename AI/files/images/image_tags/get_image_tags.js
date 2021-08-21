const got = require('got'); // if you don't have "got" - install it with "npm install got"
const fs = require('fs');
const FormData = require('form-data');

const apiKey = 'acc_77af64829ca7587';
const apiSecret = '69a40376fae1c17761511f713952e010';

const fetchData = async (file) => {
    try {
        const formData = new FormData();
        formData.append('image', fs.createReadStream(file.path))
        const response = 
            await got
            .post(
                'https://api.imagga.com/v2/tags',
                {
                    body:formData,
                    username: apiKey,
                    password: apiSecret
                }
            );
        fs.unlink(file.path,()=>true)
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