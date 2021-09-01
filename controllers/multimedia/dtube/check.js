const { default: axios } = require("axios")
const sleep = (n) => new Promise(resolve => setTimeout(resolve, n))
const check = async ({ data }) => await axios.get(`https://2.btfsu.d.tube/getProgressByToken/${data}?_=${Date.now()}`)
const doRecheck = async ({ data, checker }) => {
    checker = (await check({ data })).data
    if (checker?.finished == false) {
        await sleep(1000)
        return await doRecheck({ checker, data })
    }
    else {
        return checker
    }
}

module.exports = async ({ data }) => {
    try{
        let checker
        const res = await doRecheck({ checker, data })
        return res
    }
    catch(e){
        return {
            error: true,
            message: e.message
        }
    }
}