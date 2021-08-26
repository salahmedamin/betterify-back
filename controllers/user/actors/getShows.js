const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const { default: axios } = require("axios")

module.exports = async({
    actorTMDBID,
    index=0,
    type=undefined
})=>{

    const search = await axios.get(
        `https://api.themoviedb.org/3/person/${actorTMDBID}/${type||"combined"}_credits?api_key=${process.env.TMDB_API}&page=${index+1}`,
    )
        const init = search.data.results.cast
        .filter((a,i)=> i < ((10*index)+10) && i > (10*index))
        .map(a=>({
                image: a.poster_path,
                poster_path: undefined,
                type,
                watchTMDBID: a.id,
                releaseDate: a.release_date,
                rating: a.vote_average,
                genres: Promise.all(a?.genre_ids.map(async z=>await prisma.genres.findFirst({
                    where:{
                        TMDB_ID: a
                    }
                }))),
                name: a.original_title || a.original_name,
                description: a.overview
            })
        )
}