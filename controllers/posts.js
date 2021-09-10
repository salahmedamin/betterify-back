const create = require("./posts/create")
const comment = require("./posts/comment")
const edit = require("./posts/edit")
const _delete = require("./posts/delete")
const react = require("./posts/react")
const share = require("./posts/share")
const sendTo = require("./posts/sendTo")

const getComments = require("./posts/getComments")
const getEdits = require("./posts/getEdits")
const getFeedPosts = require("./posts/getFeedPosts")
const getSimilarPlaceOrAct = require("./posts/getSimilarPlaceOrAct")
const getProfilePosts = require("./posts/getProfilePosts")
const getSimilarTags = require("./posts/getSimilarTags")
const getSinglePost = require("./posts/getSinglePost")
const searchReacts = require("./posts/searchReacts")
const getPostMedia = require("./posts/getPostMedia")
const getReactions = require("./posts/getReactions")
const markSeen = require("./posts/markSeen")




module.exports = {
    create,
    comment,
    edit,
    _delete,
    react,
    share,
    sendTo,
    getComments,
    getEdits,
    getFeedPosts,
    getSimilarPlaceOrAct,
    getSimilarTags,
    getSinglePost,
    getProfilePosts,
    searchReacts,
    getPostMedia,
    getReactions,
    markSeen
}