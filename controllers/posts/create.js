const { PrismaClient } = require("@prisma/client")
const getURLS = require("../../functions/getURLS")
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


    const hasURL = content && getURLS(content)?.length > 0
    const hasTaggedPerson = taggedPersons?.length > 0
    const res = await prisma.post.create({
        data: {
            owner: {
                connect: {
                    id: userID
                }
            },
            onlyFollowers,
            onlyFollowersAndFollowed,
            usersThatCanSee: {
                connect: toBeIncludedInPrivacy
            },
            privacyType,
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
            content: true,
            hasFile: true,
            hasImage: true,
            hasTaggedPerson: true,
            hasURL: true,
            hasVideo: true,
            isVocal: true,
            created_at: true,
            isCommentable: true,
            isReactable: true,
            isShareable: true,
            onlyFollowers: true,
            onlyFollowersAndFollowed: true,
            privacyType: true,
            id: true,
            tags: {
                select: {
                    hashtag: true,
                }
            },
            activities: {
                select: {
                    with: {
                        select: {
                            username: true,
                        }
                    },
                    actName: {
                        select:{
                            id: true,
                            name:true,
                            thumbnail: true
                        }
                    },
                    complimentary_relation:{
                        select:{
                            complimentary:{
                                select:{
                                    id: true,
                                    text: true,
                                    thumbnail: true,
                                }
                            },
                        }
                    }
                }
            },
            place: {
                select: {
                    name: true
                }
            },
            tagged_persons: {
                select: {
                    tagged: {
                        select: {
                            username: true
                        }
                    },
                }
            },
            urls: {
                select: {
                    URL: true,
                }
            }
        }
    })
    const done = await process_media({ postID: res.id, files: files, groupID })
    return done
        &&
        await prisma.user_activity.create({
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
        && {
        ...res,
        urls: res.urls.map(a=>a.URL),
        activities: undefined,
        activity: {
            name: res.activities.actName,
            with: res.activities.with,
            complimentary: res.activities.complimentary_relation.map(a=>({
                text: a.complimentary.text,
                thumbnail: a.complimentary.thumbnail,
                id: a.complimentary.id
            }))
        },
        multimedia: await prisma.multimedia.findMany({
            where: {
                post: {
                    id: res.id
                },
            },
            include:{
                faces:{
                    include:{
                        person:{
                            select:{
                                username:true,
                                profilePic: true,
                            }
                        }
                    }
                }
            }
        })
    } || { error: true }
}