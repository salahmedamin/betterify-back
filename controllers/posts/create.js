const { PrismaClient } = require("@prisma/client")
const getURLS = require("../../functions/getURLS")
const groupValid = require("../groups/check/isGroupValid")
const generateSelect = require("./generateSelect")
const process_media = require("../multimedia/process_media")
const extract_hashtags = require("../../middlewares/user/extract_hashtags")

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

    if (groupID) {
        const isGroupValid = await groupValid({ groupID })
        if (!isGroupValid) return {
            error: true,
            message: "This group is unavailable"
        }
        const isMember = await prisma.groups_join_requests.findFirst({
            where: {
                group: {
                    id: groupID,
                    isDeleted: false
                },
                member: {
                    id: userID
                },
                isPending: false,
                isDeleted: false
            }
        })
        if (!isMember) return {
            error: true,
            message: "You are not a member in this group"
        }
    }
    const hasURL = content && getURLS(content)?.length > 0
    const hasTaggedPerson = taggedPersons?.length > 0
    const initHashtags = extract_hashtags({ message: content })

    const res = await prisma.post.create({
        data: {
            owner: {
                connect: {
                    id: userID
                }
            },
            onlyFollowers: groupID ? false : onlyFollowers,
            onlyFollowersAndFollowed: groupID ? false : onlyFollowersAndFollowed,
            usersThatCanSee: !groupID ? {
                connect: toBeIncludedInPrivacy
            } : undefined,
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
            ...generateSelect({ viewerID: userID }),
            tags: false,
        }
    })

    const done = await process_media({ postID: res.id, files: files, groupID, initHashtags })
    if (done.error) return done
    const createdActivity = await prisma.user_activity.create({
        data: {
            post: {
                connect: {
                    id: res.id
                }
            },
            user: {
                connect: {
                    id: userID
                }
            }
        }
    })
    if (!done) {
        await prisma.post.delete({
            where: {
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
            urls: res.urls.map(a => a.URL),
            activities: undefined,
            activity: {
                name: res.activities?.actName,
                with: res.activities?.with,
                complimentary: res.activities?.complimentary_relation?.map(a => ({
                    text: a.complimentary?.text
                }))
            },
            hasFile: done.includes("file"),
            hasVocal: done.includes("audio"),
            hasImage: done.includes("image"),
            hasVideo: done.includes("video"),
            multimedia: await prisma.multimedia.findMany({
                where: {
                    post: {
                        id: res.id
                    }
                },
                select: {
                    type: true,
                    unique: true,
                    doubtedContent: {
                        select: {
                            media: {
                                select: {
                                    id: true
                                }
                            },
                            type: true
                        }
                    },
                    duration: true,
                    video_qualities: {
                        select: {
                            quality: true,
                            videoHash: true
                        }
                    }
                },
                take: 4,
            })
        } : { error: true }
}