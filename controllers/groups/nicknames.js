const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ namerID, namedID, name="", groupID=undefined }) => {

    const res = await prisma.user.update({
        where:{
            id: namerID
        },
        data:{
            namer_in_convos:{
                connectOrCreate:{
                    where:{
                        groupID_namerID_namedID_name: {
                            groupID,
                            namedID,
                            namerID,
                        }
                    },
                    create:{
                        group:{
                            connect:{
                                id: groupID
                            }
                        },
                        named:{
                            connect:{
                                id: namedID
                            }
                        },
                        name
                    }
                }
            }
        }
    })
    return res ? {success:true} : {error:true}
}