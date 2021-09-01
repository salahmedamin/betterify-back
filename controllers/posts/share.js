const { PrismaClient } = require("@prisma/client")
const getURLS = require("../../functions/getURLS")
const isGroupPublic = require("../groups/check/isGroupPublic")
const generateWhereCriteria = require("./generateWhereCriteria")

const prisma = new PrismaClient()
module.exports = async ({
    userID,
    postID,
    groupID = undefined,
    content = undefined,
    taggedPersons = undefined,
    place = undefined,
    activity = undefined,
    _with = undefined,
    isCommentable = undefined,
    isReactable = undefined,
    privacyType = undefined,
    onlyFollowers = undefined,
    onlyFollowersAndFollowed = undefined,
    toBeIncludedInPrivacy = []
}) => {
    if(groupID){
        const groupPublic = await isGroupPublic({ groupID })
        if(!groupPublic) return {
            error: true,
            message: "Can't share posts outside of this group"
        }
    }
    const data = await prisma.post.findFirst({
        where: {
            ...generateWhereCriteria({ viewerID: userID, postID }),
            isShareable: true,
        },
    })
    if (!data) return {
        error: true,
        message: "Can't share this one"
    }
    const isPostAlreadyShared = (await prisma.post.findFirst({
        where:{
            isShared: true,
            id: postID
        },
        select:{
            originalPost:{
                select:{
                    id: true,
                    hasVideo: true,
                    hasFile: true,
                    hasImage: true,
                    hasVocal: true
                }
            }
        }
    }))?.originalPost
    const urls = getURLS(content)
    const hasURL = content && urls.length > 0
    const hasTaggedPerson = taggedPersons?.length > 0

    const res = await prisma.user.update({
        where: {
            id: userID
        },
        data: {
            activities: {
                create: {
                    activity: "post_share",
                    post: {
                        connect: {
                            id: postID
                        }
                    },
                    group: groupID ? {
                        connect: {
                            id: groupID
                        }
                    } : undefined
                }
            },
            posts: {
                create: {
                    isShared: true,
                    hasVideo: isPostAlreadyShared?.hasVideo || data.hasVideo,
                    hasFile: isPostAlreadyShared?.hasFile || data.hasFile,
                    hasImage: isPostAlreadyShared?.hasImage || data.hasVhasImageideo,
                    hasVocal: isPostAlreadyShared?.hasVocal || data.hasVocal,
                    originalPost: {
                        connect:{
                            id: isPostAlreadyShared?.id || postID
                        }
                    },
                    content,
                    isCommentable,
                    isReactable,
                    place: place ? {
                        connectOrCreate: {
                            where: {
                                name: place?.name
                            },
                            create: {
                                name: place?.name
                            }
                        }
                    } : undefined,
                    activities: activity ? {
                        create: {
                            actName: {
                                connect: {
                                    name: activity?.name
                                }
                            },
                            complimentary_relation: activity?.complimentary ? {
                                create: {
                                    complimentary: {
                                        connectOrCreate: {
                                            where: {
                                                text: activity?.complimentary?.name
                                            },
                                            create: {
                                                text: activity?.complimentary?.name
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
                    isShareable: true,
                    hasURL,
                    urls: hasURL ? {
                        createMany: {
                            data: getURLS(content)?.map(a => ({ URL: a })),
                            skipDuplicates: true
                        }
                    } : undefined,
                    tagged_persons: hasTaggedPerson ? {
                        create: {
                            tagged: {
                                connect: taggedPersons
                            },
                        }
                    } : undefined,
                    privacyType,
                    onlyFollowers,
                    onlyFollowersAndFollowed,
                    usersThatCanSee: {
                        connect: toBeIncludedInPrivacy
                    },
                }
            }
        }
    })

    return res ? {
        success: true
    } : {
        error: true
    }
}