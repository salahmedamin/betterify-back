const {default:axios} = require("axios")
const url = "https://gist.githubusercontent.com/salahmedamin/24ee209b5bd41b591b7fb6807e905d47/raw/0888b5449ecda4787001b74811e645d0a74b8132/hobbies.json"

module.exports = async ({keyword, index = 0}) =>{
    const data = (
        await axios.get(url)
    )
    .data

    return data
    .filter(a=>a.title?.toLowerCase().match(new RegExp(keyword)))
    .filter( (a,i)=> i < (index*20)+20 && i >= index*20 )
    .map(a=>a.title)
}