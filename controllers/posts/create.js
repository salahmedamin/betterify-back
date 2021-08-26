const { PrismaClient } = require("@prisma/client")
const getURLS = require("../../functions/getURLS")
const groupValid = require("../groups/check/isGroupValid")
const generateSelect = require("./generateSelect")
const process_media = require("./media/process_media")

const prisma = new PrismaClient()
module.exports = async ({
    userID,
    groupID = undefined,
    content = undefined,
    taggedPersons = undefined,
    files = [],
    place = undefined,
    activity = undefined,
    _with = undefined,
    isCommentable = undefined,
    isReactable = undefined,
    isShareable = undefined,
    privacyType = undefined,
    onlyFollowers = undefined,
    onlyFollowersAndFollowed = undefined,
    toBeIncludedInPrivacy = []
}) => {

    if(groupID){
        const isGroupValid = await groupValid({groupID})
        if(!isGroupValid) return {
            error: true,
            message: "This group is unavailable"
        }
        const isMember = await prisma.groups_join_requests.findFirst({
            where:{
                group:{
                    id: groupID,
                    isDeleted: false
                },
                member:{
                    id: userID
                },
                isPending: false,
                isDeleted: false
            }
        })
        if(!isMember) return {
            error: true,
            message: "You are not a member in this group"
        }
    }
    const hasURL = content && getURLS(content)?.length > 0
    const hasTaggedPerson = taggedPersons?.length > 0
    const res = await prisma.post.create({
        data: {
            owner: {
                connect: {
                    id: userID
                }
            },
            onlyFollowers: groupID ? false : onlyFollowers,
            onlyFollowersAndFollowed:groupID ? false : onlyFollowers,
            usersThatCanSee: !groupID ? {
                connect: toBeIncludedInPrivacy
            } : undefined ,
            privacyType: !groupID ? privacyType : undefined,
            isShareable,
            isReactable,
            isCommentable,
            place: place ? {
                connectOrCreate: {
                    where: {
                        name: place?.name
                    },
                    create: {
                        name: place?.name
                    }
                },
            } : undefined,
            activities: activity ? {
                create: {
                    actName: {
                        connectOrCreate: {
                            where: {
                                name: activity?.name
                            },
                            create: {
                                name: activity?.name,
                            }
                        }
                    },
                    complimentary_relation: activity?.complimentary ? {
                        create:{
                            complimentary:{
                                connectOrCreate:{
                                    where:{
                                        text: activity?.complimentary?.name
                                    },
                                    create:{
                                        text: activity?.complimentary?.name,
                                        thumbnail: activity?.complimentary?.thumbnail
                                    }
                                }
                            }
                        }
                    }
                    : undefined,
                    with: {
                        connect: _with
                    }
                }
            } : undefined,

            group: groupID ? {
                connect: {
                    id: groupID
                }
            } : undefined,
            content,
            hasTaggedPerson,
            urls: hasURL ? {
                createMany: {
                    data: getURLS(content)?.map(a => ({ URL: a })),
                    skipDuplicates: true
                }
            } : undefined,
            tagged_persons: taggedPersons?.length > 0 ? {
                create: {
                    tagged: {
                        connect: taggedPersons
                    },
                }
            } : undefined,
            user_activity: {
                create: {
                    user: {
                        connect: {
                            id: userID
                        }
                    },
                    activity: "post_add",
                }
            }
        },
        select: {
            ...generateSelect({viewerID: userID})
        }
    })
    const done = await process_media({ postID: res.id, files: files, groupID })
    if(done.error) return done
    const createdActivity = await prisma.user_activity.create({
        data:{
            post:{
                connect:{
                    id: res.id
                }
            },
            user:{
                connect:{
                    id: userID
                }
            }
        }
    })
    if(!done){
        await prisma.post.delete({
            where:{
                id: postID
            }
        })
        return {
            error: true,
            message: "An internal error occured"
        }
    }
    return createdActivity
        ? {
        ...res,
        urls: res.urls.map(a=>a.URL),
        activities: undefined,
        activity: {
            name: res.activities?.actName,
            with: res.activities?.with,
            complimentary: res.activities?.complimentary_relation?.map(a=>({
                text: a.complimentary?.text,
                thumbnail: a.complimentary?.thumbnail,
                id: a.complimentary?.id
            }))
        },
        multimedia: await prisma.multimedia.findMany({
            where:{
                post:{
                    id: res.id
                }
            },
            take: 4,
        })
    } : { error: true }
}