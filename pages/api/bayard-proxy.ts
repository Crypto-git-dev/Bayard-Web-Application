import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import cookie from 'cookie';

const BAYARD_API_KEY = process.env.BAYARD_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { input_text } = req.body;

            // Get the user ID from the cookie
            const cookies = cookie.parse(req.headers.cookie || '');
            let userId = cookies.userId;

            // If the user ID doesn't exist in the cookie, generate a new one
            if (!userId) {
                userId = uuidv4();
                res.setHeader('Set-Cookie', cookie.serialize('userId', userId, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 7, // 1 week
                    path: '/',
                }));
            }

            const response = await axios.post(
                'https://bayard-one.onrender.com/api/bayard',
                { input_text },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-key': BAYARD_API_KEY,
                        'User-ID': userId,
                    },
                }
            );

            // Extract the documents from the Bayard API response
            const documents = response.data.documents || [];

            // Create a new document tab with the retrieved documents
            const newDocumentTab = {
                id: uuidv4(),
                title: input_text,
                documents: documents,
            };

            res.status(200).json({
                model_output: response.data.model_output,
                documentTabs: [newDocumentTab],
                userId: userId,
            });
        } catch (error) {
            console.error('Error querying Bayard API:', error);
            res.status(500).json({ error: 'An error occurred' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}