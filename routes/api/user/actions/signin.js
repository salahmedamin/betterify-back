const jwt= require("jsonwebtoken");
const signin = require("../../../../controllers/user/signin");
const key = require("../../../../key");

module.exports = async (req, res) => {
    try {
        const {
            username,
            password
        } = req.body
        const rese = await signin({
            password,
            username
        })
        if(rese) res.send({
            success: true,
            token: jwt.sign(rese, key)
        })
        else throw new Error("Invalid credentials")
    }
    catch (e) {
        res.send({
            error: true,
            message: e.message
        })
    }
}