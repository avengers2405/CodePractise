import express from 'express'

const router = express.Router()

router.post('/validate', async (req, res) => {

    try{
        const cookieString = req.body.cookieString;
        console.log("cookieString", cookieString);

        const response = await fetch("https://vjudge.net/problem/CodeForces-795I", {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                "accept-language": "en-US,en;q=0.5", 
                "cache-control": "no-cache", 
                "pragma": "no-cache", 
                "priority": "u=0, i", 
                "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Brave\";v=\"139\", \"Chromium\";v=\"139\"", 
                "sec-ch-ua-mobile": "?0", 
                "sec-ch-ua-platform": "\"Windows\"", 
                "sec-fetch-dest": "document", 
                "sec-fetch-mode": "navigate", 
                "sec-fetch-site": "same-origin", 
                "sec-fetch-user": "?1", 
                "sec-gpc": "1", 
                "upgrade-insecure-requests": "1", 
                "cookie": cookieString, 
                "Referer": "https://vjudge.net/problem"
            }, 
            "body": null, 
            "method": "GET"
        })

        const rt = await response.text();
        console.log("response", rt);

        if (rt.includes("avengers2405")){
            res.status(200).send('avengers2405 found yay')
        } else {
            res.status(403).send('invalid creds')
        }
    } catch (e) {
        console.log('Error in function: '+e)
        res.status(500).send('ise')
    }
})

export default router