const { PrismaClient } = require("@prisma/client")
const getFollowers = require("./follow/getFollowers")

const prisma = new PrismaClient()
module.exports = async ({
    userID,
    username = undefined,
    picture = undefined,
    currentLocation = undefined,
    originLocation = undefined,
}) => {
    if(!( picture || username)) return {
        error: true,
        message: "Missing parameters"
    }
    const res = await prisma.user.update({
        where: {
            id: userID,
        },
        data:{
            profilePic: picture,
            currentlyIn:currentLocation ? {
                connectOrCreate:{
                    where:{
                        name: currentLocation
                    },
                    create:{
                        name: currentLocation
                    }
                }
            } : undefined,
            cameFrom:originLocation ? {
                connectOrCreate:{
                    where:{
                        name: originLocation
                    },
                    create:{
                        name: originLocation
                    }
                }
            } : undefined,
            usernames_list:username ? {
                create:{
                    name: username,
                }
            } : undefined,
            activities: picture || username || currentLocation || originLocation ? {
                create:{
                    activity: picture ? "user_edit_picture" : username ? "user_edit_name" : currentLocation ? "user_edit_current_location" : "user_edit_origin_location" ,
                }
            } : undefined
        }
    })
    let status = true
    if(res && username){
        const followers = await getFollowers({
            userID,
            selectAll: true
        })
        for(const follower of followers){
            if(!follower.id) continue
            const params = {
                create:{
                    text:``,
                    type: "simple",
                    fromPerson: {
                        connect:{
                            id: userID
                        }
                    }
                }
            }
            const _do = await prisma.notification_list.upsert({
                where:{
                    userID: follower?.id,
                },
                create:{
                    notifications: params
                },
                update:{
                    notifications: params
                }
            })
            if(!_do) status = false
            break
        }
    }
    return status && res || {error:true}
}