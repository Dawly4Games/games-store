const supabaseUrl =
"https://usucpguuzqcbevjawipa.supabase.co";

const supabaseKey =
"sb_publishable_BWeaxZ7ShIlpCQJ-EQPoVw_dpYz3iOL";

const client =
window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

document
  .getElementById("importBtn")
  .addEventListener("click", importGames);

function getCategory(name) {

  const n = name.toLowerCase();

  // Sports
  if (
    n.includes("fifa") ||
    n.includes("ea sports fc") ||
    n.includes("fc 25") ||
    n.includes("fc 26") ||
    n.includes("pes") ||
    n.includes("pro evolution soccer") ||
    n.includes("wwe") ||
    n.includes("nba") ||
    n.includes("motogp")
  ) return "Sports";

  // Racing
  if (
    n.includes("forza") ||
    n.includes("need for speed") ||
    n.includes("dirt") ||
    n.includes("assetto") ||
    n.includes("ride ") ||
    n.includes("flatout") ||
    n.includes("the crew") ||
    n.includes("lego 2k drive") ||
    n.includes("taxi life") ||
    n.includes("euro truck") ||
    n.includes("american truck")
  ) return "Racing";

  // Horror
  if (
    n.includes("resident evil") ||
    n.includes("silent hill") ||
    n.includes("outlast") ||
    n.includes("dead space") ||
    n.includes("the evil within") ||
    n.includes("poppy playtime") ||
    n.includes("reanimal") ||
    n.includes("until dawn") ||
    n.includes("alien") ||
    n.includes("a quiet place") ||
    n.includes("alan wake") ||
    n.includes("callisto") ||
    n.includes("the callisto protocol") ||
    n.includes("little nightmares") ||
    n.includes("backrooms") ||
    n.includes("liminal exit") ||
    n.includes("vampyr") ||
    n.includes("cronos") ||
    n.includes("friday the 13th") ||
    n.includes("walking dead") ||
    n.includes("zombie army") ||
    n.includes("world war z")
  ) return "Horror";

  // Shooter
  if (
    n.includes("battlefield") ||
    n.includes("call of duty") ||
    n.includes("sniper elite") ||
    n.includes("sniper ghost warrior") ||
    n.includes("doom") ||
    n.includes("far cry") ||
    n.includes("wolfenstein") ||
    n.includes("crysis") ||
    n.includes("ready or not") ||
    n.includes("gears") ||
    n.includes("medal of honor") ||
    n.includes("homefront") ||
    n.includes("spec ops") ||
    n.includes("easy red")
  ) return "Shooter";

  // Open World
  if (
    n.includes("gta") ||
    n.includes("grand theft auto") ||
    n.includes("red dead") ||
    n.includes("mafia") ||
    n.includes("watch dogs") ||
    n.includes("cyberpunk") ||
    n.includes("hogwarts legacy") ||
    n.includes("just cause") ||
    n.includes("sleeping dogs") ||
    n.includes("mad max")
  ) return "Open World";

  // RPG
  if (
    n.includes("witcher") ||
    n.includes("elden ring") ||
    n.includes("dark souls") ||
    n.includes("baldur") ||
    n.includes("fallout") ||
    n.includes("final fantasy") ||
    n.includes("kingdom come") ||
    n.includes("lies of p") ||
    n.includes("mass effect") ||
    n.includes("dragon ball z kakarot") ||
    n.includes("skyrim") ||
    n.includes("oblivion")
  ) return "RPG";

  // Adventure
  if (
    n.includes("assassin") ||
    n.includes("tomb raider") ||
    n.includes("uncharted") ||
    n.includes("detroit") ||
    n.includes("heavy rain") ||
    n.includes("death stranding") ||
    n.includes("god of war") ||
    n.includes("spider") ||
    n.includes("batman") ||
    n.includes("ghost of tsushima") ||
    n.includes("ratchet") ||
    n.includes("plague tale") ||
    n.includes("beyond two souls")
  ) return "Adventure";

  // Fighting
  if (
    n.includes("tekken") ||
    n.includes("mortal kombat") ||
    n.includes("street fighter") ||
    n.includes("injustice") ||
    n.includes("dragon ball") ||
    n.includes("jump force") ||
    n.includes("sifu")
  ) return "Fighting";

  // Simulation
  if (
    n.includes("simulator") ||
    n.includes("flight") ||
    n.includes("truck") ||
    n.includes("planet zoo") ||
    n.includes("farming simulator") ||
    n.includes("police simulator") ||
    n.includes("snowrunner")
  ) return "Simulation";

  // Strategy
  if (
    n.includes("age of empires") ||
    n.includes("age of mythology") ||
    n.includes("civilization") ||
    n.includes("red alert") ||
    n.includes("stronghold") ||
    n.includes("company of heroes") ||
    n.includes("total war") ||
    n.includes("manor lords") ||
    n.includes("crusader kings") ||
    n.includes("tropico") ||
    n.includes("commandos")
  ) return "Strategy";

  return "Action";
}

function cleanName(name) {

  name = name.replace(/^".*:\\/, "");

  name = name.replace(/\(.*?gb.*?\)/ig, "");

  name = name.replace(/[- ]*\d+(\.\d+)?\s*gb/ig, "");

  name = name.replace(/not cracked/ig, "");

  name = name.replace(/setup/ig, "");

  name = name.replace(/[()"]/g, "");

  name = name.replace(/\s+/g, " ");

  return name.trim();
}

function getSize(text) {

  const match =
  text.match(/(\d+(\.\d+)?)\s*gb/i);

  if (!match) return 0;

  return Number(match[1]);
}

async function importGames() {

  const text =
  document
  .getElementById("gamesInput")
  .value
  .trim();

  if (!text) {

    alert("الصق قائمة الألعاب");

    return;
  }

  const lines =
  text
  .split("\n")
  .filter(x => x.trim());

  const games = [];

  for (const line of lines) {

    const size = getSize(line);
    const name = cleanName(line);

    if (!name) continue;

    const price =
    Math.ceil(size * 0.30);

    games.push({

      name: name,
      size_gb: size,
      price: price,
      category: getCategory(name),
      image_url: "",
      featured: false

    });

  }

  const uniqueGames =
  [...new Map(
    games.map(g => [g.name, g])
  ).values()];

  const { error } =
  await client
  .from("games")
  .upsert(
    uniqueGames,
    {
      onConflict: "name"
    }
  );

  if (error) {

    document
    .getElementById("result")
    .innerHTML =
    "❌ " + error.message;

    console.error(error);

    return;
  }

  document
  .getElementById("result")
  .innerHTML =
  "✅ تم استيراد " +
  uniqueGames.length +
  " لعبة بنجاح";
}