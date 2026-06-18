async function generateSiteContent({ businessName, niche, description, templateType }) {
  const prompt = `Tu es un copywriter expert qui rédige du contenu marketing en français pour des petites entreprises togolaises.

Business : ${businessName}
Secteur / template : ${templateType}
Niche : ${niche}
Description fournie par le client : ${description}

Génère le contenu complet d'un site vitrine pour ce business. Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans texte autour, au format exact suivant :

{
  "tagline": "phrase d'accroche courte (max 15 mots)",
  "about": "paragraphe À propos de 2-3 phrases, spécifique au business décrit",
  "services": [
    {"title": "nom du service 1", "description": "description courte et concrète"},
    {"title": "nom du service 2", "description": "description courte et concrète"},
    {"title": "nom du service 3", "description": "description courte et concrète"}
  ],
  "gallery_captions": ["légende image 1", "légende image 2", "légende image 3", "légende image 4"],
  "testimonials": [
    {"name": "prénom togolais plausible", "text": "témoignage court et crédible"},
    {"name": "prénom togolais plausible", "text": "témoignage court et crédible"}
  ],
  "faq": [
    {"question": "question fréquente plausible pour ce secteur", "answer": "réponse courte"},
    {"question": "question fréquente plausible pour ce secteur", "answer": "réponse courte"}
  ]
}

Le contenu doit être réaliste et spécifique au business décrit. "Service 1", "Description du service" et toute formulation générique sont INTERDITS.`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500
    })
  });

  const data = await res.json();
  if (!data.choices || !data.choices[0]) {
    throw new Error('Réponse Groq invalide: ' + JSON.stringify(data));
  }
  let raw = data.choices[0].message.content.trim();
  raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '');
  return JSON.parse(raw);
}

module.exports = { generateSiteContent };
