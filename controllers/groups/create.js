const { PrismaClient } = require("@prisma/client");
const uuid = require("uuid")

const prisma = new PrismaClient()
module.exports = async ({ creatorID, groupName, groupPic, isPublic, rules, members = []/* each {id:xxx} */, strictness = [], isChatGroup = false }) => {
    const res = await prisma.groups.create({
        data: {
            groupName,
            groupPic,
            unique: uuid.v4(),
            creator: {
                connect: {
                    id: creatorID
                }
            },
            group_rules: {
                createMany: {
                    data: rules
                }
            },
            group_strictness_disallowed: !isChatGroup ? {
                createMany: {
                    data: strictness
                }
            } : undefined,
            members: {
                createMany: isChatGroup ? {
                    data: [
                        ...members,
                        {
                            id: creatorID
                        }
                        ]
                        .map(a => ({
                        adderID: a.id == creatorID ? undefined : creatorID,
                        memberID: a.id,
                        isPending: false
                    }))
                }:undefined
            },
            roles: !isChatGroup ? {
                create: {
                    role: "admin",
                    user: {
                        connect: {
                            id: creatorID
                        }
                    }
                }
            }
                : undefined,
            isChatGroup,
            user_activity: {
                create: {
                    user: {
                        connect: {
                            id: creatorID
                        }
                    },
                    activity: !isChatGroup ? "group_add" : "group_chat_add"
                }
            },
            isPublic,
            chatListsGroupIsIn: {
                create: {
                    owner:{
                        connect:{
                            id: creatorID
                        }
                    },
                }
            },
            messages:{
                create:{
                    sender: {
                        connect:{
                            id:creatorID
                        }
                    },
                    isHint: true,
                    content: "group_created"
                }
            }
        }
    })
    return res
}