const create = require("./comments/create"),
remove = require("./comments/delete"),
edit = require("./comments/edit"),
getEdits = require("./comments/getEdits"),
getHighestReact = require("./comments/getHighestReact"),
getReacts = require("./comments/getReacts"),
getReplies = require("./comments/getReplies"),
react = require("./comments/react"),
reply = require("./comments/reply")


module.exports = {
    create,
    remove,
    edit,
    getEdits,
    getHighestReact,
    getReacts,
    getReplies,
    react,
    reply
}