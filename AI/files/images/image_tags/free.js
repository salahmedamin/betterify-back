const {default:axios} = require("axios")

module.exports = async({link, label = false})=>{
    const headers = {
        "Accept": "*/*",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36 Edg/92.0.902.55",
        "Origin": "https://netspark.com",
        "Content-Type": "application/x-www-form-urlencoded",
        "Host": "nudedetect.com",
        "Referer": "https://netspark.com/" 
       }
    const res = await axios.get(
        `https://nudedetect.com/process-netspark.php?url=${link}${label ? "&labeling_image=1":""}`,
        {
            headers
        }
    )
    return !label ? 
        res.data.match(new RegExp('<div class="col alert alert-info"><h2>(.*?)%</h2> Nude</div>'))
        :
        res.data.match(/&nbsp;&nbsp;(.*?) (.*?)%/g)?.map(a=>{
            
            const x = a
                    .replace("&nbsp;<b>Labels:</b><br/>&nbsp;&nbsp;","")
                    .replace(/&nbsp;/g,"")
                    .split(" ")
            const label = x.reduce((t,e,i)=>i<x.length-1 ? (i==0 ? t=e : t+=" "+e) : t,''),
            conf = parseInt(x[x.length-1].replace("%"))/100
            
            return {
                hashtag: label?.toLowerCase(),
                score: conf
            }
        })?.filter((a,i)=>i<5)
        //&nbsp;&nbsp;<b>Labels:</b><br/>&nbsp;&nbsp;Clothing 57% <br/>&nbsp;&nbsp;Leg 36% <br/>&nbsp;&nbsp;Model 35% <br/>&nbsp;&nbsp;Photo shoot 34% <br/>&nbsp;&nbsp;Bikini 32% <br/>&nbsp;&nbsp;Limb 29% <br/>&nbsp;&nbsp;Beauty 23% <br/>&nbsp;&nbsp;Swimwear 21% <br/>&nbsp;&nbsp;Abdomen 19% <br/>&nbsp;&nbsp;Girl 16% <br/>&nbsp;&nbsp;Muscle 16% <br/>&nbsp;&nbsp;Thigh 14% <br/>&nbsp;&nbsp;Person 13% <br/>&nbsp;&nbsp;Blue 13% <br/>&nbsp;&nbsp;Fashion 12% <br/>
}