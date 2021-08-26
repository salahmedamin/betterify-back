const _delete = require("./conversation/delete")
const getChatList = require("./conversation/getChatList")
const muting = require("./conversation/muting")
const nicknames = require("./conversation/nicknames")
module.exports = {
    nicknames,
    _delete,
    getChatList,
    muting
}