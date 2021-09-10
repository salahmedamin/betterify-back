const { PrismaClient } = require("@prisma/client");
const checkBlock = require("../blocking/checkBlock");
const notifications = require("../notifications");
const getCommonFollowers = require("./profile/getCommonFollowers");
const getCommonFollowing = require("./profile/getCommonFollowing");
const getFollowersCount = require("./profile/getFollowersCount");
const getFollowingCount = require("./profile/getFollowingCount");
const getRatingDetails = require("./rating/getRatingDetails");
const prisma = new PrismaClient()

module.exports = async ({
    username,
    selectHobbies = true,
    selectBio = true,
    selectEmail = false,
    selectSex = false,
    selectBirthDate = false,
    viewerID //required, can't see when not logged in ^^
}) => {
    try {
        const viewer = await prisma.user.findFirst({
            where: {
                id: viewerID
            }
        })
        if(!viewer) throw new Error("An error occured")
        const idFromUsername = (await prisma.user.findFirst({
            where: {
                username
            }
        }))?.id
        if (await checkBlock({
            blockedID: viewer?.id,
            blockerID: idFromUsername,
            absolute: true
        })) throw new Error("Either you blocked this user or they have you blocked")
        

        let profile = await prisma.user.findFirst({
            where: {
                username
            },
            select: {
                id: true,
                revealBirthDate: selectBirthDate,
                birthDate: selectBirthDate,
                email: selectEmail,
                revealEmail: selectEmail,
                revealSex: selectSex,
                sex: selectSex,
                follows: {
                    where: {
                        isDeleted: false,
                        followed: {
                            id: viewer.id
                        }
                    },
                    select: {
                        id: true,
                        isPending: true
                    },
                    take: 1
                },
                followedBy: {
                    where: {
                        isDeleted: false,
                        follower: {
                            id: viewer.id
                        }
                    },
                    select: {
                        id: true,
                        isPending: true
                    },
                    take: 1
                },
                firstName: true,
                lastName: true,
                profile_theme: true,
                username: true,
                profilePic: true,
                bios: selectBio ? {
                    select: {
                        bio: true,
                        id: true
                    },
                    where: {
                        OR:[
                            {
                                age: null,
                            },
                            {
                                age: viewer.age
                            }
                        ],
                        OR:[
                            {
                                sex: null,
                            },
                            {
                                sex: viewer.sex
                            }
                        ]
                    }
                } : false,
                hobby: selectHobbies ? {
                    select: {
                        hobby: true,
                        id: true
                    }
                } : false,
            }
        })
        if (profile) {
            if (profile.id !== viewer.id) {
                const activ = await prisma.user_activity.findFirst({
                    where: {
                        user: {
                            id: viewer.id
                        },
                        other_user: {
                            username
                        },
                        activity: "user_visit"
                    }
                })
                
                await prisma.user_activity.upsert({
                    where: {
                        id: activ?.id || -1
                    },
                    update: {
                        activity:"user_visit"
                    },
                    create: {
                        activity: "user_visit",
                        user: {
                            connect: {
                                id: viewer.id
                            }
                        },
                        other_user: {
                            connect: {
                                username
                            }
                        }
                    }
                })
                await notifications.add({
                    userID: profile.id,
                    username: viewer.username,
                    link: ""
                })
            }
            profile = {
                ...profile,
                email: profile.revealEmail ? profile.email : undefined,
                birthDate: profile.revealBirthDate ? profile.birthDate : undefined,
                sex: profile.revealSex ? profile.sex : undefined,
                follow: {
                    followsYou: {
                        status: profile.follows?.length > 0 ? (profile.follows[0].isPending ? "pending" : true) : false,
                        id: profile.follows[0]?.id || undefined
                    },
                    youFollow: {
                        status: profile.followedBy?.length > 0 ? (profile.followedBy[0].isPending ? "pending" : true) : false,
                        id: profile.followedBy[0]?.id || undefined
                    },
                    followersCount: await getFollowersCount({ username }),
                    follwingCount: await getFollowingCount({ username }),
                    commonFollowersCount: await getCommonFollowers({ id1: viewer.id, id2: profile.id }),
                    commonFollowingCount: await getCommonFollowing({ id1: viewer.id, id2: profile.id })
                },
                follows: undefined,
                followedBy: undefined,
                hobby: profile.hobby?.map(a => a.hobby),
                bio: profile.bios[0]?.bio,
                bios: undefined,
                rating: await getRatingDetails({ratedID: idFromUsername})
            }
            return profile
        }
    }
    catch (e) {
        return {
            error: true,
            message: e.message,
            stack: e.stack
        }
    }
}