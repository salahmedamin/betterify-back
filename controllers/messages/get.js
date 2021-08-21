const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

module.exports = async ({
    userID,
    otherID = undefined,
    groupID = undefined,
    index = 0
}) => {
    try {
        const list = await prisma.message.findMany({
            where: {
                //get non-deleted messages
                isDeleted: false,
                OR: otherID ? [
                    //(sender or receiver) or in group 
                    {
                        sender: {
                            id: userID
                        },
                        receiver: {
                            id: otherID
                        }
                    },
                    {
                        sender: {
                            id: otherID
                        },
                        receiver: {
                            id: userID
                        }
                    }
                ] : undefined,
                group: groupID ? {
                    members: {
                        some: {
                            id: userID
                        }
                    },
                    isChatGroup: true
                } : undefined,
                chatList: {
                    some: {
                        owner:{
                            id: userID
                        },
                        OR:[
                            {
                                group:groupID ? {
                                    id: groupID
                                }:undefined
                            },
                            {
                                other:otherID?{
                                    id: otherID
                                }:undefined
                            }
                        ]
                    }
                }
            },
            include: {
                sender: groupID ? {
                    select: {
                        username: true,
                        profilePic: true,
                    }
                } : false,
                personsTagged: {
                    select: {
                        tagged: {
                            select: {
                                username: true
                            }
                        }
                    }
                },
                edits: {
                    select: {
                        text: true
                    },
                    take: 1,
                    orderBy: {
                        created_at: "desc"
                    }
                },
                replyToID: true,
                message_reacts: {
                    orderBy: {
                        created_at: "desc"
                    }
                },
                message_multimedia: {
                    select: {
                        type: true,
                        unique: true
                    }
                }
            },
            skip: index * 20,
            take: 20
        })
        return list.map(a=>({
            ...a,
            personsTagged: a.personsTagged.tagged.map(
                e=>e.username
            )
        }))
    }
    catch (e) {
        return {
            error: true,
            message: e.message,
            stack: e.stack
        }
    }
}