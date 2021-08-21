const deepai = require('deepai'); // OR include deepai.min.js as a script tag in your HTML
const fs = require("fs")

deepai.setApiKey('6010520c-8aa1-4028-9a56-ea038d7e3bc8');
//another api key 0cf73d5d-b22a-4747-86c0-cf57c8d22a4f

const fetchData = async function(images,type) {
    try{
        const res = await deepai.callStandardApi(type,
            Array.isArray(images) ? 
                images.map((a,i)=>({
                    [`image${i+1}`] : a.path
                }))
            :
                {
                    image: fs.createReadStream(images.path)
                }
        )
        if(Array.isArray(images)) images.forEach(a=>fs.unlink(a.path),()=>true)
        else fs.unlink(images.path,()=>true)
        return res
    }
    catch(e){
        return {
            error:true,
            message: e.message
        }
    }
}

//types are nsfw-detector , facial-recognition

module.exports = async(images,type)=>{
    return await fetchData(images,type)
}