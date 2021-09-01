const { PrismaClient } = require("@prisma/client")
const checkBlock = require("../blocking/checkBlock")
const isMember = require("../groups/check/isMember")
const getMembers = require("../groups/getMembers")
const generateWhereCriteria = require("./generateWhereCriteria")

const prisma = new PrismaClient()
module.exports = async ({ senderID, postID, receiverID = undefined, groupID = undefined }) => {
    if (groupID) {
        //when sending post to a group
        const isMemberOfGroup = await isMember({
            groupID,
            userID: senderID,
            checkIsChatGroup: true
        })
        if (!isMemberOfGroup) return {
            error: true,
            message: "Can't send this post"
        }
    }
    else if (receiverID) {
        //when sending post to a person
        const blockExists = await checkBlock({
            blockedID: receiverID,
            blockerID: senderID,
            absolute: true
        })
        if (blockExists) return {
            error: true,
            message: "Can't send a message to this user"
        }
    }

    //if this post is shared and you want to send it from the shared one
    //we gotta send the original one :/
    const isShared = await prisma.post.findFirst({
        where: {
            id: postID,
            isShared: true
        },
        select: {
            originalPost: {
                select: {
                    id: true
                }
            }
        }
    })

    //trying to get post group, if it was shared => original group
    const postParentGroup = await prisma.post.findFirst({
        where: {
            id: isShared?.originalPost.id || postID,
        },
        select: {
            group: {
                select: {
                    id: true,
                    isDeleted: true,
                    isPublic: true
                }
            }
        }
    })

    //if this post is coming from a group (shared / original)
    if (postParentGroup) {
        //if this group is deleted
        if(postParentGroup.group.isDeleted) return {
            error: true,
            message:"Group containing this post was deleted"
        }
        //if this group is not public, you must be member
        if(!postParentGroup.group.isPublic){
            const isMemberOfParentGroup = await isMember({
                groupID: postParentGroup?.group?.id,
                userID: senderID
            })
            if (!isMemberOfParentGroup) return {
                error: true,
                message: ""
            }
        }
    }

    const data = await prisma.post.findFirst({
        where: {
            ...generateWhereCriteria({ viewerID: receiverID, postID: isShared?.originalPost.id || postID }),
        },
        include: {
            multimedia: {
                select: {
                    type: true,
                    unique: true
                }
            }
        }
    })

    if (!data) return {
        error: true,
        message: "Can't send this post."
    }
    const hasOneOnly = data.multimedia.length == 1
    let type = hasOneOnly ? data.multimedia[0].type : undefined

    const res = await prisma.message.create({
        data: {
            isFromPost: true,
            hasFile: hasOneOnly && type == "file",
            hasImage: hasOneOnly && type == "image",
            hasVideo: hasOneOnly && type == "video",
            hasVocal: hasOneOnly && type == "audio",
            group: groupID ? {
                connect: {
                    id: groupID
                }
            } : undefined,
            receiver: receiverID ? {
                connect: {
                    id: receiverID
                }
            } : undefined,
            sender: {
                connect: {
                    id: senderID
                }
            },
            post: {
                connect: {
                    id: isShared?.originalPost?.id || postID
                }
            }
        },
        include: {
            post: hasOneOnly ? {
                select: {
                    multimedia: {
                        take: 1,
                        select: {
                            type: true,
                            unique: true
                        }
                    },
                    group: {
                        select: {
                            groupName: true,
                            unique: true,
                            groupPic: true,
                        }
                    },
                    owner: {
                        select: {
                            username: true,
                            firstName: true,
                            lastName: true,
                            profilePic: true
                        }
                    }
                }
            } : false
        }
    })
    if (!res) return {
        error: true,
        message: "An internal error occured"
    }
    if (groupID) {

        const members = await getMembers({
            groupID,
            selectAll: true,
            selectMemberID: true,
        })

        const ok = await prisma.$transaction(
            [...members, { id: senderID }]
                .map(
                    a =>
                        prisma.chat_list.upsert({
                            where: {
                                ownerID_groupID: {
                                    ownerID: a.id,
                                    groupID
                                }
                            },
                            update: {
                                messages: {
                                    connect: {
                                        id: res.id
                                    }
                                }
                            },
                            create: {
                                group: {
                                    connect: {
                                        id: groupID
                                    }
                                },
                                owner: {
                                    connect: {
                                        id: a.id
                                    }
                                },
                                messages: {
                                    connect: {
                                        id: res.id
                                    }
                                }
                            }
                        })
                )
        )

        if (ok) return {
            success: true
        }
    }
    else if (receiverID) {
        const ok = await prisma.$transaction(
            [
                {
                    ownerID: receiverID,
                    otherID: senderID
                },
                {
                    otherID: receiverID,
                    ownerID: senderID
                }
            ].map(a =>
                prisma.chat_list.upsert({
                    where: {
                        ownerID_otherID: {
                            ...a
                        }
                    },
                    update: {
                        messages: {
                            connect: {
                                id: res.id
                            }
                        }
                    },
                    create: {
                        other: {
                            connect: {
                                id: a.otherID
                            }
                        },
                        owner: {
                            connect: {
                                id: a.ownerID
                            }
                        },
                        messages: {
                            connect: {
                                id: res.id
                            }
                        }
                    }
                })
            )
        )

        if (ok) return {
            success: true
        }

    }

    return {
        error: true
    }
}