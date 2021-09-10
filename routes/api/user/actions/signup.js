const signup = require("../../../../controllers/user/signup");

module.exports = async (req, res) => {
    try {
        const {
            birthDate,
            email,
            firstName,
            lastName,
            password,
            sex,
            username
        } = req.body
        const rese = await signup({
            birthDate,
            email,
            firstName,
            lastName,
            password,
            sex,
            username
        })

        if(!rese) throw new Error("Please check the provided data")
        else res.send({success:true})
    }
    catch (e) {
        res.send({
            error: true,
            message: e.message,
            stack: e.stack
        })
    }
}