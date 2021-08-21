const {default:axios} = require("axios")
const url = "https://gist.githubusercontent.com/salahmedamin/24ee209b5bd41b591b7fb6807e905d47/raw/0888b5449ecda4787001b74811e645d0a74b8132/hobbies.json"

module.exports = async keyword =>{
    return (
        await axios.get(url)
    )
    .data
    .filter(
        a=>a.name?.toLowerCase().startsWith(keyword)
    )
}