const acceptRequest = require("./joinReq/accept")
const deleteRequest = require("./joinReq/delete")
const sendRequest = require("./joinReq/send")
const getRequests = require("./joinReq/getJoinReq")
const invites = require("./joinReq/invites")


module.exports = {
    acceptRequest,
    deleteRequest,
    sendRequest,
    getRequests,
    invites
}