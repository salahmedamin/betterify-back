const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({
    postID,
    userID
}) => {
    const res = await prisma.post.findFirst({
        where: {
            id: postID,
            OR: [
                {
                    owner:{
                        id: userID
                    }
                },
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
        }
    })
    return res ? { success: true } : { error: true }
}