const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ 
    postID,
    followersOnly = undefined, 
    followersAndFollowed = undefined,
    private = {
        toAdd = [],
        toDelete = [],
        newType = null
    }
}) => {
    if(
        (followersOnly && followersAndFollowed) 
        || 
        ![null,"include","exclude"].includes(private.newType)
        )
    return {
        error:true,
        message:"Semantic error, please re-check your inputs"
    }
    const res = await prisma.post.update({
        where:{
            id: postID,
        },
        data:{
            privacyType: 
                followersAndFollowed ? null
                :
                private.newType
                ,
            onlyFollowers: followersOnly,
            onlyFollowersAndFollowed: followersAndFollowed,
            usersThatCanSee: {
                deleteMany:{
                    id: {
                        in: private.toDelete
                    }
                },
                connect: private.toDelete
            }
        }
    })
    return res ? {success:true} : {error: true}
}