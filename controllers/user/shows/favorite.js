const { PrismaClient } = require("@prisma/client")
const getActors = require("./getActors")

//toggle favorite
const prisma = new PrismaClient()
module.exports = async ({ 
    userID, 
    watchTMDBID,
    name = undefined,
    type,
    description = undefined,
    rating = undefined,
    image = undefined,
    genres = []
}) => {

    const isAlreadyFavorite = await prisma.favoriteWatch.findFirst({
        where: {
            watch:{
                TMDB_ID: watchTMDBID
            },
            user:{
                id: userID
            }
        }
    })

    const actors = !isAlreadyFavorite ? getActors({
        type,
        watchTMDBID
    }) : []

    const res = await prisma.watch.upsert({
        where:{
            TMDB_ID: watchTMDBID
        },
        create:{
            name,
            type,
            description,
            rating,
            TMDB_ID: watchTMDBID,
            image,
            usersThatFavorList:{
                connect:{
                    id: userID
                }
            },
            genres:{
                connect: 
                    genres?.map(a=>(
                        Number.isInteger(a) ? a 
                        :
                        {
                        TMDB_ID: a
                        }
                    ))
            },
            relationWithActors:{
                createMany:{
                    data:actors?.map(a=>({
                        actorTMDBID: a.actorTMDBID
                    })),
                    skipDuplicates: true
                }
            }
        },
        update:{
            usersThatFavorList:{
                create:!isAlreadyFavorite ? {
                    user:{
                        connect:{
                            id: userID
                        }
                    }
                } : undefined,
                delete: isAlreadyFavorite ? {
                    userID_watchTMDBID:{
                        watchTMDBID,
                        userID
                    }
                } : undefined
            }
        }
    })
    return res ? {
        success: true
    } : {
        error: true
    }
}