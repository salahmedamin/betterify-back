const favorite = require("./shows/favorite")
const getActors = require("./shows/getActors")
const getSimilar = require("./shows/getSimilar")
const getVideos = require("./shows/getVideos")
const getRecommendations = require("./shows/getRecommendations")
const getShow = require("./shows/getShow")
const searchShows = require("./shows/search")

module.exports = {
    favorite,
    getActors,
    getRecommendations,
    getSimilar,
    searchShows,
    getVideos,
    getShow
}