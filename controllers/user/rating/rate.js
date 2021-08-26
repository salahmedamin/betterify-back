const { PrismaClient } = require("@prisma/client");
const hasRatedAlready = require("./hasRatedAlready");
const isRateable = require("./isRateable");
const prisma = new PrismaClient()

module.exports = async({
    raterID,
    ratedID,
    rating,
    message=undefined
})=>{
    if(!(await isRateable({ratedID}))) return {
        error: true
    }
    const ratedAlready = await hasRatedAlready({
        ratedID,
        raterID
    })

    if(ratedAlready && ratedAlready == rating){
        return await prisma.rating.delete({
            where:{
                raterID_ratedID:{
                    ratedID,
                    raterID
                }
            }
        }) ? {
            success: true
        } : {
            error: true
        }
    }


    const res = await prisma.rating.upsert({
        where:{
            raterID_ratedID:{
                ratedID,
                raterID
            }
        },
        create:{
            message,
            rate: rating,
            rated:{
                connect:{
                    id: ratedID
                }
            },
            rater:{
                connect:{
                    id: raterID
                }
            }
        },
        update: {
            rate: rating,
            message
        }
    })
    return !res ? {
        error: true
    }
    :
    {
        success: true
    }
}