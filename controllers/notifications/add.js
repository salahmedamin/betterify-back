const { PrismaClient } = require("@prisma/client")
const generateText = require("./generateText")


const prisma = new PrismaClient()
module.exports = async ({
    userID, //id of user to notify
    link, //where to redirect user on clicking notif
    isQuit = false,
    forced = undefined,
    user = undefined,
    role = false,
    set = undefined,
    unset = undefined,
    isInvite = false,
    accepted = undefined,
    rejected = undefined,
    received = undefined,
    isReply = false,
    isFollowingComment = false,
    isShared = false,
    isTagged = false,
    isReact = undefined,
    my = false,
    postID = undefined,
    commentID = undefined,
    groupID = undefined,
    joinReqID = undefined,
    username = undefined,
}) => {
    const notif = await generateText({
        my, //is it my own post : boolean
        isReact, //is it a post reaction : boolean
        isTagged, //am i being tagged : boolean
        accepted, //join request status : boolean
        isInvite, //is it an invite to join a group : boolean
        received, //join request status : boolean
        rejected, //join request status : boolean
        forced, //is a member forcefully kicked out of group : boolean
        isQuit, //is this related to quitting a group : boolean
        user, //to mark if a user quit the group : boolean
        role, //is this related to role management : boolean
        set, //role management - either set : boolean
        unset, //role management - or unset : boolean
        isFollowingComment, //has this user been following a comment : boolean
        isReply, //is this a reply to comment : boolean
        isShared, //has this post been shared: boolean
        username, //has this notif come from a person: String
        postID, //id of post which notif came from: Int
        commentID, //id of comment which notif came from: Int
        joinReqID, //id of join request which notif came from: Int
        groupID, //id of group which notif came from: Int
    })
    
    if(notif.type == "profilevisited"){
        if(await prisma.single_notification.findFirst({
            where:{
                type:"profilevisited",
                fromPerson:{
                    username
                },
                list:{
                    user:{
                        id: userID
                    }
                }
            }
        })) return false
    }

    const params = {
        redirectTo: link,
        fromGroup:groupID ? {
            connect:{
                id: groupID
            }
        } : undefined,
        fromGroupJoinRequest:groupID && joinReqID ? {
            connect:{
                id: joinReqID
            }
        }: undefined,
        fromComment: commentID ? {
            connect:{
                id: commentID
            }
        } : undefined,
        fromPerson:username ? {
            connect:{
                username
            }
        } : undefined,
        fromPost:postID ? {
            connect:{
                id: postID
            }
        } : undefined,
        text: notif.text,
        type: notif.type,
        isSeen: false,
    }

    const ok = await prisma.notification_list.upsert({
        where:{
            userID
        },
        create:{
            user:{
                connect:{
                    id: userID
                }
            },
            notifications:{
                create: params
            }
        },
        update:{
            notifications:{
                create: params
            }
        }
    })
}