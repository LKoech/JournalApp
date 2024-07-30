import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { mood } = req.body;

    if (!configuration.apiKey) {
      return res.status(500).json({
        error: "OpenAI API key not configured, please follow instructions in README.md"
      });
    }

    try {
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Provide some suggestions to improve mood when someone feels ${mood}.`,
        max_tokens: 100,
      });

      const suggestion = response.data.choices[0].text.trim();
      res.status(200).json({ suggestion });
    } catch (error) {
      console.error('Error fetching suggestion from OpenAI:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Failed to fetch suggestion' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}