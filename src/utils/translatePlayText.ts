const phraseReplacements: [RegExp, string][] = [
  [/\bend of game\b/gi, "fim de jogo"],
  [/\bend of the 1st quarter\b/gi, "fim do 1º quarto"],
  [/\bend of the 2nd quarter\b/gi, "fim do 2º quarto"],
  [/\bend of the 3rd quarter\b/gi, "fim do 3º quarto"],
  [/\bend of the 4th quarter\b/gi, "fim do 4º quarto"],
  [/\bend of the 1st overtime\b/gi, "fim da 1ª prorrogação"],
  [/\bstart of the 1st quarter\b/gi, "início do 1º quarto"],
  [/\bstart of the 2nd quarter\b/gi, "início do 2º quarto"],
  [/\bstart of the 3rd quarter\b/gi, "início do 3º quarto"],
  [/\bstart of the 4th quarter\b/gi, "início do 4º quarto"],
  [/\bjump ball\b/gi, "bola ao alto"],
  [/\bshot clock turnover\b/gi, "turnover por estouro do relógio de posse"],
  [/\bthree point jumper\b/gi, "arremesso de 3 pontos"],
  [/\bthree point shot\b/gi, "arremesso de 3 pontos"],
  [/\b3-point jump shot\b/gi, "arremesso de 3 pontos"],
  [/\bpullup jump shot\b/gi, "arremesso após drible"],
  [/\bstep back jumpshot\b/gi, "arremesso após recuo"],
  [/\bstep back jump shot\b/gi, "arremesso após recuo"],
  [/\bfloating jump shot\b/gi, "arremesso flutuante"],
  [/\bdriving layup\b/gi, "bandeja em infiltração"],
  [/\brunning layup\b/gi, "bandeja em velocidade"],
  [/\bjump shot\b/gi, "arremesso"],
  [/\bhook shot\b/gi, "gancho"],
  [/\btip shot\b/gi, "tapinha"],
  [/\balley oop\b/gi, "ponte aérea"],
  [/\bfast break\b/gi, "contra-ataque"],
  [/\bfirst free throw\b/gi, "primeiro lance livre"],
  [/\bsecond free throw\b/gi, "segundo lance livre"],
  [/\bthird free throw\b/gi, "terceiro lance livre"],
  [/\bfree throw\b/gi, "lance livre"],
  [/\bdefensive rebound by\b/gi, "rebote defensivo de"],
  [/\boffensive rebound by\b/gi, "rebote ofensivo de"],
  [/\bdefensive rebound\b/gi, "rebote defensivo"],
  [/\boffensive rebound\b/gi, "rebote ofensivo"],
  [/\brebound by\b/gi, "rebote de"],
  [/\bassist by\b/gi, "assistência de"],
  [/\bsteal by\b/gi, "roubo de bola de"],
  [/\bblock by\b/gi, "bloqueio de"],
  [/\bblocked by\b/gi, "bloqueado por"],
  [/\bturnover by\b/gi, "turnover de"],
  [/\boffensive goaltending turnover\b/gi, "turnover por interferência ofensiva na trajetória"],
  [/\bgoaltending turnover\b/gi, "turnover por interferência na trajetória"],
  [/\boffensive goaltending\b/gi, "interferência ofensiva na trajetória"],
  [/\bbad pass\b/gi, "passe errado"],
  [/\blost ball\b/gi, "perdeu a bola"],
  [/\bshooting foul by\b/gi, "falta no arremesso de"],
  [/\bpersonal foul by\b/gi, "falta pessoal de"],
  [/\btechnical foul by\b/gi, "falta técnica de"],
  [/\btimeout\b/gi, "pedido de tempo"],
  [/\bsubstitution\b/gi, "substituição"],
  [/\benters the game\b/gi, "entra no jogo"],
  [/\bleaves the game\b/gi, "sai do jogo"],
  [/\bmakes\b/gi, "acerta"],
  [/\bmisses\b/gi, "erra"],
  [/\bmade\b/gi, "convertido"],
  [/\bmissed\b/gi, "errado"],
  [/\blayup\b/gi, "bandeja"],
  [/\bdunk\b/gi, "enterrada"],
  [/\bassists?\b/gi, "assistência"],
  [/\bsteals?\b/gi, "roubo de bola"],
  [/\bblocks?\b/gi, "bloqueio"],
  [/\brebounds?\b/gi, "rebote"],
  [/\bturnovers?\b/gi, "turnover"],
  [/\bshooting foul\b/gi, "falta no arremesso"],
  [/\bpersonal foul\b/gi, "falta pessoal"],
  [/\btechnical foul\b/gi, "falta técnica"]
];

function translateDistance(text: string) {
  return text.replace(/\b(\d+)-foot\b/gi, (_, value: string) => {
    const feet = Number(value);
    const meters = feet * 0.3048;
    return `de ${feet} pés (aprox. ${meters.toFixed(1).replace(".", ",")} m)`;
  });
}

export function translatePlayText(text: string): string {
  if (!text?.trim()) return "";

  let translated = translateDistance(text.trim());

  for (const [pattern, replacement] of phraseReplacements) {
    translated = translated.replace(pattern, replacement);
  }

  translated = translated
    .replace(
      /\b(acerta|erra) de (\d+ pés \(aprox\. [^)]+\)) (arremesso de 3 pontos|arremesso|bandeja|enterrada|gancho|tapinha)/gi,
      "$1 $3 de $2"
    )
    .replace(/\(([^()]+) roubo de bola\)/gi, "(roubo de bola de $1)")
    .replace(/\(([^()]+) assistência\)/gi, "(assistência de $1)")
    .replace(/\bperdeu a bola turnover\b/gi, "perdeu a bola e cometeu turnover")
    .replace(/\s+;/g, ";")
    .replace(/;\s*/g, "; ")
    .replace(/\(\s*/g, "(")
    .replace(/\s*\)/g, ")")
    .replace(/\s{2,}/g, " ")
    .trim();

  return translated || text;
}
