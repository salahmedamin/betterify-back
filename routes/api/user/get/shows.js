const getActors = require("./shows/getActors")
const getRecommendations = require("./shows/getRecommendations")
const getShow = require("./shows/getShow")
const getSimilar = require("./shows/getSimilar")
const getVideos = require("./shows/getVideos")
const search = require("./shows/search")

module.exports = {
    getActors,
    getShow,
    getRecommendations,
    getSimilar,
    getVideos,
    search
}