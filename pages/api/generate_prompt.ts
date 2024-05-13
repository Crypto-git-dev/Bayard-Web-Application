import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const prompts = [
            'What can I assist you with today?',
            'How may I help you?',
            'What would you like to know?',
            'Is there anything specific you need help with?',
            'How can I make your day better?',
        ];

        res.status(200).json({ prompts });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}