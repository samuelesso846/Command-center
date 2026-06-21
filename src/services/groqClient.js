const SECTOR_PROMPTS = {
  restaurant: {
    expert: "expert en restauration africaine et marketing gastronomique",
    sections: ["menu", "specialites", "reservation", "galerie_plats"],
    conversion_angle: "donner faim au visiteur et lui faire réserver une table immédiatement",
    services_label: "Notre Menu",
    local_context: "cuisine africaine et internationale, plats locaux et fusion, ambiance chaleureuse, clientèle africaine et diaspora"
  },
  avocat: {
    expert: "expert juridique et marketing des cabinets d'avocats en Afrique de l'Ouest",
    sections: ["domaines", "expertise", "procedure", "urgence"],
    conversion_angle: "rassurer le client sur sa situation juridique et le pousser à consulter",
    services_label: "Nos Domaines d'Expertise",
    local_context: "droit OHADA, droits nationaux africains, arbitrage international, contentieux commercial Afrique-Europe"
  },
  boutique: {
    expert: "expert en e-commerce mode et retail en Afrique de l'Ouest",
    sections: ["nouveautes", "produits_vedettes", "promotions", "livraison"],
    conversion_angle: "convertir les visiteurs en acheteurs en mettant en avant qualité et prix accessibles",
    services_label: "Nos Collections",
    local_context: "Mobile Money, paiement carte, livraison nationale et internationale, mode africaine contemporaine et internationale"
  },
  coach: {
    expert: "expert en coaching personnel et développement humain pour le marché africain",
    sections: ["methode", "resultats", "programme", "temoignages"],
    conversion_angle: "inspirer confiance et pousser à prendre un rendez-vous découverte gratuit",
    services_label: "Mes Programmes",
    local_context: "développement personnel, leadership africain et international, coaching en français pour clientèle africaine et diaspora"
  },
  agence: {
    expert: "expert en marketing digital et création d'agences web en Afrique",
    sections: ["portfolio", "services", "resultats_clients", "process"],
    conversion_angle: "démontrer l'expertise par des résultats concrets et décrocher un premier contact",
    services_label: "Nos Services Digitaux",
    local_context: "sites web, réseaux sociaux, SEO, publicité digitale, clients en Afrique francophone et en Europe"
  },
  portfolio: {
    expert: "expert en personal branding et présentation de portfolio créatif",
    sections: ["realisations", "competences", "experience", "contact"],
    conversion_angle: "impressionner le recruteur ou client et déclencher un contact immédiat",
    services_label: "Mes Compétences",
    local_context: "freelance international, créatif africain, professionnel francophone, clients en Afrique et en Europe"
  },
  landing: {
    expert: "expert en copywriting de landing pages à fort taux de conversion",
    sections: ["proposition_valeur", "benefices", "preuve_sociale", "cta"],
    conversion_angle: "maximiser le taux de conversion avec un message ultra-ciblé et des CTAs puissants",
    services_label: "Ce que vous obtenez",
    local_context: "offre claire pour marché africain et européen, bénéfices immédiats, garantie, urgence, paiement Mobile Money et carte"
  },
  blog: {
    expert: "expert en content marketing et création de blogs à forte audience",
    sections: ["articles_recents", "categories", "newsletter", "auteur"],
    conversion_angle: "fidéliser le lecteur et l'inciter à s'abonner à la newsletter",
    services_label: "Nos Rubriques",
    local_context: "contenu en français, audience africaine et diaspora européenne, sujets locaux et internationaux"
  }
};

async function generateSiteContent({ businessName, niche, description, templateType }) {
  const sector = SECTOR_PROMPTS[templateType] || SECTOR_PROMPTS.landing;
  
  const prompt = `Tu es un ${sector.expert} qui travaille pour une agence web premium en Afrique de l'Ouest. Tu crées du contenu de site web qui CONVERTIT — chaque mot doit pousser le visiteur à agir.

BRIEF CLIENT :
- Nom : ${businessName}
- Secteur : ${templateType}
- Niche : ${niche}
- Description : ${description}
- Contexte local : ${sector.local_context}

OBJECTIF DE CONVERSION : ${sector.conversion_angle}

RÈGLES ABSOLUES DE COPYWRITING PREMIUM :
- MOTS INTERDITS : "Nous résolvons", "Vous obtenez", "Notre équipe", "de qualité", "n'hésitez pas", "nous nous chargeons", "nous nous occupons"
- Écris comme un copywriter humain senior — varie les structures, utilise des métaphores et questions rhétoriques
- Tagline : 4-6 mots maximum, une image mentale forte qui reste en tête
- Services : chaque titre = nom commercial attractif, description commence par verbe fort (Savourez, Découvrez, Transformez) et peint une IMAGE MENTALE
- Témoignages : inclure UN chiffre précis (ex: "en 3 semaines", "depuis 2 ans") qui rend le témoignage crédible
- About : raconte une HISTOIRE avec début, transformation, promesse
- Prix adaptés au marché (FCFA pour l'Afrique, EUR pour l'Europe)
- Chaque phrase doit convaincre — sinon supprime-la

SEO : génère un titre et meta description optimisés pour la recherche locale en Afrique francophone et internationale si pertinent.

Réponds UNIQUEMENT avec un objet JSON valide :

{
  "seo_title": "titre SEO optimisé 60 chars max avec ville/pays si pertinent",
  "seo_description": "meta description 155 chars max, inclut mots-clés locaux",
  "og_title": "titre Open Graph accrocheur",
  "tagline": "accroche 6 mots max, mémorisable et différenciante",
  "hero_subtitle": "proposition de valeur unique en 1-2 phrases orientées bénéfices client",
  "cta_primary": "CTA principal orienté action immédiate (max 5 mots)",
  "cta_secondary": "CTA secondaire (max 5 mots)",
  "about_title": "titre À propos accrocheur qui raconte une histoire",
  "about": "3-4 phrases qui racontent l'histoire du business, sa différence, sa promesse. Orienté bénéfices client. Très spécifique.",
  "about_highlight": "1 chiffre ou fait marquant ultra-spécifique",
  "services_title": "${sector.services_label}",
  "services": [
    {"icon": "emoji", "title": "nom du service orienté bénéfice", "description": "2 phrases : problème résolu + comment. En bénéfices client.", "price_hint": "prix en FCFA ou indication"},
    {"icon": "emoji", "title": "nom service 2", "description": "2 phrases bénéfices", "price_hint": ""},
    {"icon": "emoji", "title": "nom service 3", "description": "2 phrases bénéfices", "price_hint": ""},
    {"icon": "emoji", "title": "nom service 4", "description": "2 phrases bénéfices", "price_hint": ""}
  ],
  "stats": [
    {"number": "chiffre spécifique", "label": "label court"},
    {"number": "chiffre spécifique", "label": "label court"},
    {"number": "chiffre spécifique", "label": "label court"}
  ],
  "testimonials": [
    {"name": "prénom togolais", "role": "profession + ville", "text": "témoignage avec 1 détail hyper-spécifique qui prouve l'authenticité", "rating": 5},
    {"name": "prénom togolais", "role": "profession + ville", "text": "témoignage spécifique", "rating": 5},
    {"name": "prénom togolais", "role": "profession + ville", "text": "témoignage spécifique", "rating": 5}
  ],
  "faq": [
    {"question": "question que SE POSE vraiment un client de ce secteur", "answer": "réponse rassurante et précise"},
    {"question": "question spécifique secteur", "answer": "réponse précise"},
    {"question": "question spécifique secteur", "answer": "réponse précise"}
  ],
  "whatsapp_message": "message WhatsApp pré-rempli naturel et engageant",
  "footer_description": "slogan de positionnement court et mémorisable"
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
      max_tokens: 4000
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
