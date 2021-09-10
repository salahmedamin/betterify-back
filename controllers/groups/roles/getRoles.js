const { PrismaClient } = require("@prisma/client")
const isMember = require("../check/isMember")

const prisma = new PrismaClient()
module.exports = async ({ groupID, userID }) => {

    const member = await isMember({groupID,userID})
    if(!member) return {
        error: true,
        message: "Must be a member to see group roles"
    }

    const res = await prisma.groups.findFirst({
        where:{
            id: groupID
        },
        select:{
            roles:{
                select:{
                    role:true,
                    user:{
                        select:{
                            id: true,
                            username: true
                        }
                    }
                }
            }
        }
    })
    return res
}