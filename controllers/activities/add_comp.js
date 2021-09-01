const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
module.exports = async ({actID = undefined, actName = undefined, complimentary}) => {
    if(!((actID || actName) && complimentary)) return {
        error: true
    }
    const res = await prisma.activity_name.update({
        where:{
            name: actName
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