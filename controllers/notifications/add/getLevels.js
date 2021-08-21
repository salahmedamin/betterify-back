module.exports = ({
    my = undefined,
    isOther = undefined,
    isReact = undefined,
    isTagged = undefined,
    isGroup = undefined,
    isQuit = undefined,
    forced = undefined,
    user = undefined,
    role = undefined,
    set = undefined,
    unset = undefined,
    isJoinReq = undefined,
    isInvite = undefined,
    accepted = undefined,
    rejected = undefined,
    received = undefined,
    isComment = undefined,
    isReply = undefined,
    isFollowingComment = undefined,
    isPost = undefined,
    isShared = undefined,
    isFollow = undefined,
    isFollowPlus = undefined,
    isFollowMinus = undefined
}) => {
    let level1, level2, level3
    //LEVEL 1
    level1 = !isOther ? (isGroup ?
        'group'
        :
        isPost ?
            (my ? 'mypost' : 'post')
            :
            isComment && !isReply ?
                (my ? 'mycomment' : 'comment')
                :
                isReply && isComment ?
                    (my ? 'myreply' : 'reply')
                    : undefined)
        :
        isFollow ? 'follow'
            :
            'profilevisited'

    //LEVEL 2
    level2 = !isOther ? (
        isFollow ?
            (
                isFollowPlus ? 'plus'
                    :
                    isFollowMinus ? 'minus'
                        :
                        undefined
            )
            : (isGroup ? (
                isJoinReq ? (
                    isInvite ? 'invite' : 'joinrequest'
                )
                    :
                    role ? 'role'
                        :
                        isQuit ? 'quit'
                            :
                            isPost ? (my ? 'mypost' : 'post')
                                :
                                isComment ? (my ? 'mycomment' : 'comment') : undefined
            )
                :
                isPost ?
                    (
                        isComment ? 'comment'
                            :
                            isReact ? 'react'
                                :
                                isTagged ? 'taggedme'
                                    :
                                    isShared ? 'shared'
                                        :
                                        undefined
                    )
                    :
                    isComment ?
                        (
                            isFollowingComment ? 'onfollowing'
                                :
                                isReact ? 'react'
                                    :
                                    isReply ? 'reply'
                                        :
                                        onfollowing ? 'onfollowing'
                                            :
                                            undefined
                        )
                        :
                        undefined
            )
    )
        : undefined

    //LEVEL 3

    level3 = !isOther && !isFollow ? (
        isGroup ? (
            role ? (
                set ? 'set' :
                    unset ? 'unset'
                        :
                        undefined
            )
                :
                isJoinReq ? (
                    isInvite || received ?
                        'received'
                        :
                        accepted ? 'accepted'
                            :
                            rejected ? 'rejected'
                                :
                                undefined
                )
                    :
                    isQuit ?
                        (forced ? 'forced'
                            :
                            user ? 'user'
                                :
                                undefined)
                        :
                        isPost ? (
                            isComment ? 'comment'
                                :
                                isReact ? 'react'
                                    :
                                    isTagged ? 'taggedme'
                                        :
                                        undefined
                        )
                            :
                            isComment ? (
                                my ? (
                                    isReact ? 'react'
                                        :
                                        isReply ? 'reply'
                                            :
                                            undefined
                                )
                                    :
                                    (
                                        isFollowingComment ? 'onfollowing'
                                            :
                                            isTagged ? 'taggedme'
                                                :
                                                undefined
                                    )
                            )
                                : undefined
        )
            :
            undefined
    )
        :
        undefined
    return {
        text: `${level1}${level2 ? `_${level2}${level3 ? `_${level3}` : ''}` : ''}`,
        level1,
        level2,
        level3
    }

}