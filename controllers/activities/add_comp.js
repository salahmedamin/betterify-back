const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
module.exports = async ({actID, complimentary}) => {
    if(!(actID && complimentary)) return {
        error: true
    }
    const res = await prisma.activity_name.update({
        where:{
            id:actID 
        },
        data: {
            activities:{
                create:{
                    complimentary_relation:{
                        create:{
                            complimentary
                        }
                    }
                }
            }
        }
    })
    return res
}