const phraseTranslations: Array<[RegExp, string]> = [
  [/\bfull game highlights\b/gi, "melhores momentos da partida"],
  [/\bgame highlights\b/gi, "melhores momentos da partida"],
  [/\bgame recap\b/gi, "resumo da partida"],
  [/\balley-oop slam\b/gi, "ponte aérea com enterrada"],
  [/\bdrives to the basket\b/gi, "infiltra em direção à cesta"],
  [/\bgame winner\b/gi, "arremesso da vitória"],
  [/\bthree-pointer\b/gi, "arremesso de 3 pontos"],
  [/\b3-pointer\b/gi, "arremesso de 3 pontos"],
  [/\btough 3\b/gi, "bola de 3 difícil"],
  [/\btough and-1\b/gi, "cesta difícil com falta"],
  [/\bbig slam\b/gi, "grande enterrada"],
  [/\bputback jam\b/gi, "enterrada no rebote"],
  [/\bputback dunk\b/gi, "enterrada no rebote"],
  [/\bhuge block\b/gi, "grande toco"],
  [/\bcomes out of nowhere\b/gi, "aparece do nada"],
  [/\bcatches lob\b/gi, "recebe passe aéreo"],
  [/\bthrows down a\b/gi, "crava uma"],
  [/\bhold off\b/gi, "segura"],
  [/\bthrows down\b/gi, "crava"],
  [/\bknocks down\b/gi, "acerta"],
  [/\bconnects on\b/gi, "converte"],
  [/\bfirst half\b/gi, "primeiro tempo"],
  [/\bsecond half\b/gi, "segundo tempo"],
  [/\bfor a\b/gi, "para uma"],
  [/\bfor an\b/gi, "para um"]
];

const wordTranslations: Array<[RegExp, string]> = [
  [/\bhighlights\b/gi, "melhores momentos"],
  [/\brecap\b/gi, "resumo"],
  [/\bvictory\b/gi, "vitória"],
  [/\bwin\b/gi, "vitória"],
  [/\bdefeat\b/gi, "derrota"],
  [/\bbeats\b/gi, "vence"],
  [/\bslam\b/gi, "enterrada"],
  [/\bdunk\b/gi, "enterrada"],
  [/\bjam\b/gi, "enterrada"],
  [/\blob\b/gi, "passe aéreo"],
  [/\bscores\b/gi, "pontua"],
  [/\bblock\b/gi, "toco"],
  [/\bassist\b/gi, "assistência"],
  [/\bsteal\b/gi, "roubo de bola"],
  [/\bclutch\b/gi, "decisivo"],
  [/\bovertime\b/gi, "prorrogação"],
  [/\bquarter\b/gi, "quarto"]
];

function preserveSentenceStart(original: string, translated: string) {
  if (!translated) return translated;
  if (/^[A-Z]/.test(original)) return translated.charAt(0).toUpperCase() + translated.slice(1);
  return translated;
}

export function translateHighlightText(text?: string) {
  if (!text?.trim()) return "";

  let translated = text.trim();

  [...phraseTranslations, ...wordTranslations].forEach(([pattern, replacement]) => {
    translated = translated.replace(pattern, replacement);
  });

  translated = translated
    .replace(/\bfor the ([A-Z][A-Za-z0-9 .'-]+)$/g, "pelos $1")
    .replace(/\bfor ([A-Z][A-Za-z0-9 .'-]+)$/g, "por $1");

  return preserveSentenceStart(text, translated);
}
