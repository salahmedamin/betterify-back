const got = require('got'); // if you don't have "got" - install it with "npm install got"
const fs = require('fs');
const FormData = require('form-data');
const extract = require("./dc/extract")

const apiKey = 'acc_77af64829ca7587';
const apiSecret = '69a40376fae1c17761511f713952e010';


const fetchData = async (file) => {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(file.path))
    try {
        const response = await got.post('https://api.imagga.com/v2/colors', {body: formData, username: apiKey, password: apiSecret});
        fs.unlink(file.path,()=>true)
        return response.body
    } catch (error) {
        return error.response.body
    }
}
module.exports = async(file)=>{
    return extract(await fetchData(file))
}