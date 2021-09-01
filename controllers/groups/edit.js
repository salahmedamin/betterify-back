const { PrismaClient } = require("@prisma/client")
const getGroup = require("./getGroup")
const getMembers = require("./getMembers")

const prisma = new PrismaClient()
module.exports = async ({
    groupID,
    userID,
    name = undefined,
    picture = undefined,
    isPublic = undefined
}) => {
    if (!(name || picture || isPublic)) return {
        error: true,
        message: "Missing parameters"
    }
    const currentGroup = (await getGroup({
        groupID,
        userID
    }))

    const res = await prisma.user.update({
        where: {
            id: userID,
        },
        data: {
            created_groups: {
                update: {
                    where: {
                        id: groupID
                    },
                    data: {
                        groupPic: picture,
                        isPublic,
                        name,
                        names_list: name ? {
                            create: {
                                name
                            }
                        } : undefined
                    }
                }
            },
            activities: picture || name || isPublic ? {
                createMany: [
                    {
                        name: picture ? "group_edit_picture" : undefined
                    },
                    {
                        name: name ? "group_edit_name" : undefined
                    },
                    {
                        name: isPublic ? "group_edit_privacy" : undefined
                    }
                ].filter(a => a.name).map(a => ({
                    activity: a.name,
                    group: {
                        connect: {
                            id: groupID
                        }
                    }
                }))
            } : undefined
        }
    })
    //if ok, notify members this group has changed name
    const members = res ? await getMembers({
        groupID,
        selectAll: true,
        selectMemberID: true
    }) : []
    let status = true
    if (!currentGroup.isChatGroup) {
        for (const member of members) {
            const params = {
                create: {
                    text: `${currentGroup.groupName} has recently changed its name to ${name}`,
                    type: "simple",
                    fromGroup: {
                        connect: {
                            id: groupID
                        }
                    },
                },
                user: {
                    connect: {
                        id: userID
                    }
                }
            }
            const _do = await prisma.notification_list.upsert({
                where: {
                    userID: member.id
                },
                create: {
                    notifications: params
                },
                update: {
                    notifications: params
                }
            })
            if (!_do) status = false
            break
        }
    }
    return status && res || { error: true }
}