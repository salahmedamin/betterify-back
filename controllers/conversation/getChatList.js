const { PrismaClient } = require("@prisma/client")
const checkBlock = require("../blocking/checkBlock")
const prisma = new PrismaClient()

module.exports = async ({
    userID,
    index = 0
}) => {

    const res = await prisma.chat_list.findMany({
        where: {
            ownerID: userID
        },
        include: {
            other: {
                select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    lastOnline: true,
                    profilePic: true
                }
            },
            group: {
                select: {
                    groupName: true,
                    groupPic: true,
                    unique: true,
                    id: true,
                }
            },
            nicknames: {
                where: {
                    group: {
                        id: undefined
                    }
                },
                select: {
                    name: true,
                    named: {
                        select: {
                            id: true
                        }
                    }
                }
            },
            muting: true,
        },
        skip: index * 20,
        take: 20,
        orderBy: {
            lastModified: "asc"
        }
    })
    return await Promise.all(
        res.map(
            a => (
                {
                    name: a.other?.username || a.group?.groupName,
                    firstName: a.other?.firstName,
                    lastName: a.other?.lastName,
                    picture: a.other?.profilePic || a.group?.groupPic,
                    lastOnline: a.other?.lastOnline,
                    id: a.other?.id || a.group?.id,
                    unique: a.group?.unique,
                    isMuted: a.muting.length > 0 ? true : false,
                    nickname: !a.group ? a.nicknames[0]?.name : undefined,
                    canChat: !a.group ? await checkBlock({blockedID: a.other?.id, blockerID: userID, absolute: true}) : true
                }
            )
        )
    )
}