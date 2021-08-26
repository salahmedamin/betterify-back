const { PrismaClient } = require("@prisma/client")

//toggle favorite
const prisma = new PrismaClient()
module.exports = async ({ 
    userID, 
    actorTMDBID,
    name = undefined,
    gender = undefined,
    image = undefined
}) => {

    const isAlreadyFavorite = await prisma.favoriteActors.findFirst({
        where: {
            actor:{
                TMDB_ID: actorTMDBID
            },
            user:{
                id: userID
            }
        }
    })

    const res = await prisma.actor.upsert({
        where:{
            TMDB_ID: actorTMDBID
        },
        create:{
            name,
            gender,
            TMDB_ID: actorTMDBID,
            image,
            usersThatFavorList:{
                connect:{
                    id: userID
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
                    userID_actorTMDBID:{
                        actorTMDBID,
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