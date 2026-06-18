const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

router.post('/api/ai/chat', requireAuth, async (req, res) => {
    const { message, context } = req.body;
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: context || 'Tu es un assistant expert pour agences digitales au Togo. Réponds en français.' },
                    { role: 'user', content: message }
                ],
                max_tokens: 1000,
                temperature: 0.7
            })
        });
        const data = await response.json();
        if (!data.choices) return res.status(500).json({ error: data });
        res.json({ reply: data.choices[0].message.content });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/api/ai/generate-posts', requireAuth, async (req, res) => {
    const { client, niche, platform, tone } = req.body;
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{
                    role: 'user',
                    content: `Génère 10 posts ${platform} pour "${client}", secteur "${niche}", ton "${tone}". Réponds UNIQUEMENT avec un tableau JSON: [{"post":"contenu avec emojis et hashtags","day":"Lundi"},...] Sans markdown.`
                }],
                max_tokens: 2000,
                temperature: 0.8
            })
        });
        const data = await response.json();
        let text = data.choices[0].message.content.trim();
        text = text.replace(/^```json\s*/i,'').replace(/^```\s*/i,'').replace(/```\s*$/i,'');
        res.json({ posts: JSON.parse(text) });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/api/ai/generate-site', requireAuth, async (req, res) => {
    const { businessName, niche, description, template } = req.body;
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{
                    role: 'user',
                    content: `Business: "${businessName}", template: "${template}", description: "${description}". Génère ce JSON exactement sans markdown: {"tagline":"accroche max 12 mots","about":"2-3 phrases spécifiques","services":[{"icon":"emoji","title":"nom","desc":"description"},{"icon":"emoji","title":"nom","desc":"description"},{"icon":"emoji","title":"nom","desc":"description"}],"testimonials":[{"name":"prénom togolais","text":"témoignage"},{"name":"prénom togolais","text":"témoignage"}],"faq":[{"q":"question","a":"réponse"},{"q":"question","a":"réponse"}]}`
                }],
                max_tokens: 1500,
                temperature: 0.7
            })
        });
        const data = await response.json();
        let text = data.choices[0].message.content.trim();
        text = text.replace(/^```json\s*/i,'').replace(/^```\s*/i,'').replace(/```\s*$/i,'');
        res.json({ content: JSON.parse(text) });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
