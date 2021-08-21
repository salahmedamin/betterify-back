const { PrismaClient } = require("@prisma/client")
const getLevels = require("./add/getLevels")


const prisma = new PrismaClient()
module.exports = ({
    groupID = undefined,
    isQuit = false,
    forced = undefined,
    user = undefined,
    isRole = false,
    set = undefined,
    unset = undefined,
    isJoinReq = false,
    isInvite = false,
    accepted = undefined,
    rejected = undefined,
    received = undefined,
    commentID = undefined,
    isReply = false,
    isFollowingComment = false,
    postID = undefined,
    isShared = false,
    isTagged = false,
    isOther = undefined,
    isReact = undefined,
    my = false
}) => {
    const levels = getLevels({
        my,
        isReact,
        isOther,
        isTagged,
        isGroup: groupID,
        accepted,
        isInvite,
        isJoinReq,
        received,
        rejected,
        forced,
        isQuit,
        user,
        isRole,
        set,
        unset,
        isComment: commentID,
        isFollowingComment,
        isReply,
        isPost: postID,
        isShared
    })
    
    const {level1,level2,level3} = levels
    return require(`./generate/${level1}${level2 ? `/${level2}` : ""}${level3 ? `/${level3}` : ""}`)
}