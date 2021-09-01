const { PrismaClient } = require("@prisma/client")
const getHighestReact = require("../comments/getHighestReact")

/*create a new SQL command to be able to sort using 
    "newest", 
    "most replied to", 
    (
        "most reacted to"
        and if this selected
        "most emojis"
    )
*/

/*
    ability to search in comments
    
*/

const prisma = new PrismaClient()
module.exports = async ({ postID, userID, order = "date", orderType="desc", index = 0 }) => {
    const inGroup = await prisma.groups.findFirst({
        where:{
            posts:{
                some:{
                    id: postID
                }
            }
        }
    })
    const res = await prisma.comment.findMany({
        where: {
            post: {
                id: postID,
                isDeleted: false,
                isDeletedBySystem: false,
                group: inGroup ? {
                    id: inGroup.id,
                    isDeleted: false,
                    members:{
                        some:{
                            member:{
                                id: userID
                            }
                        }
                    }
                } : undefined
            },
            isDeleted: false,
            isDeletedBySystem: false
        },
        orderBy: {
            created_at: order == "date" ? orderType : undefined,
        },
        include: {
            multimedia:true,
            personsTagged: {
                select:{
                    tagged:{
                        select:{
                            username:true
                        }
                    }
                }
            },
            reactions:{
                where:{
                    reactor:{
                        id: userID
                    }
                },
                select:{
                    emoji: true,
                    id: true,
                }
            },
            edits:{
                take: 1
            }
        },
        take:15,
        skip:index*15
    })

    const stuffed = res.map(a=>({
        ...a,
        tagged: a.personsTagged?.tagged?.map(e=>e.username),
        isEdited: a.edits?.length>0,
        personsTagged: undefined,
        currentReact: a.reactions
    }))

    let ress = []

    for(const one of stuffed){
        ress = [
            ...ress,
            {
                ...one,
                highestReact: await getHighestReact(one.id)
            }
        ]
    }

    return ress
}