export const NBA_PLAYER_IMAGES: Record<string, string> = {
  "Shai Gilgeous-Alexander": "https://a.espncdn.com/i/headshots/nba/players/full/4278073.png",
  "Cooper Flagg": "https://a.espncdn.com/i/headshots/nba/players/full/5041939.png",
  "Keldon Johnson": "https://a.espncdn.com/i/headshots/nba/players/full/4395723.png",
  "Nickeil Alexander-Walker": "https://a.espncdn.com/i/headshots/nba/players/full/4278039.png",
  "Stephon Castle": "https://a.espncdn.com/i/headshots/nba/players/full/4845367.png",
  "Evan Mobley": "https://a.espncdn.com/i/headshots/nba/players/full/4432158.png",
  "Dyson Daniels": "https://a.espncdn.com/i/headshots/nba/players/full/4869342.png",
  "Payton Pritchard": "https://a.espncdn.com/i/headshots/nba/players/full/4066354.png",
  "Jalen Brunson": "https://a.espncdn.com/i/headshots/nba/players/full/3934672.png",
  "Nikola Jokic": "https://a.espncdn.com/i/headshots/nba/players/full/3112335.png",
  "Victor Wembanyama": "https://a.espncdn.com/i/headshots/nba/players/full/5104157.png",
  "Rudy Gobert": "https://a.espncdn.com/i/headshots/nba/players/full/3032976.png",
  "Naz Reid": "https://a.espncdn.com/i/headshots/nba/players/full/4396971.png",
  "Tyrese Maxey": "https://a.espncdn.com/i/headshots/nba/players/full/4431678.png",
  "Jaylen Brown": "https://a.espncdn.com/i/headshots/nba/players/full/3917376.png",
  "Stephen Curry": "https://a.espncdn.com/i/headshots/nba/players/full/3975.png",
  "Joel Embiid": "https://a.espncdn.com/i/headshots/nba/players/full/3059318.png",
  "Paolo Banchero": "https://a.espncdn.com/i/headshots/nba/players/full/4432573.png",
  "Jaren Jackson Jr.": "https://a.espncdn.com/i/headshots/nba/players/full/4277961.png",
  "LaMelo Ball": "https://a.espncdn.com/i/headshots/nba/players/full/4432816.png",
  "LeBron James": "https://a.espncdn.com/i/headshots/nba/players/full/1966.png",
  "Jayson Tatum": "https://a.espncdn.com/i/headshots/nba/players/full/4065648.png",
  "Coby White": "https://a.espncdn.com/i/headshots/nba/players/full/4395651.png"
};

export function getPlayerImageUrl(playerName?: string, fallback?: string) {
  if (!playerName || playerName === "A definir") return undefined;
  return NBA_PLAYER_IMAGES[playerName] ?? fallback;
}
