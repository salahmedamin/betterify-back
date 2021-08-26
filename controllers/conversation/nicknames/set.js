const { PrismaClient } = require("@prisma/client")
const getNickname = require("./getNickname")

const prisma = new PrismaClient()
module.exports = async ({ userID = undefined, groupID = undefined, otherID = undefined, name = '' }) => {
    const isNamedAlready = await getNickname({userID, groupID, otherID})
    const res = await prisma.chat_list.update({
        where: {
            owner: {
                id: userID
            },
            group: {
                id: groupID
            },
            other: {
                id: otherID
            }
        },
        data: {
            nicknames: {
                create: !isNamedAlready && name.length > 0 ? {
                    name,
                    namer: {
                        connect: {
                            id: userID,
                        }
                    },
                    named: {
                        connect: {
                            id: otherID
                        }
                    },
                    group: {
                        connect: {
                            id: groupID
                        }
                    }
                } : undefined,
                update: isNamedAlready && name.length > 0 ? {
                    where: {
                        namerID_namedID_groupID: {
                            namedID: otherID,
                            namerID: userID,
                            groupID
                        }
                    },
                    data: {
                        name
                    }
                } : undefined,
                delete: isNamedAlready && name.length == 0 ? {
                    namerID_namedID_groupID: {
                        namedID: otherID,
                        namerID: userID,
                        groupID
                    }
                }: undefined
            }
        }
    })

    return res ? { success: true } : { error: true }
}