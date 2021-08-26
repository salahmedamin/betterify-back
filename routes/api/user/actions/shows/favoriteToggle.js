const shows = require("../../../../../controllers/user/shows");

module.exports = async (req, res) => {
    try {
        const {
            watchTMDBID,
            userID,
            rating,
            image,
            name,
            description,
            type,
            genres
        } = req.body
        res.send(await shows.favorite({
            type,
            userID,
            watchTMDBID,
            description,
            genres,
            image,
            name,
            rating
        }))
    }
    catch (e) {
        res.send({
            error: true,
            message: e.message
        })
    }
}