const getMembers = require("./groups/members"),
joinGroupManager = require("./groups/joinReq"),
nicknames = require("./groups/nicknames"),
getGroup = require("./groups/getGroup"),
create = require("./groups/create"),
rolesManager = require("./groups/setRoles")
module.exports = {
    getMembers,
    joinGroupManager,
    nicknames,
    getGroup,
    create,
    rolesManager
}