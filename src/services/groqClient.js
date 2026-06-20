async function generateSiteContent({ businessName, niche, description, templateType }) {
  const prompt = `Tu es un copywriter senior et directeur artistique qui travaille pour une agence web premium en Afrique de l'Ouest. Tu rédiges du contenu marketing haut de gamme en français pour des entreprises togolaises qui paient 100 000 FCFA pour leur site.

BRIEF CLIENT :
- Nom de l'entreprise : ${businessName}
- Secteur : ${templateType}
- Niche : ${niche}
- Description : ${description}

MISSION : Rédige un contenu de site vitrine professionnel, percutant et spécifique à cette entreprise. Le contenu doit sembler écrit par un copywriter humain expérimenté, pas par une IA.

RÈGLES ABSOLUES :
- Zéro formulation générique ("Service 1", "Notre équipe", "Nous sommes là pour vous", etc.)
- Chaque phrase doit être spécifique à CE business précis
- Le ton doit être professionnel mais chaleureux, adapté au marché togolais
- Les témoignages doivent être ultra-réalistes avec des détails concrets
- Les services doivent avoir des noms commerciaux attractifs (pas juste "Consultation")
- La tagline doit être mémorisable et différenciante
- Le texte hero_subtitle doit donner envie de contacter immédiatement
- L'about doit raconter une histoire, pas juste décrire

Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans texte autour :

{
  "tagline": "accroche principale percutante et mémorisable (max 10 mots)",
  "hero_subtitle": "sous-titre hero qui explique la valeur et donne envie d'agir (1-2 phrases)",
  "cta_primary": "texte bouton CTA principal (ex: Demandez votre devis gratuit)",
  "cta_secondary": "texte bouton CTA secondaire (ex: Découvrir nos réalisations)",
  "about_title": "titre section À propos accrocheur",
  "about": "paragraphe À propos de 3-4 phrases qui raconte l'histoire du business, ses valeurs, sa différence. Très spécifique.",
  "about_highlight": "chiffre ou fait marquant (ex: +200 clients satisfaits depuis 2018)",
  "services_title": "titre section services accrocheur",
  "services": [
    {"icon": "emoji pertinent", "title": "nom commercial attractif du service", "description": "description bénéfice-client de 2 phrases, concrète et spécifique", "price_hint": "indication tarifaire si pertinent (optionnel, sinon chaîne vide)"},
    {"icon": "emoji pertinent", "title": "nom commercial attractif", "description": "description bénéfice-client de 2 phrases", "price_hint": ""},
    {"icon": "emoji pertinent", "title": "nom commercial attractif", "description": "description bénéfice-client de 2 phrases", "price_hint": ""},
    {"icon": "emoji pertinent", "title": "nom commercial attractif", "description": "description bénéfice-client de 2 phrases", "price_hint": ""}
  ],
  "stats": [
    {"number": "chiffre impactant", "label": "ce que représente ce chiffre"},
    {"number": "chiffre impactant", "label": "ce que représente ce chiffre"},
    {"number": "chiffre impactant", "label": "ce que représente ce chiffre"}
  ],
  "testimonials": [
    {"name": "prénom togolais réaliste", "role": "profession ou ville", "text": "témoignage de 2-3 phrases très concret avec un détail spécifique", "rating": 5},
    {"name": "prénom togolais réaliste", "role": "profession ou ville", "text": "témoignage de 2-3 phrases très concret", "rating": 5},
    {"name": "prénom togolais réaliste", "role": "profession ou ville", "text": "témoignage de 2-3 phrases très concret", "rating": 5}
  ],
  "faq": [
    {"question": "question très spécifique au secteur", "answer": "réponse complète et rassurante de 2-3 phrases"},
    {"question": "question très spécifique au secteur", "answer": "réponse complète et rassurante"},
    {"question": "question très spécifique au secteur", "answer": "réponse complète et rassurante"}
  ],
  "whatsapp_message": "message pré-rempli WhatsApp (ex: Bonjour, je souhaite un devis pour...)",
  "footer_description": "phrase de positionnement pour le footer (1-2 phrases)"
}`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 2500
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
