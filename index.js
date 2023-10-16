// server.js

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

// Enable CORS
app.use(cors());

app.use(bodyParser.json());

// Define a route to handle incoming messages from the Ionic Angular app
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    // Call the ChatGPT API
    const chatGptResponse = await callChatGpt(userMessage);

    res.json({ response: chatGptResponse });
});

async function callChatGpt(userMessage) {
    console.log(userMessage);
    try {
        // Define the URL of the API endpoint you want to send the request to.
        const apiUrl = 'https://api.openai.com/v1/chat/completions'; // Replace with the actual API URL.
        const apiKey = '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'; // Replace with your OpenAI API key
        // Define the request headers.
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        };
        const requestBody = {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: userMessage
                }
            ],
            temperature: 1,
            top_p: 1,
            n: 1,
            stream: false,
            max_tokens: 250,
            presence_penalty: 0,
            frequency_penalty: 0
        };

        return axios.post(apiUrl, requestBody, { headers })
            .then(response => {
                // Handle the response here.
                console.log('Response:', response.data.choices[0].message.content);
                return response.data.choices[0].message.content;
            });
    } catch (error) {
        console.error('Error calling ChatGPT:', error);
        return error;
    }
}


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


