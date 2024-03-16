const axios = require('axios');

const generateText = async (req, res) => {
  try {
    const { prompt } = req.body;
    const { size } = req.body;

    if (size === 'Short') {
        maxTokens = 150;
    } else if (size === 'Medium') {
        maxTokens = 300;
    }
    else if (size === 'Long') {
        maxTokens = 750;
    }
    else {
        maxTokens = 150;
    }
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: maxTokens,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.data.choices && response.data.choices.length > 0) {
      const lastMessage = response.data.choices[0].message.content;
      res.json({ result: lastMessage });
    } else {
      res.status(500).send('Failed to generate text: Empty response from OpenAI');
    }
  } catch (error) {
    console.error('OpenAI API request failed:', error);
    res.status(500).send('Failed to generate text');
  }
};


const rephraseText = async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo-0125",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 450,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
    });
    if (response.data.choices && response.data.choices.length > 0) {
      const lastMessage = response.data.choices[0].message.content;
      console.log(lastMessage);
      res.json({ result: lastMessage });
    } else {
      res.status(500).send('Failed to generate text: Empty response from OpenAI');
    }
  } catch (error) {
    console.error('OpenAI API request failed:', error);
    res.status(500).send('Failed to generate text');
  }
};


module.exports = {
    generateText,
    rephraseText
};