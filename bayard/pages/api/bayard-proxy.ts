import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const BAYARD_API_KEY = process.env.BAYARD_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
if (req.method === 'POST') {
    try {
    const { input_text } = req.body;

    const response = await axios.post(
        'https://bayardapp.onrender.com/api/bayard', 
        { input_text },
        {
        headers: {
            'Content-Type': 'application/json',
            'X-API-key': BAYARD_API_KEY,
        },
        }
    );
    
    res.status(200).json({ 
        model_output: response.data.model_output,
        documents: response.data.documents
    });

    } catch (error) {
    console.error('Error querying Bayard API:', error);
    res.status(500).json({ error: 'An error occurred' });
    }
} else {
    res.status(405).json({ error: 'Method not allowed' });
}
}