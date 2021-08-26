module.exports = ({
    viewerID
}) => ({
    id: true,
    activities: {
        select: {
            with: {
                select: {
                    username: true
                }
            },
            actName: {
                select: {
                    name: true,
                    thumbnail: true,
                    id: true
                }
            },
            complimentary_relation: {
                select: {
                    complimentary: {
                        select: {
                            text: true,
                            thumbnail: true,
                            id: true
                        }
                    }
                }
            }
        }
    },
    alreadySeen: {
        where: {
            id: viewerID
        },
        take: 1
    },
    hasEdits: true,
    hasFile: true,
    hasImage: true,
    hasTaggedPerson: true,
    hasURL: true,
    hasVideo: true,
    isCommentable: true,
    isReactable: true,
    isShared: true,
    isShareable: true,
    isVocal: true,
    edits: {
        select: {
            text: true
        },
        take: 1,
        orderBy: {
            created_at: "desc"
        }
    },
    reactions: {
        where: {
            reactor: {
                id: viewerID
            }
        },
        select: {
            emoji: true
        }
    },
    originalPost: {
        select: {
            owner: {
                select: {
                    username: true,
                    profilePic: true,
                    firstName: true,
                    lastName: true,

                }
            },
            content: true,
            multimedia: {
                include: {
                    faces: {
                        select: {
                            left: true,
                            height: true,
                            top: true,
                            width: true,
                            person: {
                                select: {
                                    username: true
                                }
                            },
                        }
                    }
                },
                take: 3
            },
            group: {
                select: {
                    groupName: true,
                    groupPic: true,
                    unique: true,
                }
            },
            edits: {
                select: {
                    text: true
                },
                take: 1,
                orderBy: {
                    created_at: "desc"
                }
            }
        }
    },
    created_at: true,
    onlyFollowers: true,
    onlyFollowersAndFollowed: true,
    content: true,
    place: {
        select: {
            name: true
        }
    },
    multimedia: {
        select: {
            unique: true,
            type: true,
        }
    },
    privacyType: true,
    group: {
        select: {
            groupName: true,
            groupPic: true,
            unique: true,
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
    tags: {
        select: {
            hashtag: true,
        },
        orderBy: {
            score: "desc"
        }
    },
    urls: {
        select: {
            URL: true
        }
    },
    owner: {
        select: {
            username: true,
            profilePic: true,
            firstName: true,
            lastName: true
        }
    }
})