const reject = require("./follow/reject")
const accept = require("./follow/accept")
const send = require("./follow/send")
const unfollow = require("./follow/unfollow")
const getFollowRequests = require("./follow/getFollowRequests")
const getFollowers = require("./follow/getFollowers")
const getFollowing = require("./follow/getFollowing")

module.exports = {
    reject,
    send,
    unfollow,
    accept,
    getFollowRequests,
    getFollowing,
    getFollowers
}