const getUserProfile = require("../../../../controllers/user/getUserProfile")

module.exports = async (req, res) => {

    try {
        const {
            username,
            viewerID,
            selectBio,
            selectBirthDate,
            selectEmail,
            selectHobbies,
            selectSex
        } = req.body
        const profile = await getUserProfile({
            username,
            viewerID,
            selectBio,
            selectBirthDate,
            selectEmail,
            selectHobbies,
            selectSex
        })
        res.send(profile)
    }
    catch (e) {
        res.send({
            error: true,
            message: e.message,
            stack: e.stack
        })
    }
    
}