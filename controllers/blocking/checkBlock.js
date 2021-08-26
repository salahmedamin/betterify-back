const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
module.exports = async ({ blockerID, blockedID, absolute = false }) => {
    const res = await prisma.user_to_user_blockings.findFirst({
        where: {
            OR: absolute ? [
                {
                    blocked: {
                        id: blockedID
                    },
                    blocker: {
                        id: blockerID
                    }
                },
                {
                    blocker: {
                        id: blockedID
                    },
                    blocked: {
                        id: blockerID
                    }
                },
            ]
                :
                undefined,
            AND: !absolute ? [
                {
                    blocked: {
                        id: blockedID
                    },
                },
                {
                    blocker: {
                        id: blockerID
                    }
                }
            ]
                :
                undefined
        },
    })
    
    return res ? true : false
}