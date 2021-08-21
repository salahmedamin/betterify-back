const tags = require("./images/get_image_tags")
const nsfw = require("./images/nsfw")
const facialRecogn = require("./images/facial_recognition")
const domColor = require("./images/dominant_color")

module.exports = {
    domColor,
    nsfw,
    facialRecogn,
    tags
}