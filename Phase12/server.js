const app = require('express')()
const cors = require('cors')
const PORT = 8765

// MIDDLEWARE 
// logs req duration
app.use((req, res, next) => {
    const start = Date.now()
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} - ${duration}ms`)
        // ${req.method} = HTTP method used in request
        // ${req.originalUrl} = reps original URl path of request
    })
    next()
})

//midw to enable CORS
app.use(cors())

//mid to check authentication
app.use((req,res,next) => {
    // if health, allow access to checkpoint w/ authentication
    if(req.path === '/health')
        return next()
    
    // check if auth header exists and has correct val
    const authHead = req.headers['authentication'] // access val of Authentication head from req's headers obj 
    if(!authHead || authHead !== 'open sesame') { // if header DNE or its val is not open ses, send error
        return res.status(401).json({error: 'Unauthorized'})
    }

    // if authen valid, proceed to next midd
    next()
})

// CREATING ENDPOINTS
// check health or status
app.get('/health', (req, res, next) => {
    let time = performance.now()
    res.send('Health or Status is running')
})

// accept a number and return the square of that number
app.get('/square/:number', (req, res) => { // request and response params
    // edge case: invalid num
    const num = parseInt(req.params.number) //must use number to get the val from route correctly!
    if(isNaN(num)){
        return res.status(400).json({error: 'Invalid Number'})
    }

    const square = num*num
    res.json({result: square})
})


//return a JSON containing: your favorite color, 
//state you live, last TV you saw, and a random prime 
// number between 11 and 41 (exclusive)
app.get('/data', (req, res) => {
    const data = {
        favColor: 'blue',
        state: 'CA',
        tvShow: 'Bridgerton',
        primNum: getRandomPrimeNumber(11,41)
    }
    res.json(data) // return request

})

// HELPER FUNCTIONS
function getRandomPrimeNumber(min, max){
    const primeNums = []
    for(let i = min; i < max; i++) { // 41 exclusive
        if(isPrime(i))
            primeNums.push(i)
    }
    return primeNums[Math.floor(Math.random() * primeNums.length)]
}

function isPrime(num) {
    for(i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
        if(num % i == 0)
            return false
    }
    return num > 1
}

app.listen(PORT, () => console.log(`Server running on port 8765`)) 
