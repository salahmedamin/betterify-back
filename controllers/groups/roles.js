const deleteRole = require("./roles/delete")
const setAdmin = require("./roles/setAdmin")
const setModerator = require("./roles/setModerator")
const setReportsAnalyzer = require("./roles/setReportsAnalysts")
const getRoles = require("./roles/getRoles")


module.exports = {
    deleteRole,
    setAdmin,
    setModerator,
    setReportsAnalyzer,
    getRoles
}