const http = require('http')
const fs = require('fs')
var allowedAccess = [
    '/favicon.ico',
    '/login.html',
    '/index.html',
    'index.html'
]
var alwaysAllowedItems = [
    '/favicon.ico'
]
var approvedIPs = []

var userAccounts = []


// FUNCTIONS
function wait(timeout) {
	return new Promise(resolve => {
		setTimeout(resolve, timeout);
	});
}
function logoutInactive() {
    if (approvedIPs.length == 0) return;
    let user = approvedIPs.find((element) => element.time < new Date().getTime()/1000);
    console.log(approvedIPs.length)
}


// MAIN SERVER HANDLING
setInterval(() => {
    logoutInactive()
}, 1000);


const server = http.createServer(async (req, res) => {
    let url = req.url
    let userIP = req.socket.remoteAddress.replace(/[^0-9.]/g, '')
    
    // ITEMS ALLOWED ACCESS TO REGARDLESS IF THEY ARE LOGGED IN
    if(alwaysAllowedItems.includes(url)) {
        res.writeHead(200, { 'content-type': 'text/html' })
        fs.createReadStream(`./${url}`).pipe(res)
        return;
    }
    
    

    console.log(userIP, url)
    //IS THIS USER LOGGED IN ALREADY?
    if (parseInt(userIP.split(".")[0]) !== 192 & !approvedIPs.includes(userIP)) {
        console.log(`[WEB] user not logged in denying access to ${url}.`)
        // USER IS NOT APPROVED TO ACCESS WEBPAGE, DENY AND SEND TO LOGIN PAGE
        

        if (url.toString().search("\\?") !== -1) { // MAKE SURE THEY ACTUALLY INPUTED SOMETHING BEFORE CHECKING
            let rawUserNPassInput = url.split("?")[1].split("&")
            let user = rawUserNPassInput[0].split("=")[1]
            let pass = rawUserNPassInput[1].split("=")[1]

            let userFile = userAccounts.find((element) => element.username == user); // FIND USER IN THE USERACCOUNT DIRECTORY

            if (userFile == undefined) return fs.createReadStream('htmlPages/login.html').pipe(res) // USER WAS NOT FOUND
            if (userFile.password != pass) return fs.createReadStream('htmlPages/login.html').pipe(res) // INCORRECT PASSWORD


            //USER SUCCESSFULLY LOGGED IN, ADD THEM TO APPROVED IPs ALONG WITH THE TIME THEY WERE ADDED
            approvedIPs.push({ip: userIP, time: ((new Date().getTime()/1000)+10)})
            fs.createReadStream('htmlPages/index.html').pipe(res)
            console.log("user successfully logged in")
        } else {
            fs.createReadStream('htmlPages/login.html').pipe(res)
        }
        
    } else {
        console.log(`htmlPages${url}`)
        if (url == "/") url = "/index.html"
        
        //console.log(url, allowedAccess.includes(url))
        if (allowedAccess.includes(url)) {
            
            console.log(`htmlPages${url}`)
            res.writeHead(200, { 'content-type': 'text/html' })
            fs.createReadStream(`htmlPages${url}`).pipe(res)
            

        } else {
            fs.createReadStream('htmlPages/requestDenied.html').pipe(res)
        }
        
    }
    
})

//BROADCAST HTTPS SERVER
server.listen(process.env.PORT || 80) 
console.log(`[WEB] server started on port ${process.env.PORT || 80}`)