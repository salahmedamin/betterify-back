const fromAPI = require("./search/fromAPI"),
const fromDB = require("./search/fromDB")

module.exports = async({keyword})=>{
    return [
        ...(await fromAPI({keyword})),
        ...(await fromDB({keyword}))
    ]
}