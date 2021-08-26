const shows = require("../../../../../controllers/user/shows");

module.exports = async (req, res) => {
    try {
        const {
            watchTMDBID,
            type,
            index
        } = req.body
        res.send(await shows.getSimilar({
            type,
            index,
            watchTMDBID
        }))
    }
    catch (e) {
        res.send({
            error: true,
            message: e.message
        })
    }
}