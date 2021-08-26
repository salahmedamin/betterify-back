const { PrismaClient } = require("@prisma/client")
const isDeleted = require("../check/isDeleted")

const prisma = new PrismaClient()
module.exports = async ({ 
    postID,
    followersOnly = undefined, 
    followersAndFollowed = undefined,
    privacy : {
        toAdd = [],
        toDelete = [],
        newType = null
    }
}) => {
    if(await isDeleted({postID})) return {error:true}
    if(
        (followersOnly && followersAndFollowed) 
        || 
        ![null,"include","exclude"].includes(newType)
        )
    return {
        error:true,
        message:"Semantic error, please re-check your inputs"
    }
    const isInGroup = await prisma.groups.findFirst({
        where:{
            posts:{
                some:{
                    id: postID
                }
            }
        }
    })
    if(isInGroup)  return {
                        error: true,
                        message: "Can't perform this action"
                    }
                    
    const res = await prisma.post.update({
        where:{
            id: postID,
        },
        data:{
            privacyType: 
                followersAndFollowed||followersOnly ? null
                :
                newType
                ,
            onlyFollowers: followersOnly,
            onlyFollowersAndFollowed: followersAndFollowed,
            usersThatCanSee: {
                deleteMany:{
                    id: {
                        in: toAdd
                    }
                },
                connect: toDelete
            }
        }
    })
    return res ? {success:true} : {error: true}
}