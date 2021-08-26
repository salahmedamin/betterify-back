const edit = require("./messages/edit")
const get = require("./messages/get")
const getEdits = require("./messages/getEdits")
const getReacts = require("./messages/getReacts")
const getReplies = require("./messages/getReplies")
const react = require("./messages/react")
const send = require("./messages/send")

module.exports = {
    send,
    react,
    get,
    getEdits,
    getReacts,
    getReplies,
    edit
}