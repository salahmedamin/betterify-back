const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({ userID, keyword, groupID = undefined, commentID = undefined }) => {
    const res = await prisma.user.findMany({
        where: {
            OR: [
                //same messages group
                {
                    added_by_members_to_groups: groupID ? {
                        some: {
                            AND: [
                                {
                                    //group is a chat group
                                    group: {
                                        isChatGroup: true
                                    }
                                },
                                {
                                    //user is a member
                                    member: {
                                        id: userID
                                    }
                                },
                                {
                                    //other is a member
                                    member: {
                                        username: {
                                            startsWith: keyword
                                        }
                                    }
                                }
                            ]
                        }
                    } : undefined
                },
                //allowed: follows, posts comments writers, not blocked by post writer or comment replied to
                {
                    OR: [
                        {
                            follows: {
                                some: {
                                    follower: {
                                        id: userID
                                    },
                                    followed: {
                                        username: {
                                            startsWith: keyword
                                        }
                                    }
                                }
                            }
                        },
                        {
                            comments: commentID ? {
                                some: {
                                    id: commentID,
                                    writer: {
                                        username: {
                                            startsWith: keyword
                                        }
                                    }
                                }
                            } : undefined
                        }
                    ],
                    //not blocked by post/comment writer
                    NOT: [
                        {
                            //post writer
                            posts: {
                                some: {
                                    comments: {
                                        some: {
                                            id: commentID
                                        }
                                    },
                                    owner: {
                                        blocked: {
                                            none: {
                                                OR: [
                                                    {
                                                        blocked: {
                                                            username: {
                                                                startsWith: keyword
                                                            }
                                                        },
                                                        blocker: {
                                                            id: userID
                                                        }
                                                    },
                                                    {
                                                        blocker: {
                                                            username: {
                                                                startsWith: keyword
                                                            }
                                                        },
                                                        blocked: {
                                                            id: userID
                                                        }
                                                    },
                                                ]
                                            }
                                        }
                                    }
                                },
                            }
                        },
                        {
                            comments: {
                                some: {
                                    id: commentID,
                                    writer: {
                                        blocked: {
                                            none: {
                                                OR: [
                                                    {
                                                        blocked: {
                                                            username: {
                                                                startsWith: keyword
                                                            }
                                                        },
                                                        blocker: {
                                                            id: userID
                                                        }
                                                    },
                                                    {
                                                        blocker: {
                                                            username: {
                                                                startsWith: keyword
                                                            }
                                                        },
                                                        blocked: {
                                                            id: userID
                                                        }
                                                    },
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                //posts: only user follows
                {

                }
            ]
        }
    })
    return res
}