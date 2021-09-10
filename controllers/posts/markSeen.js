const { PrismaClient } = require("@prisma/client")
const generateWhereCriteria = require("./generateWhereCriteria")

const prisma = new PrismaClient()
module.exports = async ({ postID, userID }) => {

    try {
        const res = await prisma.post.findFirst({
            where:{
                ...generateWhereCriteria({viewerID: userID, postID}),
                NOT:{
                    owner:{
                        id: userID
                    }
                }
            }
        })
        if(!res) return {
            error: true,
            message: "Post is unavailable"
        }
        return await prisma.user.update({
            where:{
                id: userID
            },
            data:{
                posts_already_seen:{
                    create:{
                        post:{
                            connect:{
                                id: postID
                            }
                        }
                    }
                },
                activities:{
                    create:{
                        activity: "post_seen",
                        post:{
                            connect:{
                                id: postID
                            }
                        }
                    }
                }
            }
        })
    }
    catch (e) {
        return {
            error: true,
            message: e.message
        }
    }
}