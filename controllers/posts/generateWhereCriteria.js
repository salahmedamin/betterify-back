module.exports = ({
    viewerID,
    postID = undefined
}) => ({
    id: postID,
    isDeleted: false,
    isDeletedBySystem: false,
    NOT: {
        owner: {
            blocked: {
                some: {
                    blocked: {
                        id: viewerID
                    }
                }
            }
        }
    },
    OR:[
        {
            group:null,
        },
        {
            group:{
                isPublic: true,
                isDeleted: false,
            }
        },
        {
            group:{
                isPublic:false,
                isDeleted: false,
                members:{
                    some:{
                        member:{
                            id: viewerID
                        }
                    }
                }
            }
        }
    ],
    OR: [
        {
            owner: {
                id: viewerID
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
                                id: viewerID
                            }
                        }
                    }
                },
                {
                    privacyType: "include",
                    usersThatCanSee: {
                        some: {
                            id: viewerID
                        }
                    }
                },
                {
                    onlyFollowers: true,
                    owner: {
                        followedBy: {
                            some: {
                                follower: {
                                    id: viewerID
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
                                            id: viewerID
                                        },
                                        isPending: false,
                                        isDeleted: false
                                    }
                                }
                            },
                            {
                                follows: {
                                    some: {
                                        followed: {
                                            id: viewerID
                                        },
                                        isPending: false,
                                        isDeleted: false
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
                                    id: viewerID
                                }
                            }
                        }
                    },
                    {
                        privacyType: "include",
                        usersThatCanSee: {
                            some: {
                                id: viewerID
                            }
                        }
                    },
                    {
                        onlyFollowers: true,
                        owner: {
                            followedBy: {
                                some: {
                                    follower: {
                                        id: viewerID
                                    },
                                    isPending: false,
                                    isDeleted: false
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
                                                id: viewerID
                                            },
                                            isPending: false,
                                            isDeleted: false
                                        }
                                    }
                                },
                                {
                                    follows: {
                                        some: {
                                            followed: {
                                                id: viewerID
                                            },
                                            isPending: false,
                                            isDeleted: false
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
})