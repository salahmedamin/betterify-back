const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()


const getLevels = require("./add/getLevels")


module.exports = async({
    username,
    groupID = undefined,
    isQuit = undefined,
    forced = undefined,
    user = undefined,
    role = undefined,
    set = undefined,
    unset = undefined,
    isJoinReq = undefined,
    isInvite = undefined,
    accepted = undefined,
    rejected = undefined,
    received = undefined,
    commentID = undefined,
    isReply = undefined,
    isFollowingComment = undefined,
    postID = undefined,
    isShared = undefined,
    isTagged = undefined,
    isOther = undefined,
    isReact = undefined,
    my = undefined
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
        role,
        set,
        unset,
        isComment: commentID,
        isFollowingComment,
        isReply,
        isPost: postID,
        isShared
    })
    
    const {level1,level2,level3} = levels
    return require(`./generate/${level1}${level2 ? `/${level2}` : ""}${level3 ? `/${level3}` : ""}`)({
        commentID,
        groupID,
        postID,
        username,
        groupName: (await prisma.groups.findFirst({where:{id:groupID}})).groupName,
        role
    })
}