const reject = require("./follow/reject")
const accept = require("./follow/accept")
const send = require("./follow/send")
const unfollow = require("./follow/unfollow")
const getFollowRequests = require("./follow/getFollowRequests")
const getFollowers = require("./follow/getFollowers")
const getFollowing = require("./follow/getFollowing")
const deletefollow = require("./follow/deletefollow")

module.exports = {
    reject,
    send,
    unfollow,
    accept,
    getFollowRequests,
    getFollowing,
    getFollowers,
    deletefollow
}