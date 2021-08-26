const shows = require("../../../../../controllers/user/shows");

module.exports = async (req, res) => {
    try {
        const {
            userID
        } = req.body
        res.send(await shows.getRecommendations({
            userID
        }))
    }
    catch (e) {
        res.send({
            error: true,
            message: e.message
        })
    }
}