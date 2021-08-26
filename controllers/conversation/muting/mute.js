const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ muterID, mutedID=undefined, mutedGroupID = undefined }) => {

    const res = await prisma.muting.create({
        data:{
            mutedGroup:mutedGroupID ? {
                connect:{
                    id: mutedGroupID
                }
            }:undefined,
            muted:mutedID ? {
                connect:{
                    id: mutedID
                }
            } : undefined,
            muter:{
                connect:{
                    id: muterID
                }
            }
        }
    })

    return res ? {success:true} : {error:true}
}