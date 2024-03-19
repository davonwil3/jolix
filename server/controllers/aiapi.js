const axios = require('axios');
const cheerio = require('cheerio');


const generateText = async (req, res) => {
  try {
    const { prompt } = req.body;
    const { size } = req.body;

    if (size === 'Short') {
        maxTokens = 150;
    } else if (size === 'Medium') {
        maxTokens = 400;
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


const summarize = async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
        console.log(url);
    try {
        const articleContent = await fetchArticleContent(url);
        if (!articleContent) {
            console.log('Failed to fetch article content');
            return res.status(404).json({ error: 'Failed to fetch article content.' });
        }
        
        const summary = await summarizeText(articleContent);

        console.log(summary);

        res.json({ summary : summary.summary });
    } catch (error) {
        console.error('Error summarizing article:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

async function fetchArticleContent(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const articleText = $('p').text();
        return articleText;
    } catch (error) {
        console.error('Error fetching article:', error);
        return null;
    }
}

async function summarizeText(text) {
        try {
                const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                        model: "gpt-3.5-turbo-0125",
                        messages: [
                            {
                                role: "user",
                                content: 'summarize the following passage' + text
                            }
                        ],
                        max_tokens: 500,
                    }, {
                        headers: {
                            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                            'Content-Type': 'application/json'
                        }
                });
                if (response.data.choices && response.data.choices.length > 0) {
                    const summary = response.data.choices[0].message.content;
                    return { summary };
                } else {
                    throw new Error('Failed to generate text: Empty response from OpenAI');
                }
            } catch (error) {
                console.error('OpenAI API request failed:', error);
                throw new Error('Failed to generate text');
            }
}


module.exports = {
    generateText,
    rephraseText,
    summarize
};