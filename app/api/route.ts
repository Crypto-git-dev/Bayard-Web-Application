import axios from 'axios';

async function queryBayard(input_text: string) {
try {
    const response = await axios.post('/api/bayard-proxy', { input_text });
    return response.data;
} catch (error) {
    console.error('Error querying Bayard API:', error);
    throw error;
}
}

