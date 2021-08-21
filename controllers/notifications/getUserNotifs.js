const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

module.exports = async ({userID, index=0}) => {
    const res = await prisma.single_notification.findMany({
        where:{
            list:{
                user:{
                    id: userID
                }
            }
        },
        skip:index*20,
        take: 20
    })
    return res.map(
        a=>({
            text: a.text,
            redirectTo: a.redirectTo,
            isSeen: a.isSeen,
            images: [
                {
                    left: 
                        a.type.match(/group/) ? "/images/group.svg"
                        :
                        a.type.match(/post/) ? "/images/post.svg"
                        :
                        "/images/comment.svg"
                },
                {
                    right: 
                        (a.type.match(/group/) &&  a.type.match(/comment/)) || (a.type.match(/post/) &&  a.type.match(/comment/)) ? "/images/comment.svg"
                        :
                        a.type.match(/group/) &&  a.type.match(/post/) ? "/images/post.svg"
                        :
                        null
                }
            ]
        })
    )
}