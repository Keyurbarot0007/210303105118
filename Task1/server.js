const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const EXTERNAL_API_URL = 'http://20.244.56.144/test';  // Replace with the actual external API URL
const TIMEOUT = 500;
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE4Nzc3NzI4LCJpYXQiOjE3MTg3Nzc0MjgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImM4ZjhiMjdjLTc2MjMtNGE0Ny1hZTljLTliNWM1ZGQ1NWNlOSIsInN1YiI6IjIxMDMwMzEwNTExOEBwYXJ1bHVuaXZlcnNpdHkuYWMuaW4ifSwiY29tcGFueU5hbWUiOiJLRE1lZCIsImNsaWVudElEIjoiYzhmOGIyN2MtNzYyMy00YTQ3LWFlOWMtOWI1YzVkZDU1Y2U5IiwiY2xpZW50U2VjcmV0IjoiZnZqSnJwb0VheU53RGFwVCIsIm93bmVyTmFtZSI6IktleXVyIiwib3duZXJFbWFpbCI6IjIxMDMwMzEwNTExOEBwYXJ1bHVuaXZlcnNpdHkuYWMuaW4iLCJyb2xsTm8iOiIyMTAzMDMxMDUxMTgifQ.V3SufPJQuhz4Rx8oIuk_dJqTUSnXwzHRSucGF8cntr0';
const tokenType = 'Bearer';


let numbersWindow = [];

const fetchNumbers = async (numberId) => {
    try {
        console.log(`Fetching numbers with ID: ${numberId}`);
        const response = await axios.get(`${EXTERNAL_API_URL}/${numberId}`, {
            headers: {
                Authorization: `${tokenType} ${accessToken}`
            },
            
        },{ timeout: TIMEOUT });
        console.log(response.data);

        if (response.status === 200 && Array.isArray(response.data.numbers)) {
            console.log(`Fetched numbers: ${response.data.numbers}`);
            return response.data.numbers;
        }
        console.log(`Unexpected response format: ${JSON.stringify(response.data)}`);
    } catch (error) {
        console.error(`Error fetching numbers: ${error.message}`);
    }
    return [];
};

const calculateAverage = (numbers) => {
    if (!numbers.length) return 0;
    return numbers.reduce((acc, num) => acc + num, 0) / numbers.length;
};

app.get('/numbers/:numberId', async (req, res) => {
    const numberId = req.params.numberId;
    const fetchedNumbers = await fetchNumbers(numberId);
    const windowPrevState = [...numbersWindow];

    fetchedNumbers.forEach(num => {
        if (num !== null && !numbersWindow.includes(num)) {
            if (numbersWindow.length >= WINDOW_SIZE) {
                numbersWindow.shift();
            }
            numbersWindow.push(num);
        }
    });

    const windowCurrState = [...numbersWindow];
    const avg = numbersWindow.length === WINDOW_SIZE ? calculateAverage(numbersWindow) : 0;

    res.json({
        windowPrevState,
        windowCurrState,
        numbers: fetchedNumbers,
        avg: parseFloat(avg.toFixed(2)),
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});