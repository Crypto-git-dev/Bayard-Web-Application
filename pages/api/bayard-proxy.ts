import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { createClient } from 'redis';

const BAYARD_API_KEY = process.env.BAYARD_API_KEY;
const REDIS_URL = process.env.REDIS_URL;
const redisClient = createClient({ url: REDIS_URL });

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            await redisClient.connect();

            const { input_text } = req.body;
            let userId = req.headers['user-id'] as string;

            if (!userId) {
                userId = generateUniqueId();
                await redisClient.set(`user_id:${userId}`, userId);
            } else {
                const storedUserId = await redisClient.get(`user_id:${userId}`);
                if (!storedUserId) {
                    userId = generateUniqueId();
                    await redisClient.set(`user_id:${userId}`, userId);
                }
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

            res.status(200).json({
                model_output: response.data.markdown_output || response.data.model_output,
                documents: response.data.documents,
                userId: userId,
            });
        } catch (error) {
            console.error('Error querying Bayard API:', error);
            res.status(500).json({ error: 'An error occurred' });
        } finally {
            await redisClient.disconnect();
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

// Function to generate a unique ID
function generateUniqueId() {
    return Math.random().toString(36).substring(7);
}