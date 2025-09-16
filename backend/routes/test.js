import express from 'express';
import pool from '../db.js';

const router = express.Router()

router.get('/validate/:id', async (req, res) => {
    const id = req.params.id;
    console.log("Validating ID:", id);

    try {
        var result = await pool.query("SELECT active FROM tests WHERE testid=$1", [id]);
        var { rowCount, rows } = result;
        if (rowCount < 1) {
            res.status(200).json({"active": false})
        } else {
            res.status(200).json({"active": rows[0].active})
        }
    } catch (e) {
        console.log('Error in function: ' + e)
        res.status(500).send('ise')
    }
})

router.get('/start', async (req, res) => {
    try {
        const result = await pool.query("INSERT INTO tests DEFAULT VALUES RETURNING testid");
        const { rows } = result;
        console.log('Result in test creation is: ', result);
        res.status(200).json({ "testid": rows[0].testid });
    } catch (e) {
        console.log('Error in function: ' + e)
        res.status(500).send('ise')
    }
})

export default router;