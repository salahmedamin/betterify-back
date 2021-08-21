const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ groupID, toBeSetID }) => {

    const res = await prisma.groups.update({
        where:{
            id: groupID
        },
        data:{
            roles:{
                create:{
                    user:{
                        toBeSetID
                    },
                    role: "moderator"
                }
            }
        }
    })
    return res ? {success:true} : {error:true}
}