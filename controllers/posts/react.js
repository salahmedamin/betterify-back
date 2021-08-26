const { PrismaClient } = require("@prisma/client")
const generateWhereCriteria = require("./generateWhereCriteria")

const prisma = new PrismaClient()
module.exports = async ({ emoji, postID, reactorID }) => {
    const isReactable = await prisma.post.findFirst({
        where:{
            isReactable: true,
            ...generateWhereCriteria({viewerID:reactorID, postID})
        },
        select:{
            reactions:{
                where:{
                    reactor:{
                        id: reactorID
                    }
                }
            }
        }
    })
    if(isReactable?.reactions[0]?.emoji == emoji && emoji){
        //same react => delete
        await prisma.reaction.delete({
            where:{
                id: isReactable?.reactions[0]?.id
            }
        })
        return {
            success:true
        }
    }
    const res = isReactable ? await prisma.reaction.upsert({
        where:{
            reactorID_postID:{
                reactorID,
                postID
            }
        },
        create:{
            //new react => add
            emoji,
            reactor:{
                connect:{
                    id: reactorID
                }
            },
            post:{
                connect:{
                    id: postID
                }
            }
        },
        update:{
            //existing react => update
            emoji
        }
    }) : undefined

    return res ? {success:true} : {error:true}
}