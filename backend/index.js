import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send("hit the home page, server working fine");
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})