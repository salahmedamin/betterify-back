const { default: axios } = require("axios")

module.exports = async({
    userID
})=>{
    return `${userID} you are recommended to watch`
}