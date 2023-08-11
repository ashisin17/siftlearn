"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 8765;
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} - ${duration}ms`);
    });
    next();
});
app.use((0, cors_1.default)());
app.use((req, res, next) => {
    const authHead = req.headers['authentication'];
    if (!authHead || authHead !== 'open sesame') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
});
// CREATING ENDPOINTS
// check health or status
app.get('/health', (req, res, next) => {
    const time = performance.now();
    res.send('Health or Status is running');
});
app.get('/square/:number', (req, res) => {
    const num = parseInt(req.params.number);
    if (isNaN(num)) {
        return res.status(400).json({ error: 'Invalid Number' });
    }
    const square = num * num;
    res.json({ result: square });
});
app.get('/data', (req, res) => {
    const data = {
        favColor: 'blue',
        state: 'CA',
        tvShow: 'Bridgerton',
        primNum: getRandomPrimeNumber(11, 41),
    };
    res.json(data);
});
function getRandomPrimeNumber(min, max) {
    const primeNums = [];
    for (let i = min; i < max; i++) {
        if (isPrime(i))
            primeNums.push(i);
    }
    return primeNums[Math.floor(Math.random() * primeNums.length)];
}
function isPrime(num) {
    for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
        if (num % i == 0)
            return false;
    }
    return num > 1;
}
const person = {
    username: 'ashisin17',
    email: 'ashisin17@g.ucla.edu',
    gender: 'f',
};
app.listen(PORT, () => console.log(`Server running on port 8765`));
