import { Request, Response } from 'express';
import { waitTime } from '../src/utils';

const getRoles = async (req: Request, res: Response) =>{
    await waitTime(2000);
    const result = {
        success: true,
        data: [
        {
            id: 1,
            name: "Admin"
        },{
            id: 2,
            name: "Linsen"
        }]
    }
    return res.json(result);
}

export default {
    'GET /api/roles': getRoles,
};