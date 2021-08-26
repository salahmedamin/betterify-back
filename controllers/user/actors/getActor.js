const { default: axios } = require("axios")

module.exports = async({
    actorTMDBID
})=>{

    const search = await axios.get(
        `https://api.themoviedb.org/3/person/${actorTMDBID}?api_key=${process.env.TMDB_API}`,
    )
        const a = search.data
        return {
            name: a?.name,
            image: a?.profile_path,
            profile_path: undefined,
            gender: a?.gender == 1 ? "female" : a?.gender == 2 ? "male" : undefined,
            actorTMDBID: a?.id,
            birthday: a?.birthday,
            deathday: a?.deathday,
            place_of_birth: a?.place_of_birth
        }
}