const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ muterID, mutedID = undefined, mutedGroupID=undefined }) => {

    const res = await prisma.muting.delete({
        where:{
            muterID_mutedID_groupID:{
                groupID: mutedGroupID,
                mutedID,
                muterID
            }
        }
    })

    return res ? {success:true} : {error:true}
}