const { PrismaClient } = require("@prisma/client")
const getPostHighestReact = require("./getPostHighestReact")
const getReactionsCount = require("./getReactionsCount")
const getUserReactOnPost = require("./getUserReactOnPost")

const prisma = new PrismaClient()
module.exports = async ({ postID, userID, includeMedia = undefined }) => {

    try {
        const res = await prisma.post.findFirst({
            where: {
                id: postID,
                NOT: {
                    owner: {
                        blocked: {
                            some: {
                                blocked: {
                                    id: userID
                                }
                            }
                        }
                    }
                },
                OR: [
                    {
                        isShared: false,
                        OR: [
                            {
                                privacyType: null,
                                onlyFollowers: false,
                                onlyFollowersAndFollowed: false
                            },
                            {
                                privacyType: "exclude",
                                NOT: {
                                    //not excluded
                                    usersThatCanSee: {
                                        some: {
                                            id: userID
                                        }
                                    }
                                }
                            },
                            {
                                privacyType: "include",
                                usersThatCanSee: {
                                    some: {
                                        id: userID
                                    }
                                }
                            },
                            {
                                onlyFollowers: true,
                                owner: {
                                    followedBy: {
                                        some: {
                                            follower: {
                                                id: userID
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                onlyFollowersAndFollowed: true,
                                owner: {
                                    OR: [
                                        {
                                            followedBy: {
                                                some: {
                                                    follower: {
                                                        id: userID
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            follows: {
                                                some: {
                                                    followed: {
                                                        id: userID
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            },
                        ]
                    },
                    {
                        isShared: true,
                        originalPost: {
                            OR: [
                                {
                                    privacyType: null,
                                    onlyFollowers: false,
                                    onlyFollowersAndFollowed: false
                                },
                                {
                                    privacyType: "exclude",
                                    NOT: {
                                        //not excluded
                                        usersThatCanSee: {
                                            some: {
                                                id: userID
                                            }
                                        }
                                    }
                                },
                                {
                                    privacyType: "include",
                                    usersThatCanSee: {
                                        some: {
                                            id: userID
                                        }
                                    }
                                },
                                {
                                    onlyFollowers: true,
                                    owner: {
                                        followedBy: {
                                            some: {
                                                follower: {
                                                    id: userID
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    onlyFollowersAndFollowed: true,
                                    owner: {
                                        OR: [
                                            {
                                                followedBy: {
                                                    some: {
                                                        follower: {
                                                            id: userID
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                follows: {
                                                    some: {
                                                        followed: {
                                                            id: userID
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                },
                            ]
                        }
                    }
                ]
            },
            include: {
                multimedia: includeMedia ? {
                    select: {
                        type: true,
                        unique: true,
                        faces: {
                            select: {
                                height: true,
                                width: true,
                                left: true,
                                top: true,
                                person: {
                                    select: {
                                        username: true
                                    }
                                }
                            }
                        }
                    }
                } : undefined,
                activities: {
                    select: {
                        complimentary_relation: {
                            select: {
                                complimentary: {
                                    select:{
                                        text: true,
                                        thumbnail: true,
                                    }
                                },
                            }
                        },
                        actName: {
                            select: {
                                name: true,
                                thumbnail: true,
                            }
                        },
                        with: {
                            select: {
                                username: true
                            }
                        },
                        id: true
                    }
                },
                place: {
                    select: {
                        name: true,
                        id: true
                    }
                },
                owner: {
                    select: {
                        username: true,
                        firstName: true,
                        lastName: true,
                        profilePic: true
                    }
                },
                sharedPost: {
                    select: {
                        id: true,
                        owner: {
                            select: {
                                username: true,
                                firstName: true,
                                lastName: true,
                            }
                        },
                        multimedia: {
                            select: {
                                type: true,
                                unique: true,
                            }
                        },
                        content: true,

                    }
                }
            }
        })
        return res ? {
            ...res,
            sharedPost: !res?.isShared ? undefined : res?.sharedPost,
            activities: undefined,
            activity: {
                name: res?.activities?.actName,
                with: res?.activities?.with,
                id: res?.activities?.id,
                ...res?.activities?.complimentary_relation[0]
            },
            placeID: undefined,
            multimedia: res?.multimedia?.map(a => ({
                ...a,
                faces: a.faces?.map(e => ({
                    ...e,
                    username: e.person?.username,
                    person: undefined
                }))
            })),
            react: {
                max: await getPostHighestReact({ postID: res?.id }),
                user: await getUserReactOnPost({ postID: res?.id, userID }),
                types: await getReactionsCount({ postID: res?.id })
            }
        }
        :
        {
            error: true,
            message:"Post is unavailable"
        }
    }
    catch (e) {
        return {

            error: true,
            message: e.message
        }
    }
}