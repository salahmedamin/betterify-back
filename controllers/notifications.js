const add = require("./notifications/add")
const empty = require("./notifications/empty")
const getUserNotifs = require("./notifications/getUserNotifs")
const hide = require("./notifications/hide")

module.exports = {
    getUserNotifs,
    add,
    empty,
    hide
}