import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { CharacterEncoding } from 'crypto';

const app: Application = express();
const PORT: number = 8765;


app.use((req: Request, res: Response, next: NextFunction) => {
    const start: number = Date.now();
    res.on('finish', () => {
        const duration: number = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} - ${duration}ms`);
    });
    next();
});

app.use(cors());

app.use((req: Request, res: Response, next: NextFunction) => {
    const authHead: string | string[] | undefined = req.headers['authentication'];
    if (!authHead || authHead !== 'open sesame') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
});


// CREATING ENDPOINTS
// check health or status
app.get('/health', (req: Request, res: Response, next: NextFunction) => {
    const time: number = performance.now();
    res.send('Health or Status is running');
});

app.get('/square/:number', (req: Request, res: Response) => {
    const num: number = parseInt(req.params.number);
    if (isNaN(num)) {
        return res.status(400).json({ error: 'Invalid Number' });
    }

    const square: number = num * num;
    res.json({ result: square });
});

app.get('/data', (req: Request, res: Response) => {
    const data = {
        favColor: 'blue',
        state: 'CA',
        tvShow: 'Bridgerton',
        primNum: getRandomPrimeNumber(11, 41),
    };
    res.json(data);
});

function getRandomPrimeNumber(min: number, max: number): number {
    const primeNums: number[] = [];
    for (let i = min; i < max; i++) {
        if (isPrime(i)) primeNums.push(i);
    }
    return primeNums[Math.floor(Math.random() * primeNums.length)];
}

function isPrime(num: number): boolean {
    for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
        if (num % i == 0) return false;
    }
    return num > 1;
}

// IMPLEMENTING INTERFACE for TS
interface User {
    username: string;
    email: string;
    gender: string;
  }
  
  const person: User = {
    username: 'ashisin17',
    email: 'ashisin17@g.ucla.edu',
    gender: 'f',
  };
  


app.listen(PORT, () => console.log(`Server running on port 8765`));
