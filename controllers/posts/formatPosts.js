const getPostHighestReact = require("./getPostHighestReact")
const getReactionsCount = require("./getReactionsCount")

module.exports = async({ postsArray = [], singlePost = undefined }) => {
    if (singlePost) {
        let post = {
            ...singlePost,
            alreadySeen: singlePost?.alreadySeen.length > 0,
            edits: undefined,
            content: singlePost?.edits[0]?.text || singlePost?.content,
            place: singlePost?.place?.name,
            activities: undefined,
            activity: {
                name: singlePost?.activities?.actName.name,
                thumbnail: singlePost?.activities?.actName.thumbnail,
                with: singlePost?.activities?.with.map(a => singlePost?.username),
                complimentary: singlePost?.activities?.complimentary_relation?.complimentary,
                id: singlePost?.activities?.actName?.id
            },
            multimedia: singlePost.multimedia?.map(e => ({
                ...e,
                faces: e.faces?.map(x => ({
                    ...x,
                    username: x.person?.username,
                    person: undefined
                }))
            })),
            react: {
                max: await getPostHighestReact({ postID: singlePost?.id }),
                types: await getReactionsCount({ postID: singlePost?.id }),
                ownReaction: singlePost?.reactions[0]?.emoji
            },
            reactions: undefined,
            tags: singlePost?.tags.map(a => a.hashtag),
            urls: singlePost?.urls.map(a => a.URL)
        }
        return post
    }
    else if (postsArray.length > 0) {
        let posts = postsArray.map(a => ({
            ...a,
            alreadySeen: a.alreadySeen.length > 0,
            edits: undefined,
            content: a?.edits[0]?.text || a.content,
            place: a?.place?.name,
            activities: undefined,
            activity: {
                name: a.activities?.actName.name,
                thumbnail: a.activities?.actName.thumbnail,
                with: a.activities?.with.map(a => a.username),
                complimentary: a.activities?.complimentary_relation?.complimentary,
                id: a.activities?.actName?.id
            },
            multimedia: a.multimedia?.map(e => ({
                ...e,
                faces: e.faces?.map(x => ({
                    ...x,
                    username: x.person?.username,
                    person: undefined
                }))
            })),
        }))

        for (let i = 0; i < posts.length; i++) {
            posts[i] = {
                ...posts[i],
                react: {
                    max: await getPostHighestReact({ postID: posts[i]?.id }),
                    types: await getReactionsCount({ postID: posts[i]?.id }),
                    ownReaction: posts[i]?.reactions[0]?.emoji
                },
                reactions: undefined,
                tags: posts[i]?.tags.map(a => a.hashtag),
                urls: posts[i]?.urls.map(a => a.URL)
            }
        }
        return posts
    }
}