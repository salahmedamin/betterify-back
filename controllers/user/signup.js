const { PrismaClient } = require("@prisma/client");
const calcAge = require("./signup/calcAge");
const check = require("./signup/check");
const prisma = new PrismaClient()

module.exports = async ({
    username,
    password,
    firstName,
    lastName,
    sex,
    birthDate,
    email
}) => {
    if (
        (
            await check({
                email,
                username
            })
        ).error
    ) return {
        error: true,
        message: "Email or username already exists"
    }
    const age = calcAge(birthDate)
    const result = await prisma.user.create({
        data: {
            birthDate: birthDate.getTime(),
            firstName,
            lastName,
            password,
            sex,
            theme_color: "dark",
            username,
            notifications: {
                create: {

                }
            },
            age: 
                age < 18 ? "lt_18"
                :
                age >= 18 && age < 30 ? "btwn_18_29"
                :
                age >= 18 && age < 30 ? "btwn_18_29"
                :
                age >= 30 && age < 46 ? "btwn_30_45"
                :
                age >= 46 && age < 61 ? "betwn_46_60"
                :
                "gt_60"
        }
    })
    return result ? {
        success: true,
    }
        :
        {
            error: true
        }
}