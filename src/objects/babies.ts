// The sprites are located at:

// ```
// C:\Program Files (x86)\Steam\steamapps\common\The Binding of Isaac Rebirth\resources-dlc3\gfx\characters\player2\
// ```

// The baby descriptions are located at:
// https://bindingofisaacrebirth.fandom.com/wiki/User:Zamie/Babies_Mod

import {
  CollectibleType,
  SeedEffect,
  TrinketType,
} from "isaac-typescript-definitions";
import { HasAllEnumKeys } from "isaacscript-common";
import { Incubus } from "../classes/babies/familiars/Incubus";
import * as bc from "../classes/babyClasses";
import { CollectibleTypeCustom } from "../enums/CollectibleTypeCustom";
import { RandomBabyType } from "../enums/RandomBabyType";
import { BabyDescription } from "../types/BabyDescription";

export const BABIES = {
  // 0
  [RandomBabyType.SPIDER]: {
    name: "Spider Baby",
    description: "Shoots a Blue Spider every 2nd tear",
    sprite: "000_baby_spider.png",
    requireTears: true,
    num: 2,
    class: bc.SpiderBaby,
  },

  // 1
  [RandomBabyType.LOVE]: {
    name: "Love Baby",
    description: "Spawns a random heart on room clear",
    sprite: "001_baby_love.png",
    class: bc.LoveBaby,
  },

  // 2
  [RandomBabyType.BLOAT]: {
    name: "Bloat Baby",
    description: "Syringe tears", // Euthanasia
    sprite: "002_baby_bloat.png",
    num: 3,
    requireTears: true,
    class: bc.BloatBaby,
  },

  // 3
  [RandomBabyType.WATER]: {
    name: "Water Baby",
    description: "Starts with Isaac's Tears (improved)",
    sprite: "003_baby_water.png",
    item: CollectibleType.ISAACS_TEARS,
    class: bc.WaterBaby,
  },

  // 4
  [RandomBabyType.PSY]: {
    name: "Psy Baby",
    description: "Starts with Spoon Bender",
    sprite: "004_baby_psy.png",
    item: CollectibleType.SPOON_BENDER,
  },

  // 5
  [RandomBabyType.CURSED]: {
    name: "Cursed Baby",
    description: "Starts with Cursed Eye",
    sprite: "005_baby_cursed.png",
    item: CollectibleType.CURSED_EYE,
    requireTears: true,
  },

  // 6
  [RandomBabyType.TROLL]: {
    name: "Troll Baby",
    description: "Spawns a Troll Bomb every 3 seconds",
    sprite: "006_baby_troll.png",
    num: 3,
    class: bc.TrollBaby,
  },

  // 7
  [RandomBabyType.YBAB]: {
    name: "Ybab Baby",
    description: "Starts with Analog Stick",
    sprite: "007_baby_ybab.png",
    item: CollectibleType.ANALOG_STICK,
    requireTears: true,
  },

  // 8
  [RandomBabyType.COCKEYED]: {
    name: "Cockeyed Baby",
    description: "Shoots extra tears with random velocity",
    sprite: "008_baby_cockeyed.png",
    requireTears: true,
    class: bc.CockeyedBaby,
  },

  // 9
  [RandomBabyType.HOST]: {
    name: "Host Baby",
    description: "Spawns 10 Blue Spiders on hit",
    sprite: "009_baby_host.png",
    num: 10,
    class: bc.HostBaby,
  },

  // 10
  [RandomBabyType.LOST]: {
    name: "Lost Baby",
    description: "Starts with Holy Mantle + Lost-style health",
    sprite: "010_baby_lost.png",
    item: CollectibleType.HOLY_MANTLE,
    class: bc.LostBaby,
  },

  // 11
  [RandomBabyType.CUTE]: {
    name: "Cute Baby",
    description: "-1 damage per pickup taken",
    sprite: "011_baby_cute.png",
    class: bc.CuteBaby,
  },

  // 12
  [RandomBabyType.CROW]: {
    name: "Crow Baby",
    description: "Starts with Dead Bird (improved)",
    sprite: "012_baby_crow.png",
    item: CollectibleType.DEAD_BIRD,
    class: bc.CrowBaby,
  },

  // 13
  [RandomBabyType.SHADOW]: {
    name: "Shadow Baby",
    description: "Devil Rooms / Angel Rooms go to the Black Market instead",
    sprite: "013_baby_shadow.png",
    class: bc.ShadowBaby,
  },

  // 14
  [RandomBabyType.GLASS]: {
    name: "Glass Baby",
    description: "Orbiting laser ring",
    sprite: "014_baby_glass.png",
    class: bc.GlassBaby,
  },

  // 15
  [RandomBabyType.GOLD]: {
    name: "Gold Baby",
    description: "Gold gear + gold poops + gold rooms",
    sprite: "015_baby_gold.png",
    class: bc.GoldBaby,
  },

  // 16
  [RandomBabyType.CY]: {
    name: "Cy-Baby",
    description: "Starts with Technology 2",
    sprite: "016_baby_cy.png",
    item: CollectibleType.TECHNOLOGY_2,
  },

  // 17
  [RandomBabyType.BEAN]: {
    name: "Bean Baby",
    description: "Constant Butter Bean effect",
    sprite: "017_baby_bean.png",
    class: bc.BeanBaby,
  },

  // 18
  [RandomBabyType.MAG]: {
    name: "Mag Baby",
    description: "Confusion tears",
    sprite: "018_baby_mag.png",
    requireTears: true,
    class: bc.MagBaby,
  },

  // 19
  [RandomBabyType.WRATH]: {
    name: "Wrath Baby",
    description: "Anarchist Cookbook effect every 7 seconds",
    sprite: "019_baby_wrath.png",
    num: 7,
    class: bc.WrathBaby,
  },

  // 20
  [RandomBabyType.WRAPPED]: {
    name: "Wrapped Baby",
    description: "5x Kamikaze effect on hit",
    sprite: "020_baby_wrapped.png",
    num: 5,
    class: bc.WrappedBaby,
  },

  // 21
  [RandomBabyType.BEGOTTEN]: {
    name: "Begotten Baby",
    description: "Starts with Eve's Mascara",
    sprite: "021_baby_begotten.png",
    item: CollectibleType.EVES_MASCARA,
  },

  // 22
  [RandomBabyType.DEAD]: {
    name: "Dead Baby",
    description: "Starts with ???'s Only Friend + blindfolded",
    sprite: "022_baby_dead.png",
    item: CollectibleType.BLUE_BABYS_ONLY_FRIEND,
    itemNum: 2,
    blindfolded: true,
    softlockPreventionDestroyPoops: true, // ???'s Only Friend cannot kill poops
  },

  // 23
  [RandomBabyType.FIGHTING]: {
    name: "Fighting Baby",
    description: "Starts with Bloody Lust",
    sprite: "023_baby_fighting.png",
    item: CollectibleType.BLOODY_LUST,
  },

  // 24
  [RandomBabyType.ZERO]: {
    name: "-0- Baby",
    description: "Invulnerability",
    sprite: "024_baby_0.png",
    class: bc.ZeroBaby,
  },

  // 25
  [RandomBabyType.GLITCH]: {
    name: "Glitch Baby",
    description: "Starts with GB Bug",
    sprite: "025_baby_glitch.png",
    item: CollectibleType.GB_BUG,
  },

  // 26
  [RandomBabyType.MAGNET]: {
    name: "Magnet Baby",
    description: "Magnetizing tears",
    sprite: "026_baby_magnet.png",
    requireTears: true,
    class: bc.MagnetBaby,
  },

  // 27
  [RandomBabyType.BLACK]: {
    name: "Black Baby",
    description: "Curse Room doors in uncleared rooms",
    sprite: "027_baby_black.png",
    class: bc.BlackBaby,
  },

  // 28
  [RandomBabyType.RED]: {
    name: "Red Baby",
    description: "Starts with 5x Distant Admiration",
    sprite: "028_baby_red.png",
    item: CollectibleType.DISTANT_ADMIRATION,
    itemNum: 5,
  },

  // 29
  [RandomBabyType.WHITE]: {
    name: "White Baby",
    description: "Starts with Hallowed Ground",
    sprite: "029_baby_white.png",
    item: CollectibleType.HALLOWED_GROUND,
  },

  // 30
  [RandomBabyType.BLUE]: {
    name: "Blue Baby",
    description: "Sprinkler tears",
    sprite: "030_baby_blue.png",
    requireTears: true,
    class: bc.BlueBaby,
  },

  // 31
  [RandomBabyType.RAGE]: {
    name: "Rage Baby",
    description: "Starts with Sad Bombs + golden bomb + blindfolded",
    sprite: "031_baby_rage.png",
    item: CollectibleType.SAD_BOMBS,
    goldenBomb: true,
    blindfolded: true,
  },

  // 32
  [RandomBabyType.CRY]: {
    name: "Cry Baby",
    description: "Enemies are fully healed on hit",
    sprite: "032_baby_cry.png",
    class: bc.CryBaby,
  },

  // 33
  [RandomBabyType.YELLOW]: {
    name: "Yellow Baby",
    description: "Lemon Party effect on hit",
    sprite: "033_baby_yellow.png",
    class: bc.YellowBaby,
  },

  // 34
  [RandomBabyType.LONG]: {
    name: "Long Baby",
    description: "Flat tears",
    sprite: "034_baby_long.png",
    requireTears: true,
    class: bc.LongBaby,
  },

  // 35
  [RandomBabyType.GREEN]: {
    name: "Green Baby",
    description: "Booger tears",
    sprite: "035_baby_green.png",
    requireTears: true,
    class: bc.GreenBaby,
  },

  // 36
  [RandomBabyType.LIL]: {
    name: "Lil Baby",
    description: "Everything is tiny",
    sprite: "036_baby_lil.png",
    class: bc.LilBaby,
  },

  // 37
  [RandomBabyType.BIG]: {
    name: "Big Baby",
    description: "Everything is giant",
    sprite: "037_baby_big.png",
    class: bc.BigBaby,
  },

  // 38
  [RandomBabyType.BROWN]: {
    name: "Brown Baby",
    description: "Starts with Dirty Mind + spawns a poop per enemy killed",
    sprite: "038_baby_brown.png",
    item: CollectibleType.DIRTY_MIND,
    class: bc.BrownBaby,
  },

  // 39
  [RandomBabyType.NOOSE]: {
    name: "Noose Baby",
    description: "Don't shoot when the timer reaches 0",
    sprite: "039_baby_noose.png",
    num: 6, // Duration of the timer in seconds
    class: bc.NooseBaby,
  },

  // 40
  [RandomBabyType.HIVE]: {
    name: "Hive Baby",
    description: "Starts with Hive Mind + max Blue Flies + max Blue Spiders",
    sprite: "040_baby_hive.png",
    item: CollectibleType.HIVE_MIND,
    class: bc.HiveBaby,
  },

  // 41
  [RandomBabyType.BUDDY]: {
    name: "Buddy Baby",
    description: "Removes a heart container on hit",
    sprite: "041_baby_buddy.png",
  },

  // 42
  [RandomBabyType.COLORFUL]: {
    name: "Colorful Baby",
    description: "Acid trip",
    sprite: "042_baby_colorful.png",
    class: bc.ColorfulBaby,
  },

  // 43
  [RandomBabyType.WHORE]: {
    name: "Whore Baby",
    description: "All enemies explode",
    sprite: "043_baby_whore.png",
    class: bc.WhoreBaby,
  },

  // 44
  [RandomBabyType.CRACKED]: {
    name: "Cracked Baby",
    description: "Starts with Cracked Dice",
    sprite: "044_baby_cracked.png",
    trinket: TrinketType.CRACKED_DICE,
  },

  // 45
  [RandomBabyType.DRIPPING]: {
    name: "Dripping Baby",
    description: "Starts with Isaac's Heart",
    sprite: "045_baby_dripping.png",
    item: CollectibleType.ISAACS_HEART,
  },

  // 46
  [RandomBabyType.BLINDING]: {
    name: "Blinding Baby",
    description: "Spawns a Sun Card on hit",
    sprite: "046_baby_blinding.png",
    class: bc.BlindingBaby,
  },

  // 47
  [RandomBabyType.SUCKY]: {
    name: "Sucky Baby",
    description: "Succubus aura",
    sprite: "047_baby_sucky.png",
    item: CollectibleType.SUCCUBUS,
    class: bc.SuckyBaby,
  },

  // 48
  [RandomBabyType.DARK]: {
    name: "Dark Baby",
    description: "Temporary blindness",
    sprite: "048_baby_dark.png",
    num: 110,
    class: bc.DarkBaby,
  },

  // 49
  [RandomBabyType.PICKY]: {
    name: "Picky Baby",
    description: "Starts with More Options",
    sprite: "049_baby_picky.png",
    item: CollectibleType.MORE_OPTIONS,
  },

  // 50
  [RandomBabyType.REVENGE]: {
    name: "Revenge Baby",
    description: "Spawns a random heart on hit",
    sprite: "050_baby_revenge.png",
    class: bc.RevengeBaby,
  },

  // 51
  [RandomBabyType.BELIAL]: {
    name: "Belial Baby",
    description: "Starts with Azazel-style Brimstone + flight",
    sprite: "051_baby_belial.png",
    item: CollectibleType.BRIMSTONE,
    flight: true,
    requireTears: true,
    class: bc.BelialBaby,
  },

  // 52
  [RandomBabyType.SALE]: {
    name: "Sale Baby",
    description: "Starts with Steam Sale",
    sprite: "052_baby_sale.png",
    item: CollectibleType.STEAM_SALE,
  },

  // 53
  [RandomBabyType.GOAT_HEAD]: {
    name: "Goat Head Baby",
    description: "Starts with Goat Head",
    sprite: "053_baby_goatbaby.png",
    item: CollectibleType.GOAT_HEAD,
  },

  // 54
  [RandomBabyType.SUPER_GREED]: {
    name: "Super Greed Baby",
    description: "Midas tears",
    sprite: "054_baby_super greedbaby.png",
    requireTears: true,
    class: bc.SuperGreedBaby,
  },

  // 55
  [RandomBabyType.MORT]: {
    name: "Mort Baby",
    description: "Guppy tears",
    sprite: "055_baby_mort.png",
    requireTears: true,
    class: bc.MortBaby,
  },

  // 56
  [RandomBabyType.APOLLYON]: {
    name: "Apollyon Baby",
    description: "Black rune effect on hit",
    sprite: "056_baby_apollyon.png",
    class: bc.ApollyonBaby,
  },

  // 57
  [RandomBabyType.BONE]: {
    // The achievement is called "Bone Baby" while the sprite filename is called "baby_boner".
    name: "Bone Baby",
    description: "Starts with Brittle Bones",
    sprite: "057_baby_boner.png",
    item: CollectibleType.BRITTLE_BONES,
  },

  // 58
  [RandomBabyType.BOUND]: {
    name: "Bound Baby",
    description: "Monster Manual effect every 7 seconds",
    sprite: "058_baby_bound.png",
    num: 7,
    class: bc.BoundBaby,
  },

  // 59
  [RandomBabyType.BIG_EYES]: {
    name: "Big Eyes Baby",
    description: "Tears cause self-knockback",
    sprite: "059_baby_bigeyes.png",
    requireTears: true,
    class: bc.BigEyesBaby,
  },

  // 60
  [RandomBabyType.SLEEP]: {
    name: "Sleep Baby",
    description: "Starts with Broken Modem",
    sprite: "060_baby_sleep.png",
    item: CollectibleType.BROKEN_MODEM,
  },

  // 61
  [RandomBabyType.ZOMBIE]: {
    name: "Zombie Baby",
    description: "Brings back enemies from the dead",
    sprite: "061_baby_zombie.png",
    class: bc.ZombieBaby,
  },

  // 62
  [RandomBabyType.GOAT]: {
    name: "Goat Baby",
    description: "Guaranteed Devil Room + Angel Room after 6 hits",
    sprite: "062_baby_goat.png",
    requireNumHits: 6,
    class: bc.GoatBaby,
  },

  // 63
  [RandomBabyType.BUTTHOLE]: {
    name: "Butthole Baby",
    description: "Spawns a random poop every 5 seconds",
    sprite: "063_baby_butthole.png",
    num: 5,
    class: bc.ButtholeBaby,
  },

  // 64
  [RandomBabyType.EYE_PATCH]: {
    name: "Eye Patch Baby",
    description: "Starts with Callus + makes spikes",
    sprite: "064_baby_eyepatch.png",
    trinket: TrinketType.CALLUS,
    class: bc.EyePatchBaby,
  },

  // 65
  [RandomBabyType.BLOOD_EYES]: {
    name: "Blood Eyes Baby",
    description: "Starts with Haemolacria",
    sprite: "065_baby_bloodeyes.png",
    item: CollectibleType.HAEMOLACRIA,
  },

  // 66
  [RandomBabyType.MUSTACHE]: {
    name: "Mustache Baby",
    description: "Boomerang tears",
    sprite: "066_baby_mustache.png",
    requireTears: true,
    softlockPreventionDestroyPoops: true, // Boomerangs cannot kill poops
    class: bc.MustacheBaby,
  },

  // 67
  [RandomBabyType.SPITTLE]: {
    name: "Spittle Baby",
    description: "Starts with Dead Onion",
    sprite: "067_baby_spittle.png",
    item: CollectibleType.DEAD_ONION,
  },

  // 68
  [RandomBabyType.BRIAN]: {
    name: "Brain Baby",
    description: "Starts with The Mind",
    sprite: "068_baby_brain.png",
    item: CollectibleType.MIND,
  },

  // 69
  [RandomBabyType.THREE_EYES]: {
    name: "3 Eyes Baby",
    description: "Starts with The Inner Eye",
    sprite: "069_baby_threeeyes.png",
    item: CollectibleType.INNER_EYE,
  },

  // 70
  [RandomBabyType.VIRIDIAN]: {
    name: "Viridian Baby",
    description: "Starts with How to Jump",
    sprite: "070_baby_viridian.png",
    item: CollectibleType.HOW_TO_JUMP,
  },

  // 71
  [RandomBabyType.BLOCKHEAD]: {
    name: "Blockhead Baby",
    description: "Starts with Dr. Fetus + Soy Milk + explosion immunity",
    sprite: "071_baby_blockhead.png",
    item: CollectibleType.DR_FETUS,
    item2: CollectibleType.SOY_MILK,
    explosionImmunity: true,
  },

  // 72
  [RandomBabyType.WORM]: {
    name: "Worm Baby",
    description: "Starts with 5x Little Chubby",
    sprite: "072_baby_worm.png",
    item: CollectibleType.LITTLE_CHUBBY,
    itemNum: 5,
  },

  // 73
  [RandomBabyType.LOWFACE]: {
    name: "Lowface Baby",
    description: "0.5x range",
    sprite: "073_baby_lowface.png",
    class: bc.LowfaceBaby,
  },

  // 74
  [RandomBabyType.ALIEN_HOMINID]: {
    name: "Alien Hominid Baby",
    description: "Beam sword tears",
    sprite: "074_baby_alienhominid.png",
    requireTears: true,
    class: bc.AlienHominidBaby,
  },

  // 75
  [RandomBabyType.BOMB]: {
    name: "Bomb Baby",
    description: "50% chance for bombs to have the D6 effect",
    sprite: "075_baby_bomb.png",
    requireBombs: true,
    class: bc.BombBaby,
  },

  // 76
  [RandomBabyType.VIDEO]: {
    name: "Video Baby",
    description: "Starts with Tech X",
    sprite: "076_baby_video.png",
    item: CollectibleType.TECH_X,
  },

  // 77
  [RandomBabyType.PARASITE]: {
    name: "Parasite Baby",
    description: "Starts with The Parasite",
    sprite: "077_baby_parasite.png",
    item: CollectibleType.PARASITE,
  },

  // 78
  [RandomBabyType.DERP]: {
    name: "Derp Baby",
    description: "Starts with Cube of Meat + BFFS + 0.5x damage",
    sprite: "078_baby_derp.png",
    item: CollectibleType.CUBE_OF_MEAT,
    item2: CollectibleType.BFFS,
    class: bc.DerpBaby,
  },

  // 79
  [RandomBabyType.LOBOTOMY]: {
    name: "Lobotomy Baby",
    description: "Starts with Delirious",
    sprite: "079_baby_lobotomy.png",
    item: CollectibleType.DELIRIOUS,
  },

  // 80
  [RandomBabyType.CHOKE]: {
    name: "Choke Baby",
    description: "Summons random portals",
    sprite: "080_baby_choke.png",
    num: 2, // Seconds between portals changing.
    class: bc.ChokeBaby,
  },

  // 81
  [RandomBabyType.SCREAM]: {
    name: "Scream Baby",
    description: "Shoop tears",
    sprite: "081_baby_scream.png",
    requireTears: true,
    class: bc.ScreamBaby,
  },

  // 82
  [RandomBabyType.GURDY]: {
    name: "Gurdy Baby",
    description: "Starts with 20x Lil Gurdy",
    sprite: "082_baby_gurdy.png",
    item: CollectibleType.LIL_GURDY,
    itemNum: 20,
    class: bc.GurdyBaby,
  },

  // 83
  [RandomBabyType.GHOUL]: {
    name: "Ghoul Baby",
    description: "Book of Secrets effect on hit",
    sprite: "083_baby_ghoul.png",
    class: bc.GhoulBaby,
  },

  // 84
  [RandomBabyType.GOATEE]: {
    name: "Goatee Baby",
    description: "Starts with Death's Touch and Lachryphagy",
    sprite: "084_baby_goatee.png",
    item: CollectibleType.DEATHS_TOUCH,
    item2: CollectibleType.LACHRYPHAGY,
    requireTears: true,
  },

  // 85
  [RandomBabyType.SHADES]: {
    name: "Shades Baby",
    description: "Starts with X-Ray Vision",
    sprite: "085_baby_shades.png",
    item: CollectibleType.XRAY_VISION,
  },

  // 86
  [RandomBabyType.STATUE]: {
    name: "Statue Baby",
    description: "Starts with Duality",
    sprite: "086_baby_statue.png",
    item: CollectibleType.DUALITY,
  },

  // 87
  [RandomBabyType.BLOODSUCKER]: {
    name: "Bloodsucker Baby",
    description: "Starts with 3x Lil Delirium",
    sprite: "087_baby_bloodsucker.png",
    item: CollectibleType.LIL_DELIRIUM,
    itemNum: 3,
  },

  // 88
  [RandomBabyType.BANDAID]: {
    name: "Bandaid Baby",
    description: "50% chance to spawn a random pedestal item on room clear",
    sprite: "088_baby_bandaid.png",
    class: bc.BandaidBaby,
  },

  // 89
  [RandomBabyType.EYEBROWS]: {
    name: "Eyebrows Baby",
    description: "Starts with Guppy's Hair Ball",
    sprite: "089_baby_eyebrows.png",
    item: CollectibleType.GUPPYS_HAIRBALL,
  },

  // 90
  [RandomBabyType.NERD]: {
    name: "Nerd Baby",
    description: "Locked doors in uncleared rooms",
    sprite: "090_baby_nerd.png",
    requireKeys: true,
    class: bc.NerdBaby,
  },

  // 91
  [RandomBabyType.BOSS]: {
    name: "Boss Baby",
    description: "Starts with There's Options",
    sprite: "091_baby_boss.png",
    item: CollectibleType.THERES_OPTIONS,
  },

  // 92
  [RandomBabyType.TURD]: {
    name: "Turd Baby",
    description: "Enemies fart on death",
    sprite: "092_baby_turd.png",
    class: bc.TurdBaby,
  },

  // 93
  [RandomBabyType.O]: {
    name: "O Baby",
    description: "Starts with Tiny Planet",
    sprite: "093_baby_o.png",
    item: CollectibleType.TINY_PLANET,
  },

  // 94
  [RandomBabyType.SQUARE_EYES]: {
    name: "Square Eyes Baby",
    description: "Square tears",
    sprite: "094_baby_squareeyes.png",
    requireTears: true,
    class: bc.SquareEyesBaby,
  },

  // 95
  [RandomBabyType.TEETH]: {
    name: "Teeth Baby",
    description: "Starts with Lemegeton",
    sprite: "095_baby_teeth.png",
    item: CollectibleType.LEMEGETON,
  },

  // 96
  [RandomBabyType.FROWN]: {
    name: "Frown Baby",
    description: "Summons Best Friend every 5 seconds",
    sprite: "096_baby_frown.png",
    num: 5,
    class: bc.FrownBaby,
  },

  // 97
  [RandomBabyType.TONGUE]: {
    name: "Tongue Baby",
    description: "Recharge bombs",
    sprite: "097_baby_tongue.png",
    requireBombs: true,
    class: bc.TongueBaby,
  },

  // 98
  [RandomBabyType.HALF_HEAD]: {
    name: "Half Head Baby",
    description: "Takes 2x damage",
    sprite: "098_baby_halfhead.png",
    class: bc.HalfHeadBaby,
  },

  // 99
  [RandomBabyType.MAKEUP]: {
    name: "Makeup Baby",
    description: "7-shot",
    sprite: "099_baby_makeup.png",
    item: CollectibleType.WIZ,
    itemNum: 6,
    requireTears: true,
  },

  // 100
  [RandomBabyType.ED]: {
    name: "Ed Baby",
    description: "Fire trail tears",
    sprite: "100_baby_ed.png",
    requireTears: true,
    class: bc.EdBaby,
  },

  // 101
  [RandomBabyType.D]: {
    name: "D Baby",
    description: "Spawns creep on hit (improved)",
    sprite: "101_baby_d.png",
    class: bc.DBaby,
  },

  // 102
  [RandomBabyType.GUPPY]: {
    name: "Guppy Baby",
    description: "Starts with Guppy's Head",
    sprite: "102_baby_guppy.png",
    item: CollectibleType.GUPPYS_HEAD,
  },

  // 103
  [RandomBabyType.PUKE]: {
    name: "Puke Baby",
    description: "Starts with Ipecac",
    sprite: "103_baby_puke.png",
    item: CollectibleType.IPECAC,
  },

  // 104
  [RandomBabyType.DUMB]: {
    name: "Dumb Baby",
    description: "Starts with No. 2",
    sprite: "104_baby_dumb.png",
    item: CollectibleType.NUMBER_TWO,
  },

  // 105
  [RandomBabyType.LIPSTICK]: {
    name: "Lipstick Baby",
    description: "2x range",
    sprite: "105_baby_lipstick.png",
    class: bc.LipstickBaby,
  },

  // 106
  [RandomBabyType.AETHER]: {
    name: "Aether Baby",
    description: "All direction tears",
    sprite: "106_baby_aether.png",
    requireTears: true,
    class: bc.AetherBaby,
  },

  // 107
  [RandomBabyType.BROWNIE]: {
    name: "Brownie Baby",
    description: "Starts with Level 4 Meatboy + Level 4 Meatgirl",
    sprite: "107_baby_brownie.png",
    num: 4,
    class: bc.BrownieBaby,
  },

  // 108
  [RandomBabyType.VVVVVV]: {
    name: "VVVVVV Baby",
    description: "Starts with Anti-Gravity",
    sprite: "108_baby_vvvvvv.png",
    item: CollectibleType.ANTI_GRAVITY,
  },

  // 109
  [RandomBabyType.NOSFERATU]: {
    name: "Nosferatu Baby",
    description: "Enemies have homing projectiles",
    sprite: "109_baby_nosferatu.png",
    class: bc.NosferatuBaby,
  },

  // 110
  [RandomBabyType.PUBIC]: {
    name: "Pubic Baby",
    description: "Must full clear",
    sprite: "110_baby_pubic.png",
    class: bc.PubicBaby,
  },

  // 111
  [RandomBabyType.EYEMOUTH]: {
    name: "Eyemouth Baby",
    description: "Shoots an extra tear every 3rd shot",
    sprite: "111_baby_eyemouth.png",
    requireTears: true,
    class: bc.EyemouthBaby,
  },

  // 112
  [RandomBabyType.WEIRDO]: {
    name: "Weirdo Baby",
    description: "Starts with The Ludovico Technique",
    sprite: "112_baby_weirdo.png",
    item: CollectibleType.LUDOVICO_TECHNIQUE,
  },

  // 113
  [RandomBabyType.V]: {
    name: "V Baby",
    description: "Electric ring tears",
    sprite: "113_baby_v.png",
    requireTears: true,
    class: bc.VBaby,
  },

  // 114
  [RandomBabyType.STRANGE_MOUTH]: {
    name: "Strange Mouth Baby",
    description: "Wiggle tears",
    sprite: "114_baby_strangemouth.png",
    requireTears: true,
    class: bc.StrangeMouthBaby,
  },

  // 115
  [RandomBabyType.MASKED]: {
    name: "Masked Baby",
    description: "Can't shoot while moving",
    sprite: "115_baby_masked.png",
    requireTears: true,
    class: bc.MaskedBaby,
  },

  // 116
  [RandomBabyType.CYBER]: {
    name: "Cyber Baby",
    description: "Spawns a random pickup on hit",
    sprite: "116_baby_cyber.png",
    class: bc.CyberBaby,
  },

  // 117
  [RandomBabyType.AXE_WOUND]: {
    name: "Axe Wound Baby",
    description: "Starts with Sacrificial Dagger + flight",
    description2: "+ explosion immunity + blindfolded",
    sprite: "117_baby_axewound.png",
    item: CollectibleType.SACRIFICIAL_DAGGER,
    flight: true,
    explosionImmunity: true,
    blindfolded: true,
  },

  // 118
  [RandomBabyType.STATUE_2]: {
    name: "Statue Baby 2",
    description: "Improved Secret Rooms",
    sprite: "118_baby_statue.png",
    num: 4, // Number of collectibles
    class: bc.StatueBaby2,
  },

  // 119
  [RandomBabyType.GRIN]: {
    name: "Grin Baby",
    description: "Starts with Godhead",
    sprite: "119_baby_grin.png",
    item: CollectibleType.GODHEAD,
  },

  // 120
  [RandomBabyType.UPSET]: {
    name: "Upset Baby",
    description: "Starts with Sad Bombs",
    sprite: "120_baby_upset.png",
    item: CollectibleType.SAD_BOMBS,
    requireBombs: true,
  },

  // 121
  [RandomBabyType.PLASTIC]: {
    name: "Plastic Baby",
    description: "Starts with Rubber Cement",
    sprite: "121_baby_plastic.png",
    item: CollectibleType.RUBBER_CEMENT,
    requireTears: true,
  },

  // 122
  [RandomBabyType.MONOCHROME]: {
    name: "Monochrome Baby",
    description: "Starts with Dead Eye",
    sprite: "122_baby_monochrome.png",
    item: CollectibleType.DEAD_EYE,
  },

  // 123
  [RandomBabyType.ONE_TOOTH]: {
    name: "One Tooth Baby",
    description: "Spawn a Bishop on hit",
    sprite: "123_baby_onetooth.png",
    class: bc.OneToothBaby,
  },

  // 124
  [RandomBabyType.TUSKS]: {
    name: "Tusks Baby",
    description: "2x damage",
    sprite: "124_baby_tusks.png",
    class: bc.TusksBaby,
  },

  // 125
  [RandomBabyType.HOPELESS]: {
    name: "Hopeless Baby",
    description: "+2 keys + keys are hearts",
    sprite: "125_baby_hopeless.png",
    class: bc.HopelessBaby,
  },

  // 126
  [RandomBabyType.BIG_MOUTH]: {
    name: "Big Mouth Baby",
    description: "Starts with 10x Jaw Bone",
    sprite: "126_baby_bigmouth.png",
    item: CollectibleType.JAW_BONE,
    itemNum: 10,
  },

  // 127
  [RandomBabyType.PEE_EYES]: {
    name: "Pee Eyes Baby",
    description: "Starts with Number One",
    sprite: "127_baby_peeeyes.png",
    item: CollectibleType.NUMBER_ONE,
  },

  // 128
  [RandomBabyType.EARWIG]: {
    name: "Earwig Baby",
    description: "3 rooms are already explored",
    sprite: "128_baby_earwig.png",
    num: 3, // The amount of rooms explored.
    class: bc.EarwigBaby,
  },

  // 129
  [RandomBabyType.NINKUMPOOP]: {
    name: "Ninkumpoop Baby",
    description: "All chests are Old Chests",
    sprite: "129_baby_ninkumpoop.png",
    requireTears: true,
    class: bc.NinkumpoopBaby,
  },

  // 130
  [RandomBabyType.STRANGE_SHAPE]: {
    name: "Strange Shape Baby",
    description: "Pulsing tears",
    sprite: "130_baby_strangeshape.png",
    requireTears: true,
    class: bc.StrangeShapeBaby,
  },

  // 131
  [RandomBabyType.BUGEYED]: {
    name: "Bugeyed Baby",
    description: "Pickups turn into Blue Spiders",
    sprite: "131_baby_bugeyed.png",
    class: bc.BugeyedBaby,
  },

  // 132
  [RandomBabyType.FREAKY]: {
    name: "Freaky Baby",
    description: "Converter effect on hit",
    sprite: "132_baby_freaky.png",
    class: bc.FreakyBaby,
  },

  // 133
  [RandomBabyType.CROOKED]: {
    name: "Crooked Baby",
    description: "Left angled tears",
    sprite: "133_baby_crooked.png",
    requireTears: true,
    class: bc.CrookedBaby,
  },

  // 134
  [RandomBabyType.SPIDER_LEGS]: {
    name: "Spider Legs Baby",
    description: "Starts with 15x Sissy Longlegs",
    sprite: "134_baby_spiderlegs.png",
    item: CollectibleType.SISSY_LONGLEGS,
    itemNum: 15,
  },

  // 135
  [RandomBabyType.SMILING]: {
    name: "Smiling Baby",
    description: "Starts with Sacred Heart",
    sprite: "135_baby_smiling.png",
    item: CollectibleType.SACRED_HEART,
  },

  // 136
  [RandomBabyType.TEARS]: {
    name: "Tears Baby",
    description: "Starts with the Paschal Candle",
    sprite: "136_baby_tears.png",
    item: CollectibleType.PASCHAL_CANDLE,
  },

  // 137
  [RandomBabyType.BOWLING]: {
    name: "Bowling Baby",
    description: "Starts with Flat Stone",
    sprite: "137_baby_bowling.png",
    item: CollectibleType.FLAT_STONE,
    requireTears: true,
  },

  // 138
  [RandomBabyType.MOHAWK]: {
    name: "Mohawk Baby",
    description: "+2 bombs + bombs are hearts",
    sprite: "138_baby_mohawk.png",
    class: bc.MohawkBaby,
  },

  // 139
  [RandomBabyType.ROTTEN_MEAT]: {
    name: "Rotten Meat Baby",
    description: "Teleport to starting room on hit",
    sprite: "139_baby_rottenmeat.png",
    class: bc.RottenMeatBaby,
  },

  // 140
  [RandomBabyType.NO_ARMS]: {
    name: "No Arms Baby",
    description: "Pickups are bouncy",
    sprite: "140_baby_noarms.png",
    class: bc.NoArmsBaby,
  },

  // 141
  [RandomBabyType.TWIN]: {
    name: "Twin Baby",
    description: "Uncontrollable Teleport 2.0",
    sprite: "141_baby_twin2.png",
    class: bc.TwinBaby,
  },

  // 142
  [RandomBabyType.UGLY_GIRL]: {
    name: "Ugly Girl Baby",
    description: "Starts with Ipecac + Dr. Fetus",
    sprite: "142_baby_uglygirl.png",
    item: CollectibleType.IPECAC,
    item2: CollectibleType.DR_FETUS,
  },

  // 143
  [RandomBabyType.CHOMPERS]: {
    name: "Chompers Baby",
    description: "Everything is Red Poop",
    sprite: "143_baby_chompers.png",
    class: bc.ChompersBaby,
  },

  // 144
  [RandomBabyType.CAMILLO_JR]: {
    name: "Camillo Jr. Baby",
    description: "Starts with Tech.5",
    sprite: "144_baby_camillojr.png",
    item: CollectibleType.TECH_5,
  },

  // 145
  [RandomBabyType.EYELESS]: {
    name: "Eyeless Baby",
    description: "Starts with 20x The Peeper",
    sprite: "145_baby_eyeless.png",
    item: CollectibleType.PEEPER,
    itemNum: 20,
  },

  // 146
  [RandomBabyType.SLOPPY]: {
    name: "Sloppy Baby",
    description: "Starts with Epic Fetus (improved)",
    sprite: "146_baby_sloppy.png",
    item: CollectibleType.EPIC_FETUS,
    class: bc.SloppyBaby,
  },

  // 147
  [RandomBabyType.BLUEBIRD]: {
    name: "Bluebird Baby",
    description: "Touching items/pickups causes paralysis",
    sprite: "147_baby_bluebird.png",
    class: bc.BluebirdBaby,
  },

  // 148
  [RandomBabyType.FAT]: {
    name: "Fat Baby",
    description: "Necronomicon effect on hit",
    sprite: "148_baby_fat.png",
    class: bc.FatBaby,
  },

  // 149
  [RandomBabyType.BUTTERFLY]: {
    name: "Butterfly Baby",
    description: "Improved Super Secret Rooms",
    sprite: "149_baby_butterfly.png",
    num: 4, // Number of collectibles
    class: bc.ButterflyBaby,
  },

  // 150
  [RandomBabyType.GOGGLES]: {
    name: "Goggles Baby",
    description: "Starts with 20/20",
    sprite: "150_baby_goggles.png",
    item: CollectibleType.TWENTY_TWENTY,
  },

  // 151
  [RandomBabyType.APATHETIC]: {
    name: "Apathetic Baby",
    description: "Starts with Diplopia",
    sprite: "151_baby_apathetic.png",
    item: CollectibleType.DIPLOPIA,
  },

  // 152
  [RandomBabyType.CAPE]: {
    name: "Cape Baby",
    description: "Spray tears",
    sprite: "152_baby_cape.png",
    requireTears: true,
    class: bc.CapeBaby,
  },

  // 153
  [RandomBabyType.SORROW]: {
    name: "Sorrow Baby",
    description: "Projectiles are reflected as bombs",
    sprite: "153_baby_sorrow.png",
    num: 50,
    class: bc.SorrowBaby,
  },

  // 154
  [RandomBabyType.RICTUS]: {
    name: "Rictus Baby",
    description: "Scared pickups",
    sprite: "154_baby_rictus.png",
    class: bc.RictusBaby,
  },

  // 155
  [RandomBabyType.AWAKEN]: {
    name: "Awaken Baby",
    description: "Constant Telekinesis effect",
    sprite: "155_baby_awaken.png",
    class: bc.AwakenBaby,
  },

  // 156
  [RandomBabyType.PUFF]: {
    name: "Puff Baby",
    description: "Mega Bean effect every 5 seconds",
    sprite: "156_baby_puff.png",
    num: 5,
    class: bc.PuffBaby,
  },

  // 157
  [RandomBabyType.ATTRACTIVE]: {
    name: "Attractive Baby",
    description: "All enemies are permanently charmed",
    sprite: "157_baby_attractive.png",
    seed: SeedEffect.ALWAYS_CHARMED,
    class: bc.AttractiveBaby,
  },

  // 158
  [RandomBabyType.PRETTY]: {
    name: "Pretty Baby",
    description: "All special rooms are Angel shops",
    sprite: "158_baby_pretty.png",
    class: bc.PrettyBaby,
  },

  // 159
  [RandomBabyType.CRACKED_INFAMY]: {
    name: "Cracked Infamy Baby",
    description: "Starts with Dr. Fetus + Remote Detonator",
    sprite: "159_baby_crackedinfamy.png",
    item: CollectibleType.REMOTE_DETONATOR,
    item2: CollectibleType.DR_FETUS,
    requireTears: true,
  },

  // 160
  [RandomBabyType.DISTENDED]: {
    name: "Distended Baby",
    description: "Starts with Contagion",
    sprite: "160_baby_distended.png",
    item: CollectibleType.CONTAGION,
  },

  // 161
  [RandomBabyType.MEAN]: {
    name: "Mean Baby",
    description: "Starts with Epic Fetus",
    sprite: "161_baby_mean.png",
    item: CollectibleType.EPIC_FETUS,
  },

  // 162
  [RandomBabyType.DIGITAL]: {
    name: "Digital Baby",
    description: "B00B T00B",
    sprite: "162_baby_digital.png",
    // This baby grants SeedEffect.OLD_TV. However, applying this in the `POST_NEW_LEVEL` callback
    // can cause game crashes. Instead, we manually apply it in the `POST_UPDATE` callback.
    class: bc.DigitalBaby,
  },

  // 163
  [RandomBabyType.HELMET]: {
    name: "Helmet Baby",
    description: "Invulnerability when standing still",
    sprite: "163_baby_helmet.png",
    class: bc.HelmetBaby,
  },

  // 164
  [RandomBabyType.BLACK_EYE]: {
    name: "Black Eye Baby",
    description: "Starts with Leprosy, +5 damage on Leprosy breaking",
    sprite: "164_baby_blackeye.png",
    item: CollectibleType.LEPROSY,
    num: 5,
    class: bc.BlackEyeBaby,
  },

  // 165
  [RandomBabyType.LIGHTS]: {
    name: "Lights Baby",
    description: "Holy tears",
    sprite: "165_baby_lights.png",
    num: 3,
    requireTears: true,
    class: bc.LightsBaby,
  },

  // 166
  [RandomBabyType.SPIKE]: {
    name: "Spike Baby",
    description: "All chests are Mimics + all chests have items",
    sprite: "166_baby_spike.png",
    class: bc.SpikeBaby,
  },

  // 167
  [RandomBabyType.WORRY]: {
    name: "Worry Baby",
    description: "Touching items/pickups causes teleportation",
    sprite: "167_baby_worry.png",
    class: bc.WorryBaby,
  },

  // 168
  [RandomBabyType.EARS]: {
    name: "Ears Baby",
    description: "Starts with 3x Mystery Sack",
    sprite: "168_baby_ears.png",
    item: CollectibleType.MYSTERY_SACK,
    itemNum: 3,
  },

  // 169
  [RandomBabyType.FUNERAL]: {
    name: "Funeral Baby",
    description: "Starts with Death's Touch",
    sprite: "169_baby_funeral.png",
    item: CollectibleType.DEATHS_TOUCH,
  },

  // 170
  [RandomBabyType.LIBRA]: {
    name: "Libra Baby",
    description: "32 seconds of invulnerability on hit",
    sprite: "170_baby_libra.png",
    trinket: TrinketType.BLIND_RAGE,
    // 60 frames is the normal amount of invulnerability frames. Each trinket doubles it. Thus, 4
    // trinkets gives 960 invulnerability frames (32 seconds).
    num: 4,
  },

  // 171
  [RandomBabyType.GAPPY]: {
    name: "Gappy Baby",
    description: "Destroying machines gives items",
    sprite: "171_baby_gappy.png",
    class: bc.GappyBaby,
  },

  // 172
  [RandomBabyType.SUNBURN]: {
    name: "Sunburn Baby",
    description: "Starts with Ghost Pepper",
    sprite: "172_baby_sunburn.png",
    item: CollectibleType.GHOST_PEPPER,
  },

  // 173
  [RandomBabyType.ATE_POOP]: {
    name: "Ate Poop Baby",
    description: "Destroying poops spawns random pickups",
    sprite: "173_baby_atepoop.png",
    class: bc.AtePoopBaby,
  },

  // 174
  [RandomBabyType.ELECTRIC]: {
    name: "Electric Baby",
    description: "Starts with Jacob's Ladder",
    sprite: "174_baby_electris.png",
    item: CollectibleType.JACOBS_LADDER,
    requireTears: true,
  },

  // 175
  [RandomBabyType.BLOOD_HOLE]: {
    name: "Blood Hole Baby",
    description: "Starts with Proptosis",
    sprite: "175_baby_bloodhole.png",
    item: CollectibleType.PROPTOSIS,
  },

  // 176
  [RandomBabyType.TRANSFORMING]: {
    name: "Transforming Baby",
    description: "Starts with Technology Zero",
    sprite: "176_baby_transforming.png",
    item: CollectibleType.TECHNOLOGY_ZERO,
    requireTears: true,
  },

  // 177
  [RandomBabyType.ABAN]: {
    name: "Aban Baby",
    description: "+2 coins + Sonic-style health",
    sprite: "177_baby_aban.png",
    class: bc.AbanBaby,
  },

  // 178
  [RandomBabyType.BANDAGE_GIRL]: {
    name: "Bandage Girl Baby",
    description: "Starts with Cube of Meat + Ball of Bandages",
    sprite: "178_baby_bandagegirl.png",
    item: CollectibleType.CUBE_OF_MEAT,
    item2: CollectibleType.BALL_OF_BANDAGES,
  },

  // 179
  [RandomBabyType.PIECE_A]: {
    name: "Piece A Baby",
    description: "Can only move up + down + left + right",
    sprite: "179_baby_piecea.png",
    class: bc.PieceABaby,
  },

  // 180
  [RandomBabyType.PIECE_B]: {
    name: "Piece B Baby",
    description: "Starts with Charging Station",
    sprite: "180_baby_pieceb.png",
    item: CollectibleTypeCustom.CHARGING_STATION,
    requireCoins: true,
    class: bc.PieceBBaby,
  },

  // 181
  [RandomBabyType.SPELUNKER]: {
    name: "Spelunker Baby",
    description: "Starts with Stud Finder; Crawlspace --> Black Market",
    sprite: "181_baby_spelunker.png",
    trinket: TrinketType.STUD_FINDER,
    class: bc.SpelunkerBaby,
  },

  // 182
  [RandomBabyType.FROG]: {
    name: "Frog Baby",
    description: "Starts with Scorpio",
    sprite: "182_baby_frog.png",
    item: CollectibleType.SCORPIO,
  },

  // 183
  [RandomBabyType.CROOK]: {
    name: "Crook Baby",
    description: "Starts with Mr. ME",
    sprite: "183_baby_crook.png",
    item: CollectibleType.MR_ME,
  },

  // 184
  [RandomBabyType.DON]: {
    name: "Don Baby",
    description: "Starts with Bob's Brain",
    sprite: "184_baby_don.png",
    item: CollectibleType.BOBS_BRAIN,
  },

  // 185
  [RandomBabyType.WEB]: {
    name: "Web Baby",
    description: "Slowing tears",
    sprite: "185_baby_web.png",
    requireTears: true,
    class: bc.WebBaby,
  },

  // 186
  [RandomBabyType.FADED]: {
    name: "Faded Baby",
    description: "Random teleport on hit",
    sprite: "186_baby_faded.png",
    class: bc.FadedBaby,
  },

  // 187
  [RandomBabyType.SICK]: {
    name: "Sick Baby",
    description: "Shoots explosive flies + flight",
    sprite: "187_baby_sick.png",
    flight: true,
    requireTears: true,
    class: bc.SickBaby,
  },

  // 188
  [RandomBabyType.DR_FETUS]: {
    name: "Dr. Fetus Baby",
    description: "Starts with Dr. Fetus",
    sprite: "188_baby_drfetus.png",
    item: CollectibleType.DR_FETUS,
  },

  // 189
  [RandomBabyType.SPECTRAL]: {
    name: "Spectral Baby",
    description: "Starts with Ouija Board",
    sprite: "189_baby_spectral.png",
    item: CollectibleType.OUIJA_BOARD,
    requireTears: true,
  },

  // 190
  [RandomBabyType.RED_SKELETON]: {
    name: "Red Skeleton Baby",
    description: "Starts with 3x Slipped Rib",
    sprite: "190_baby_redskeleton.png",
    item: CollectibleType.SLIPPED_RIB,
    itemNum: 3,
  },

  // 191
  [RandomBabyType.SKELETON]: {
    name: "Skeleton Baby",
    description: "Starts with Compound Fracture",
    sprite: "191_baby_skeleton.png",
    item: CollectibleType.COMPOUND_FRACTURE,
    requireTears: true,
  },

  // 192
  [RandomBabyType.JAMMIES]: {
    name: "Jammies Baby",
    description: "Extra charge on room clear",
    sprite: "192_baby_jammies.png",
    class: bc.JammiesBaby,
  },

  // 193
  [RandomBabyType.NEW_JAMMIES]: {
    name: "New Jammies Baby",
    description: "Starts with 5x Big Chubby",
    sprite: "193_baby_newjammies.png",
    item: CollectibleType.BIG_CHUBBY,
    itemNum: 5,
  },

  // 194
  [RandomBabyType.COLD]: {
    name: "Cold Baby",
    description: "Freeze tears",
    sprite: "194_baby_cold.png",
    requireTears: true,
    class: bc.ColdBaby,
  },

  // 195
  [RandomBabyType.OLD_MAN]: {
    name: "Old Man Baby",
    description: "Starts with Dad's Key",
    sprite: "195_baby_oldman.png",
    item: CollectibleType.DADS_KEY,
  },

  // 196
  [RandomBabyType.SPOOKED]: {
    name: "Spooked Baby",
    description: "All enemies are permanently feared",
    sprite: "196_baby_spooked.png",
    seed: SeedEffect.ALWAYS_AFRAID,
  },

  // 197
  [RandomBabyType.NICE]: {
    name: "Nice Baby",
    description: "Brimstone tears",
    sprite: "197_baby_nice.png",
    requireTears: true,
    class: bc.NiceBaby,
  },

  // 198
  [RandomBabyType.DOTS]: {
    name: "Dots Baby",
    description: "Starts with Cricket's Body",
    sprite: "198_baby_dots.png",
    item: CollectibleType.CRICKETS_BODY,
    requireTears: true,
  },

  // 199
  [RandomBabyType.PEELING]: {
    name: "Peeling Baby",
    description: "Starts with Potato Peeler",
    sprite: "199_baby_peeling.png",
    item: CollectibleType.POTATO_PEELER,
  },

  // 200
  [RandomBabyType.SMALL_FACE]: {
    name: "Small Face Baby",
    description: "My Little Unicorn effect on hit",
    sprite: "200_baby_smallface.png",
    class: bc.SmallFaceBaby,
  },

  // 201
  [RandomBabyType.GOOD]: {
    name: "Good Baby",
    description: "Starts with 15x Seraphim",
    sprite: "201_baby_good.png",
    item: CollectibleType.SERAPHIM,
    itemNum: 15,
  },

  // 202
  [RandomBabyType.BLINDFOLD]: {
    name: "Blindfold Baby",
    description: "Starts with Incubus + blindfolded",
    sprite: "202_baby_blindfold.png",
    item: CollectibleType.INCUBUS,
    blindfolded: true,
    class: bc.BlindfoldBaby,
  },

  // 203
  [RandomBabyType.PIPE]: {
    name: "Pipe Baby",
    description: "Starts with Tractor Beam",
    sprite: "203_baby_pipe.png",
    item: CollectibleType.TRACTOR_BEAM,
    requireTears: true,
  },

  // 204
  [RandomBabyType.DENTED]: {
    name: "Dented Baby",
    description: "Spawns a random key on hit",
    sprite: "204_baby_dented.png",
    class: bc.DentedBaby,
  },

  // 205
  [RandomBabyType.STEVEN]: {
    name: "Steven Baby",
    description: "Starts with 20x Little Steven",
    sprite: "205_baby_steven.png",
    item: CollectibleType.LITTLE_STEVEN,
    itemNum: 20,
  },

  // 206
  [RandomBabyType.MONOCLE]: {
    name: "Monocle Baby",
    description: "3x tear size",
    sprite: "206_baby_monocle.png",
    requireTears: true,
    num: 3,
    class: bc.MonocleBaby,
  },

  // 207
  [RandomBabyType.BELIAL_2]: {
    name: "Belial Baby 2",
    description: "Starts with Eye of Belial",
    sprite: "207_baby_belial.png",
    item: CollectibleType.EYE_OF_BELIAL,
    requireTears: true,
  },

  // 208
  [RandomBabyType.MONSTRO]: {
    name: "Monstro Baby",
    description: "Starts with 5x Lil Monstro",
    sprite: "208_baby_monstro.png",
    item: CollectibleType.LIL_MONSTRO,
    itemNum: 5,
  },

  // 209
  [RandomBabyType.FEZ]: {
    name: "Fez Baby",
    description: "Starts with The Book of Belial",
    sprite: "209_baby_fez.png",
    item: CollectibleType.BOOK_OF_BELIAL,
  },

  // 210
  [RandomBabyType.MEAT_BOY]: {
    name: "Meat Boy Baby",
    description: "Potato Peeler effect on hit",
    sprite: "210_baby_meatboy.png",
    class: bc.MeatBoyBaby,
  },

  // 211
  [RandomBabyType.SKULL]: {
    name: "Skull Baby",
    description: "Shockwave bombs",
    sprite: "211_baby_skull.png",
    requireBombs: true,
    class: bc.SkullBaby,
  },

  // 212
  [RandomBabyType.CONJOINED]: {
    name: "Conjoined Baby",
    description: "Doors open on hit",
    sprite: "212_baby_conjoined.png",
    class: bc.ConjoinedBaby,
  },

  // 213
  [RandomBabyType.SKINNY]: {
    name: "Skinny Baby",
    description: "Super homing tears",
    sprite: "213_baby_skinny.png",
    requireTears: true,
    class: bc.SkinnyBaby,
  },

  // 214
  [RandomBabyType.BASIC_SPIDER]: {
    name: "Basic Spider Baby",
    description: "Starts with Mutant Spider",
    sprite: "214_baby_spider.png",
    item: CollectibleType.MUTANT_SPIDER,
  },

  // 215
  [RandomBabyType.SHOPKEEPER]: {
    name: "Shopkeeper Baby",
    description: "Free shop items",
    sprite: "215_baby_shopkeeper.png",
    class: bc.ShopkeeperBaby,
  },

  // 216
  [RandomBabyType.FANCY]: {
    name: "Fancy Baby",
    description: "Can purchase teleports to special rooms",
    sprite: "216_baby_fancy.png",
    class: bc.FancyBaby,
  },

  // 217
  [RandomBabyType.CHUBBY]: {
    name: "Chubby Baby",
    description: "Starts with Technology Zero + Tiny Planet",
    sprite: "217_baby_chubby.png",
    item: CollectibleType.TECHNOLOGY_ZERO,
    item2: CollectibleType.TINY_PLANET,
    requireTears: true,
  },

  // 218
  [RandomBabyType.CYCLOPS]: {
    name: "Cyclops Baby",
    description: "Starts with Polyphemus",
    sprite: "218_baby_cyclops.png",
    item: CollectibleType.POLYPHEMUS,
  },

  // 219
  [RandomBabyType.ISAAC]: {
    name: "Isaac Baby",
    description: "Starts with The Battery",
    sprite: "219_baby_isaac.png",
    item: CollectibleType.BATTERY,
    class: bc.IsaacBaby,
  },

  // 220
  [RandomBabyType.PLUG]: {
    name: "Plug Baby",
    description: "Starts with the Sharp Plug",
    sprite: "220_baby_plug.png",
    item: CollectibleType.SHARP_PLUG,
  },

  // 221
  [RandomBabyType.DROOL]: {
    name: "Drool Baby",
    description: "Starts with Monstro's Tooth (improved)",
    sprite: "221_baby_drool.png",
    item: CollectibleType.MONSTROS_TOOTH,
    num: 4, // Amount of Monstro's to summon
    class: bc.DroolBaby,
  },

  // 222
  [RandomBabyType.WINK]: {
    name: "Wink Baby",
    description: "Starts with Vanishing Twin",
    sprite: "222_baby_wink.png",
    item: CollectibleType.VANISHING_TWIN,
  },

  // 223
  [RandomBabyType.POX]: {
    name: "Pox Baby",
    description: "Starts with Toxic Shock",
    sprite: "223_baby_pox.png",
    item: CollectibleType.TOXIC_SHOCK,
  },

  // 224
  [RandomBabyType.ONION]: {
    name: "Onion Baby",
    description: "Projectiles have 2x speed",
    sprite: "224_baby_onion.png",
    class: bc.OnionBaby,
  },

  // 225
  [RandomBabyType.ZIPPER]: {
    name: "Zipper Baby",
    description: "Extra enemies spawn on hit",
    sprite: "225_baby_zipper.png",
    class: bc.ZipperBaby,
  },

  // 226
  [RandomBabyType.BUCKTEETH]: {
    name: "Buckteeth Baby",
    description: "Starts with 15x Angry Fly",
    sprite: "226_baby_buckteeth.png",
    item: CollectibleType.ANGRY_FLY,
    itemNum: 15,
  },

  // 227
  [RandomBabyType.BEARD]: {
    name: "Beard Baby",
    description: "Starts with Ocular Rift",
    sprite: "227_baby_beard.png",
    item: CollectibleType.OCULAR_RIFT,
  },

  // 228
  [RandomBabyType.HANGER]: {
    name: "Hanger Baby",
    description: "Starts with Abel; Abel's tears hurt you",
    sprite: "228_baby_hanger.png",
    item: CollectibleType.ABEL,
    class: bc.HangerBaby,
  },

  // 229
  [RandomBabyType.VAMPIRE]: {
    name: "Vampire Baby",
    description: "Starts with Contract From Below",
    sprite: "229_baby_vampire.png",
    item: CollectibleType.CONTRACT_FROM_BELOW,
  },

  // 230
  [RandomBabyType.TILT]: {
    name: "Tilt Baby",
    description: "Right angled tears",
    sprite: "230_baby_tilt.png",
    requireTears: true,
    class: bc.TiltBaby,
  },

  // 231
  [RandomBabyType.BAWL]: {
    name: "Bawl Baby",
    description: "Constant Isaac's Tears effect + blindfolded",
    sprite: "231_baby_bawl.png",
    blindfolded: true,
    softlockPreventionIsland: true,
    class: bc.BawlBaby,
  },

  // 232
  [RandomBabyType.LEMON]: {
    name: "Lemon Baby",
    description: "Starts with Lemon Mishap (improved)",
    sprite: "232_baby_lemon.png",
    item: CollectibleType.LEMON_MISHAP,
    class: bc.LemonBaby,
  },

  // 233
  [RandomBabyType.PUNKBOY]: {
    name: "Punkboy Baby",
    description: "Starts with The Polaroid",
    sprite: "233_baby_punkboy.png",
    item: CollectibleType.POLAROID,
  },

  // 234
  [RandomBabyType.PUNKGIRL]: {
    name: "Punkgirl Baby",
    description: "Starts with The Negative",
    sprite: "234_baby_punkgirl.png",
    item: CollectibleType.NEGATIVE,
  },

  // 235
  [RandomBabyType.COMPUTER]: {
    name: "Computer Baby",
    description: "Starts with Technology + Technology 2",
    sprite: "235_baby_computer.png",
    item: CollectibleType.TECHNOLOGY,
    item2: CollectibleType.TECHNOLOGY_2,
    requireTears: true,
  },

  // 236
  [RandomBabyType.MASK]: {
    name: "Mask Baby",
    description: "All enemies are permanently confused",
    sprite: "236_baby_mask.png",
    seed: SeedEffect.ALWAYS_CONFUSED,
  },

  // 237
  [RandomBabyType.GEM]: {
    name: "Gem Baby",
    description: "Pennies spawn as nickels",
    sprite: "237_baby_gem.png",
    class: bc.GemBaby,
  },

  // 238
  [RandomBabyType.SHARK]: {
    name: "Shark Baby",
    description: "Starts with 5x Fate's Reward",
    sprite: "238_baby_shark.png",
    item: CollectibleType.FATES_REWARD,
    itemNum: 5,
  },

  // 239
  [RandomBabyType.BERET]: {
    name: "Beret Baby",
    description: "All champions",
    sprite: "239_baby_beret.png",
    seed: SeedEffect.ALL_CHAMPIONS,
    requireNoEndFloors: true,
  },

  // 240
  [RandomBabyType.BLISTERS]: {
    name: "Blisters Baby",
    description: "Low shot speed",
    sprite: "240_baby_blisters.png",
    requireTears: true,
    class: bc.BlistersBaby,
  },

  // 241
  [RandomBabyType.RADIOACTIVE]: {
    name: "Radioactive Baby",
    description: "Starts with Mysterious Liquid",
    sprite: "241_baby_radioactive.png",
    item: CollectibleType.MYSTERIOUS_LIQUID,
  },

  // 242
  [RandomBabyType.BEAST]: {
    name: "Beast Baby",
    description: "Random enemies",
    sprite: "242_baby_beast.png",
    class: bc.BeastBaby,
  },

  // 243
  [RandomBabyType.DARK_2]: {
    name: "Dark Baby 2",
    description: "Starts with Strange Attractor",
    sprite: "243_baby_dark.png",
    item: CollectibleType.STRANGE_ATTRACTOR,
  },

  // 244
  [RandomBabyType.SNAIL]: {
    name: "Snail Baby",
    description: "0.5x speed",
    sprite: "244_baby_snail.png",
    class: bc.SnailBaby,
  },

  // 245
  [RandomBabyType.BLOOD]: {
    name: "Blood Baby",
    description: "Starts with 5x Forever Alone",
    sprite: "245_baby_blood.png",
    item: CollectibleType.FOREVER_ALONE,
    itemNum: 5,
  },

  // 246
  [RandomBabyType.EIGHT_BALL]: {
    name: "8 Ball Baby",
    description: "Orbiting tears",
    sprite: "246_baby_8ball.png",
    requireTears: true,
    num: 90,
    softlockPreventionIsland: true,
    class: bc.EightBallBaby,
  },

  // 247
  [RandomBabyType.WISP]: {
    name: "Wisp Baby",
    description: "Starts with Crack the Sky",
    sprite: "247_baby_wisp.png",
    item: CollectibleType.CRACK_THE_SKY,
  },

  // 248
  [RandomBabyType.CACTUS]: {
    name: "Cactus Baby",
    description: "Starts with Locust of Famine",
    sprite: "248_baby_cactus.png",
    trinket: TrinketType.LOCUST_OF_FAMINE,
  },

  // 249
  [RandomBabyType.LOVE_EYE]: {
    name: "Love Eye Baby",
    description: "Falls in loves with the first enemy killed",
    sprite: "249_baby_loveeye.png",
    class: bc.LoveEyeBaby,
  },

  // 250
  [RandomBabyType.MEDUSA]: {
    name: "Medusa Baby",
    description: "Coins refill bombs and keys when depleted",
    sprite: "250_baby_medusa.png",
    requireCoins: true,
    class: bc.MedusaBaby,
  },

  // 251
  [RandomBabyType.NUCLEAR]: {
    name: "Nuclear Baby",
    description: "Mama Mega effect on hit",
    sprite: "251_baby_nuclear.png",
    class: bc.NuclearBaby,
  },

  // 252
  [RandomBabyType.PURPLE]: {
    name: "Purple Baby",
    description: "Fires are holy",
    sprite: "252_baby_purple.png",
    class: bc.PurpleBaby,
  },

  // 253
  [RandomBabyType.WIZARD]: {
    name: "Wizard Baby",
    description: "Most cards are face up",
    sprite: "253_baby_wizard.png",
    class: bc.WizardBaby,
  },

  // 254
  [RandomBabyType.EARTH]: {
    name: "Earth Baby",
    description: "Starts with Fruit Cake",
    sprite: "254_baby_earth.png",
    item: CollectibleType.FRUIT_CAKE,
    requireTears: true,
  },

  // 255
  [RandomBabyType.SATURN]: {
    name: "Saturn Baby",
    description: "Starts with Continuum",
    sprite: "255_baby_saturn.png",
    item: CollectibleType.CONTINUUM,
    requireTears: true,
  },

  // 256
  [RandomBabyType.CLOUD]: {
    name: "Cloud Baby",
    description: "Ventricle Razor effect every 15 seconds",
    sprite: "256_baby_cloud.png",
    num: 15,
    class: bc.CloudBaby,
  },

  // 257
  [RandomBabyType.TUBE]: {
    name: "Tube Baby",
    description: "Starts with Varicose Veins",
    sprite: "257_baby_tube.png",
    item: CollectibleType.VARICOSE_VEINS,
  },

  // 258
  [RandomBabyType.ROCKER]: {
    name: "Rocker Baby",
    description: "Spawns a random bomb on hit",
    sprite: "258_baby_rocker.png",
    class: bc.RockerBaby,
  },

  // 259
  [RandomBabyType.KING]: {
    name: "King Baby",
    description: "Starts with Crown of Light",
    sprite: "259_baby_king.png",
    item: CollectibleType.CROWN_OF_LIGHT,
  },

  // 260
  [RandomBabyType.COAT]: {
    name: "Coat Baby",
    description: "Spawns a random card on hit",
    sprite: "260_baby_coat.png",
    class: bc.CoatBaby,
  },

  // 261
  [RandomBabyType.VIKING]: {
    name: "Viking Baby",
    description: "Secret Room --> Super Secret Room",
    sprite: "261_baby_viking.png",
    class: bc.VikingBaby,
  },

  // 262
  [RandomBabyType.PANDA]: {
    name: "Panda Baby",
    description: "Starts with The Poop (improved)",
    sprite: "262_baby_panda.png",
    item: CollectibleType.POOP,
    class: bc.PandaBaby,
  },

  // 263
  [RandomBabyType.RACCOON]: {
    name: "Raccoon Baby",
    description: "Random rocks",
    sprite: "263_baby_raccoon.png",
    class: bc.RaccoonBaby,
  },

  // 264
  [RandomBabyType.BEAR]: {
    name: "Bear Baby",
    description: "Starts with Mystery Gift",
    sprite: "264_baby_bear.png",
    item: CollectibleType.MYSTERY_GIFT,
  },

  // 265
  [RandomBabyType.POLAR_BEAR]: {
    name: "Polar Bear Baby",
    description: "Starts with Lil Brimstone + Robo Baby + Baby Bender",
    sprite: "265_baby_polarbear.png",
    item: CollectibleType.LIL_BRIMSTONE,
    item2: CollectibleType.ROBO_BABY,
    trinket: TrinketType.BABY_BENDER,
  },

  // 266
  [RandomBabyType.LOVEBEAR]: {
    name: "Lovebear Baby",
    description: "Starts with The Relic",
    sprite: "266_baby_lovebear.png",
    item: CollectibleType.RELIC,
  },

  // 267
  [RandomBabyType.HARE]: {
    name: "Hare Baby",
    description: "Takes damage when standing still",
    num: 15, // Amount of frames standing still before taking damage
    sprite: "267_baby_hare.png",
    class: bc.HareBaby,
  },

  // 268
  [RandomBabyType.SQUIRREL]: {
    name: "Squirrel Baby",
    description: "Starts with Walnut (improved)",
    sprite: "268_baby_squirrel.png",
    trinket: TrinketType.WALNUT,
    requireBombs: true,
    class: bc.SquirrelBaby,
  },

  // 269
  [RandomBabyType.TABBY]: {
    name: "Tabby Baby",
    description: "Starts with Gello",
    sprite: "269_baby_tabby.png",
    item: CollectibleType.GELLO,
    class: bc.TabbyBaby,
  },

  // 270
  [RandomBabyType.PORCUPINE]: {
    name: "Porcupine Baby",
    description: "Wait What? effect every 5 seconds",
    sprite: "270_baby_porcupine.png",
    num: 5,
    class: bc.PorcupineBaby,
  },

  // 271
  [RandomBabyType.PUPPY]: {
    name: "Puppy Baby",
    description: "Starts with Cricket's Head",
    sprite: "271_baby_puppy.png",
    item: CollectibleType.CRICKETS_HEAD,
  },

  // 272
  [RandomBabyType.PARROT]: {
    name: "Parrot Baby",
    description: "Starts with The Pony",
    sprite: "272_baby_parrot.png",
    item: CollectibleType.PONY,
  },

  // 273
  [RandomBabyType.CHAMELEON]: {
    name: "Chameleon Baby",
    description: "Starts with 5x Rotten Baby",
    sprite: "273_baby_chameleon.png",
    item: CollectibleType.ROTTEN_BABY,
    itemNum: 5,
  },

  // 274
  [RandomBabyType.BOULDER]: {
    name: "Boulder Baby",
    description: "Starts with Leo",
    sprite: "274_baby_boulder.png",
    item: CollectibleType.LEO,
  },

  // 275
  [RandomBabyType.AQUA]: {
    name: "Aqua Baby",
    description: "Starts with Taurus",
    sprite: "275_baby_aqua.png",
    item: CollectibleType.TAURUS,
  },

  // 276
  [RandomBabyType.GARGOYLE]: {
    name: "Gargoyle Baby",
    description: "Head of Krampus effect on hit",
    sprite: "276_baby_gargoyle.png",
    class: bc.GargoyleBaby,
  },

  // 277
  [RandomBabyType.SPIKY_DEMON]: {
    name: "Spiky Demon Baby",
    description: "Starts with Dark Arts",
    item: CollectibleType.DARK_ARTS,
    sprite: "277_baby_spikydemon.png",
  },

  // 278
  [RandomBabyType.RED_DEMON]: {
    name: "Red Demon Baby",
    description: "Starts with Brimstone + Anti-Gravity",
    sprite: "278_baby_reddemon.png",
    item: CollectibleType.BRIMSTONE,
    item2: CollectibleType.ANTI_GRAVITY,
    class: bc.RedDemonBaby,
  },

  // 279
  [RandomBabyType.ORANGE_DEMON]: {
    name: "Orange Demon Baby",
    description: "Explosivo tears",
    sprite: "279_baby_orangedemon.png",
    requireTears: true,
    class: bc.OrangeDemonBaby,
  },

  // 280
  [RandomBabyType.EYE_DEMON]: {
    name: "Eye Demon Baby",
    description: "Enemies have Continuum projectiles",
    sprite: "280_baby_eyedemon.png",
    class: bc.EyeDemonBaby,
  },

  // 281
  [RandomBabyType.FANG_DEMON]: {
    name: "Fang Demon Baby",
    description: "Directed light beams",
    sprite: "281_baby_fangdemon.png",
    item: CollectibleType.MARKED,
    blindfolded: true,
    num: 15, // Game frames between ticks
    requireNoEndFloors: true,
    requireTears: true,
    softlockPreventionDestroyPoops: true, // Light beams cannot kill poops.
    class: bc.FangDemonBaby,
  },

  // 282
  [RandomBabyType.GHOST_2]: {
    name: "Ghost Baby 2",
    description: "Constant Maw of the Void effect + flight + blindfolded",
    sprite: "282_baby_ghost.png",
    blindfolded: true,
    flight: true,
    class: bc.GhostBaby2,
  },

  // 283
  [RandomBabyType.ARACHNID]: {
    name: "Arachnid Baby",
    description: "Starts with 5x Daddy Longlegs",
    sprite: "283_baby_arachnid.png",
    item: CollectibleType.DADDY_LONGLEGS,
    itemNum: 5,
  },

  // 284
  [RandomBabyType.BONY]: {
    name: "Bony Baby",
    description: "All bombs are doubled",
    sprite: "284_baby_bony.png",
    requireBombs: true,
    class: bc.BonyBaby,
  },

  // 285
  [RandomBabyType.BIG_TONGUE]: {
    name: "Big Tongue Baby",
    description: "Flush effect on hit",
    sprite: "285_baby_bigtongue.png",
    class: bc.BigTongueBaby,
  },

  // 286
  [RandomBabyType.THREE_D]: {
    name: "3D Baby",
    description: "Starts with My Reflection",
    sprite: "286_baby_3d.png",
    item: CollectibleType.MY_REFLECTION,
    requireTears: true,
  },

  // 287
  [RandomBabyType.SUIT]: {
    name: "Suit Baby",
    description: "All special rooms are Devil Rooms",
    sprite: "287_baby_suit.png",
    class: bc.SuitBaby,
  },

  // 288
  [RandomBabyType.BUTT]: {
    name: "Butt Baby",
    description: "Farts after shooting",
    sprite: "288_baby_butt.png",
    requireTears: true,
    class: bc.ButtBaby,
  },

  // 289
  [RandomBabyType.CUPID]: {
    name: "Cupid Baby",
    description: "Starts with Cupid's Arrow",
    sprite: "289_baby_cupid.png",
    item: CollectibleType.CUPIDS_ARROW,
    requireTears: true,
  },

  // 290
  [RandomBabyType.HEART]: {
    name: "Heart Baby",
    description: "Dull Razor effect every 5 seconds",
    sprite: "290_baby_heart.png",
    num: 5,
    class: bc.HeartBaby,
  },

  // 291
  [RandomBabyType.KILLER]: {
    name: "Killer Baby",
    description: "+0.2 damage per enemy killed",
    sprite: "291_baby_killer.png",
    class: bc.KillerBaby,
  },

  // 292
  [RandomBabyType.LANTERN]: {
    name: "Lantern Baby",
    description: "Godhead aura + flight + blindfolded",
    sprite: "292_baby_lantern.png",
    item: CollectibleType.GODHEAD,
    item2: CollectibleType.LUDOVICO_TECHNIQUE,
    flight: true,
    requireTears: true,
    // This baby does not use the "blindfolded" property because it would remove The Ludovico
    // Technique.
    class: bc.LanternBaby,
  },

  // 293
  [RandomBabyType.BANSHEE]: {
    name: "Banshee Baby",
    description: "Crack the Sky effect on hit",
    sprite: "293_baby_banshee.png",
    class: bc.BansheeBaby,
  },

  // 294
  [RandomBabyType.RANGER]: {
    name: "Ranger Baby",
    description: "Starts with 3x Lil Chest",
    sprite: "294_baby_ranger.png",
    item: CollectibleType.LIL_CHEST,
    itemNum: 3,
  },

  // 295
  [RandomBabyType.RIDER]: {
    name: "Rider Baby",
    description: "Starts with A Pony + blindfolded",
    sprite: "295_baby_rider.png",
    item: CollectibleType.PONY,
    blindfolded: true,
    class: bc.RiderBaby,
  },

  // 296
  [RandomBabyType.CHOCO]: {
    name: "Choco Baby",
    description: "Starts with Chocolate Milk",
    sprite: "296_baby_choco.png",
    item: CollectibleType.CHOCOLATE_MILK,
  },

  // 297
  [RandomBabyType.WOODSMAN]: {
    name: "Woodsman Baby",
    description: "Meat Cleaver effect on room enter",
    sprite: "297_baby_woodsman.png",
    class: bc.WoodsmanBaby,
  },

  // 298
  [RandomBabyType.BRUNETTE]: {
    name: "Brunette Baby",
    description: "Starts with The Poop + Brown Cap",
    sprite: "298_baby_brunette.png",
    item: CollectibleType.POOP,
    trinket: TrinketType.BROWN_CAP,
  },

  // 299
  [RandomBabyType.BLONDE]: {
    name: "Blonde Baby",
    description: "Starts with Dad's Ring",
    sprite: "299_baby_blonde.png",
    item: CollectibleType.DADS_RING,
  },

  // 300
  [RandomBabyType.BLUE_HAIR]: {
    name: "Blue Hair Baby",
    description: "Starts with The Candle",
    sprite: "300_baby_bluehair.png",
    item: CollectibleType.CANDLE,
  },

  // 301
  [RandomBabyType.BLOODIED]: {
    name: "Bloodied Baby",
    description: "Create red doors on hit + improved Ultra Secret Rooms",
    sprite: "301_baby_bloodied.png",
    num: 5, // Number of collectibles
    class: bc.BloodiedBaby,
  },

  // 302
  [RandomBabyType.CHEESE]: {
    name: "Cheese Baby",
    description: "The Bean + Gigante Bean",
    sprite: "302_baby_cheese.png",
    item: CollectibleType.BEAN,
    trinket: TrinketType.GIGANTE_BEAN,
  },

  // 303
  [RandomBabyType.PIZZA]: {
    name: "Pizza Baby",
    description: "Starts with Brown Nugget (improved)",
    sprite: "303_baby_pizza.png",
    item: CollectibleType.BROWN_NUGGET,
    num: 3, // In game frames
    class: bc.PizzaBaby,
  },

  // 304
  [RandomBabyType.HOTDOG]: {
    name: "Hotdog Baby",
    description:
      "Constant The Bean effect + flight + explosion immunity + blindfolded",
    sprite: "304_baby_hotdog.png",
    flight: true,
    explosionImmunity: true,
    blindfolded: true,
    requireNoEndFloors: true,
    class: bc.HotdogBaby,
  },

  // 305
  [RandomBabyType.NATURE]: {
    name: "Nature Baby",
    description: "Starts with Sprinkler",
    sprite: "305_baby_pear.png",
    item: CollectibleType.SPRINKLER,
  },

  // 306
  [RandomBabyType.BORG]: {
    name: "Borg Baby",
    description: "Starts with Teleport 2.0",
    sprite: "306_baby_borg.png",
    item: CollectibleType.TELEPORT_2,
  },

  // 307
  [RandomBabyType.CORRUPTED]: {
    name: "Corrupted Baby",
    description: "Touching items/pickups causes damage",
    sprite: "307_baby_corrupted.png",
    class: bc.CorruptedBaby,
  },

  // 308
  [RandomBabyType.X_MOUTH]: {
    name: "X Mouth Baby",
    description: "Moving Box effect on hit",
    sprite: "308_baby_xmouth.png",
    class: bc.XMouthBaby,
  },

  // 309
  [RandomBabyType.X_EYED]: {
    name: "X Eyed Baby",
    description: "Starts with Marked",
    sprite: "309_baby_xeyes.png",
    item: CollectibleType.MARKED,
    requireTears: true,
  },

  // 310
  [RandomBabyType.STARRY_EYED]: {
    name: "Starry Eyed Baby",
    description: "Spawns a Stars Card on hit",
    sprite: "310_baby_stareyes.png",
    class: bc.StarryEyedBaby,
  },

  // 311
  [RandomBabyType.SURGEON]: {
    name: "Surgeon Baby",
    description: "Starts with Ventricle Razor",
    sprite: "311_baby_surgeon.png",
    item: CollectibleType.VENTRICLE_RAZOR,
  },

  // 312
  [RandomBabyType.SWORD]: {
    name: "Sword Baby",
    description: "Starts with Sacrificial Dagger",
    sprite: "312_baby_sword.png",
    item: CollectibleType.SACRIFICIAL_DAGGER,
  },

  // 313
  [RandomBabyType.MONK]: {
    name: "Monk Baby",
    description: "Starts with Mom's Bracelet",
    sprite: "313_baby_monk.png",
    item: CollectibleType.MOMS_BRACELET,
  },

  // 314
  [RandomBabyType.DISCO]: {
    name: "Disco Baby",
    description: "Starts with 10x Angelic Prism",
    sprite: "314_baby_disco.png",
    item: CollectibleType.ANGELIC_PRISM,
    itemNum: 10,
  },

  // 315
  [RandomBabyType.PUZZLE]: {
    name: "Puzzle Baby",
    description: "D6 effect on hit",
    sprite: "315_baby_puzzle.png",
    class: bc.PuzzleBaby,
  },

  // 316
  [RandomBabyType.SPEAKER]: {
    name: "Speaker Baby",
    description: "X splitting tears",
    sprite: "316_baby_speaker.png",
    requireTears: true,
    class: bc.SpeakerBaby,
  },

  // 317
  [RandomBabyType.SCARY]: {
    name: "Scary Baby",
    description: "Items cost hearts",
    sprite: "317_baby_scary.png",
    class: bc.ScaryBaby,
  },

  // 318
  [RandomBabyType.FIREBALL]: {
    name: "Fireball Baby",
    description: "Explosion immunity + fire immunity",
    sprite: "318_baby_fireball.png",
    explosionImmunity: true,
    class: bc.FireballBaby,
  },

  // 319
  [RandomBabyType.MAW]: {
    name: "Maw Baby",
    description: "Starts with Maw of the Void",
    sprite: "319_baby_maw.png",
    item: CollectibleType.MAW_OF_THE_VOID,
  },

  // 320
  [RandomBabyType.EXPLODING]: {
    name: "Exploding Baby",
    description: "Kamikaze effect upon touching a breakable obstacle",
    sprite: "320_baby_exploding.png",
    explosionImmunity: true,
    class: bc.ExplodingBaby,
  },

  // 321
  [RandomBabyType.CUPCAKE]: {
    name: "Cupcake Baby",
    description: "High shot speed",
    sprite: "321_baby_cupcake.png",
    requireTears: true,
    class: bc.CupcakeBaby,
  },

  // 322
  [RandomBabyType.SKINLESS]: {
    name: "Skinless Baby",
    description: "2x damage + takes 2x damage",
    sprite: "322_baby_skinless.png",
    class: bc.SkinlessBaby,
  },

  // 323
  [RandomBabyType.BALLERINA]: {
    name: "Ballerina Baby",
    description: "Summons a Restock Machine after 6 hits",
    sprite: "323_baby_ballerina.png",
    requireNumHits: 6,
    class: bc.BallerinaBaby,
  },

  // 324
  [RandomBabyType.GOBLIN]: {
    name: "Goblin Baby",
    description: "Extra item after boss if no damage taken on floor",
    sprite: "324_baby_goblin.png",
    class: bc.GoblinBaby,
  },

  // 325
  [RandomBabyType.COOL_GOBLIN]: {
    name: "Cool Goblin Baby",
    description: "Starts with 5x Acid Baby",
    sprite: "325_baby_coolgoblin.png",
    item: CollectibleType.ACID_BABY,
    itemNum: 5,
  },

  // 326
  [RandomBabyType.GEEK]: {
    name: "Geek Baby",
    description: "Starts with 20x Robo-Baby 2.0 + blindfolded",
    sprite: "326_baby_geek.png",
    item: CollectibleType.ROBO_BABY_2,
    itemNum: 20,
    blindfolded: true,
    softlockPreventionDestroyPoops: true, // Robo-Baby 2.0 will not kill poops.
    class: bc.GeekBaby,
  },

  // 327
  [RandomBabyType.LONG_BEARD]: {
    name: "Long Beard Baby",
    description: "Starts with 10x Gemini",
    sprite: "327_baby_longbeard.png",
    item: CollectibleType.GEMINI,
    itemNum: 10,
  },

  // 328
  [RandomBabyType.MUTTONCHOPS]: {
    name: "Muttonchops Baby",
    description: "Starts with Lachryphagy",
    sprite: "328_baby_muttonchops.png",
    item: CollectibleType.LACHRYPHAGY,
    requireTears: true,
  },

  // 329
  [RandomBabyType.SPARTAN]: {
    name: "Spartan Baby",
    description: "Starts with Spirit Sword",
    sprite: "329_baby_spartan.png",
    item: CollectibleType.SPIRIT_SWORD,
  },

  // 330
  [RandomBabyType.TORTOISE]: {
    name: "Tortoise Baby",
    description: "50% chance to ignore damage",
    sprite: "330_baby_tortoise.png",
    class: bc.TortoiseBaby,
  },

  // 331
  [RandomBabyType.SLICER]: {
    name: "Slicer Baby",
    description: "Slice tears",
    sprite: "331_baby_slicer.png",
    item: CollectibleType.SOY_MILK,
    item2: CollectibleType.PROPTOSIS,
    requireTears: true,
    num: 5, // Frames until it disappears
    class: bc.SlicerBaby,
  },

  // 332
  [RandomBabyType.BUTTERFLY_2]: {
    name: "Butterfly Baby 2",
    description: "Flight + can walk through walls",
    sprite: "332_baby_butterfly.png",
    // We do not need to explicitly give this character flight, because the grid collision does the
    // same thing.
    class: bc.ButterflyBaby2,
  },

  // 333
  [RandomBabyType.HOMELESS]: {
    name: "Homeless Baby",
    description: "Starts with 15x Buddy in a Box",
    sprite: "333_baby_homeless.png",
    item: CollectibleType.BUDDY_IN_A_BOX,
    itemNum: 15,
    class: bc.BuddyBaby,
  },

  // 334
  [RandomBabyType.LUMBERJACK]: {
    name: "Lumberjack Baby",
    description: "Starts with 3x Sack of Sacks",
    sprite: "334_baby_lumberjack.png",
    item: CollectibleType.SACK_OF_SACKS,
    itemNum: 3,
  },

  // 335
  [RandomBabyType.CYBERSPACE]: {
    name: "Cyberspace Baby",
    description: "Starts with Brimstone + Spoon Bender",
    sprite: "335_baby_cyberspace.png",
    item: CollectibleType.BRIMSTONE,
    item2: CollectibleType.SPOON_BENDER,
  },

  // 336
  [RandomBabyType.HERO]: {
    name: "Hero Baby",
    description: "3x damage + 3x tear rate when at 1 heart or less",
    sprite: "336_baby_hero.png",
    class: bc.HeroBaby,
  },

  // 337
  [RandomBabyType.BOXERS]: {
    name: "Boxers Baby",
    description: "Knockout Drops tears",
    sprite: "337_baby_boxers.png",
    requireTears: true,
    class: bc.BoxersBaby,
  },

  // 338
  [RandomBabyType.WING_HELMET]: {
    name: "Wing Helmet Baby",
    description: "Starts with The Ludovico Technique + The Parasite",
    sprite: "338_baby_winghelmet.png",
    item: CollectibleType.LUDOVICO_TECHNIQUE,
    item2: CollectibleType.PARASITE,
    requireTears: true,
  },

  // 339
  [RandomBabyType.X]: {
    name: "X Baby",
    description: "Shoots 4 tears diagonally",
    sprite: "339_baby_x.png",
    requireTears: true,
    class: bc.XBaby,
  },

  // 340
  [RandomBabyType.O_2]: {
    name: "O Baby 2",
    description: "Spiral tears",
    sprite: "340_baby_o.png",
    requireTears: true,
    class: bc.OBaby2,
  },

  // 341
  [RandomBabyType.VOMIT]: {
    name: "Vomit Baby",
    description: "Must stand still every 10 seconds",
    sprite: "341_baby_vomit.png",
    num: 10,
    class: bc.VomitBaby,
  },

  // 342
  [RandomBabyType.MERMAN]: {
    name: "Merman Baby",
    description: "Keys spawn as bombs",
    sprite: "342_baby_merman.png",
    class: bc.MermanBaby,
  },

  // 343
  [RandomBabyType.CYBORG]: {
    name: "Cyborg Baby",
    description: "Sees numerical damage values", // debug 7
    sprite: "343_baby_cyborg.png",
    class: bc.CyborgBaby,
  },

  // 344
  [RandomBabyType.BARBARIAN]: {
    name: "Barbarian Baby",
    description: "Mama Mega bombs",
    sprite: "344_baby_barbarian.png",
    requireBombs: true,
    class: bc.BarbarianBaby,
  },

  // 345
  [RandomBabyType.LOCUST]: {
    name: "Locust Baby",
    description: "Starts with 20 Abyss locusts + blindfolded",
    sprite: "345_baby_locust.png",
    blindfolded: true,
    trinket: TrinketType.APOLLYONS_BEST_FRIEND,
    num: 20,
  },

  // 346
  [RandomBabyType.TWOTONE]: {
    name: "Twotone Baby",
    description: "Dataminer effect on room enter",
    sprite: "346_baby_twotone.png",
    class: bc.TwotoneBaby,
  },

  // 347
  [RandomBabyType.N_2600]: {
    name: "2600 Baby",
    description: "Friend Finder effect on room clear",
    sprite: "347_baby_2600.png",
    class: bc.N2600Baby,
  },

  // 348
  [RandomBabyType.FOURTONE]: {
    name: "Fourtone Baby",
    description: "Starts with The Candle + blindfolded + instant recharge",
    sprite: "348_baby_fourtone.png",
    item: CollectibleType.CANDLE,
    blindfolded: true,
    softlockPreventionDestroyPoops: true, // The Candle cannot kill poops
    class: bc.FourtoneBaby,
  },

  // 349
  [RandomBabyType.GRAYSCALE]: {
    name: "Grayscale Baby",
    description: "Delirious effect every 10 seconds",
    sprite: "349_baby_grayscale.png",
    num: 10,
    class: bc.GrayscaleBaby,
  },

  // 350
  [RandomBabyType.RABBIT]: {
    name: "Rabbit Baby",
    description: "Starts with How to Jump; must jump often",
    sprite: "350_baby_rabbit.png",
    item: CollectibleType.HOW_TO_JUMP,
    num: 45 * 2, // Amount of game frames between forced book uses
    class: bc.RabbitBaby,
  },

  // 351
  [RandomBabyType.MOUSE]: {
    name: "Mouse Baby",
    description: "Coin doors in uncleared rooms",
    sprite: "351_baby_mouse.png",
    item: CollectibleType.PAY_TO_PLAY,
    requireCoins: true,
    class: bc.MouseBaby,
  },

  // 352
  [RandomBabyType.CRITTER]: {
    name: "Critter Baby",
    description: "Starts with Infestation 2",
    sprite: "352_baby_critter.png",
    item: CollectibleType.INFESTATION_2,
  },

  // 353
  [RandomBabyType.BLUE_ROBOT]: {
    name: "Blue Robot Baby",
    description: "Starts with Berserk",
    sprite: "353_baby_bluerobot.png",
    item: CollectibleType.BERSERK,
  },

  // 354
  [RandomBabyType.PILOT]: {
    name: "Pilot Baby",
    description: "Starts with Dr. Fetus + Haemolacria",
    sprite: "354_baby_pilot.png",
    item: CollectibleType.DR_FETUS,
    item2: CollectibleType.HAEMOLACRIA,
  },

  // 355
  [RandomBabyType.RED_PLUMBER]: {
    name: "Red Plumber Baby",
    description: "Starts with Locust of War",
    sprite: "355_baby_redplumber.png",
    trinket: TrinketType.LOCUST_OF_WRATH,
  },

  // 356
  [RandomBabyType.GREEN_PLUMBER]: {
    name: "Green Plumber Baby",
    description: "Starts with Locust of Pestilence",
    sprite: "356_baby_greenplumber.png",
    trinket: TrinketType.LOCUST_OF_PESTILENCE,
  },

  // 357
  [RandomBabyType.YELLOW_PLUMBER]: {
    name: "Yellow Plumber Baby",
    description: "Starts with Locust of Conquest",
    sprite: "357_baby_yellowplumber.png",
    trinket: TrinketType.LOCUST_OF_CONQUEST,
  },

  // 358
  [RandomBabyType.PURPLE_PLUMBER]: {
    name: "Purple Plumber Baby",
    description: "Starts with Locust of Death",
    sprite: "358_baby_purpleplumber.png",
    trinket: TrinketType.LOCUST_OF_DEATH,
  },

  // 359
  [RandomBabyType.TANOOKI]: {
    name: "Tanooki Baby",
    description: "Mr. ME effect on hit",
    sprite: "359_baby_tanooki.png",
    class: bc.TanookiBaby,
  },

  // 360
  [RandomBabyType.MUSHROOM_MAN]: {
    name: "Mushroom Man Baby",
    description: "Starts with Magic Mushroom",
    sprite: "360_baby_mushroomman.png",
    item: CollectibleType.MAGIC_MUSHROOM,
  },

  // 361
  [RandomBabyType.MUSHROOM_GIRL]: {
    name: "Mushroom Girl Baby",
    description: "Every 8th tear is a bomb",
    sprite: "361_baby_mushroomgirl.png",
    num: 8,
    requireTears: true,
    class: bc.MushroomGirlBaby,
  },

  // 362
  [RandomBabyType.CANNONBALL]: {
    name: "Cannonball Baby",
    description: "Starts with 15x Samson's Chains",
    sprite: "362_baby_cannonball.png",
    item: CollectibleType.SAMSONS_CHAINS,
    itemNum: 15,
  },

  // 363
  [RandomBabyType.FROGGY]: {
    name: "Froggy Baby",
    description: "Starts with Ludo + Brimstone + Wiggle Worm",
    sprite: "363_baby_froggy.png",
    item: CollectibleType.LUDOVICO_TECHNIQUE,
    item2: CollectibleType.BRIMSTONE,
    trinket: TrinketType.WIGGLE_WORM,
    requireTears: true,
  },

  // 364
  [RandomBabyType.TURTLE_DRAGON]: {
    name: "Turtle Dragon Baby",
    description: "Fiery tears",
    sprite: "364_baby_turtledragon.png",
    requireTears: true,
    class: bc.TurtleDragonBaby,
  },

  // 365
  [RandomBabyType.SHELL_SUIT]: {
    name: "Shell Suit Baby",
    description: "Starts with Burnt Penny",
    sprite: "365_baby_shellsuit.png",
    trinket: TrinketType.BURNT_PENNY,
  },

  // 366
  [RandomBabyType.FIERY]: {
    name: "Fiery Baby",
    description: "Spawns a fire on hit",
    sprite: "366_baby_fiery.png",
    class: bc.FieryBaby,
  },

  // 367
  [RandomBabyType.MEAN_MUSHROOM]: {
    name: "Mean Mushroom Baby",
    description: "Starts with 5x Sack of Pennies",
    sprite: "367_baby_meanmushroom.png",
    item: CollectibleType.SACK_OF_PENNIES,
    itemNum: 5,
  },

  // 368
  [RandomBabyType.ARCADE]: {
    name: "Arcade Baby",
    description: "Razor blade tears",
    sprite: "368_baby_arcade.png",
    num: 3,
    requireTears: true,
    class: bc.ArcadeBaby,
  },

  // 369
  [RandomBabyType.SCARED_GHOST]: {
    name: "Scared Ghost Baby",
    description: "2x speed",
    sprite: "369_baby_scaredghost.png",
    class: bc.ScaredGhostBaby,
  },

  // 370
  [RandomBabyType.BLUE_GHOST]: {
    name: "Blue Ghost Baby",
    description: "Max tear rate",
    sprite: "370_baby_blueghost.png",
    class: bc.BlueGhostBaby,
  },

  // 371
  [RandomBabyType.RED_GHOST]: {
    name: "Red Ghost Baby",
    description: "+10 damage",
    sprite: "371_baby_redghost.png",
    class: bc.RedGhostBaby,
  },

  // 372
  [RandomBabyType.PINK_GHOST]: {
    name: "Pink Ghost Baby",
    description: "Charm tears",
    sprite: "372_baby_pinkghost.png",
    requireTears: true,
    class: bc.PinkGhostBaby,
  },

  // 373
  [RandomBabyType.ORANGE_GHOST]: {
    name: "Orange Ghost Baby",
    description: "Placed bombs are Mega Troll Bombs",
    sprite: "373_baby_orangeghost.png",
    requireBombs: true,
    class: bc.OrangeGhostBaby,
  },

  // 374
  [RandomBabyType.PINK_PRINCESS]: {
    name: "Pink Princess Baby",
    description: "Summons random stomps every 4 seconds",
    sprite: "374_baby_pinkprincess.png",
    num: 4,
    class: bc.PinkPrincessBaby,
  },

  // 375
  [RandomBabyType.YELLOW_PRINCESS]: {
    name: "Yellow Princess Baby",
    description: "Starts with Ipecac + Trisagion + Flat Stone",
    sprite: "375_baby_yellowprincess.png",
    item: CollectibleType.IPECAC,
    item2: CollectibleType.TRISAGION,
    item3: CollectibleType.FLAT_STONE,
    requireTears: true,
  },

  // 376
  [RandomBabyType.DINO]: {
    name: "Dino Baby",
    description: "Gains a explosive egg per enemy killed",
    sprite: "376_baby_dino.png",
    class: bc.DinoBaby,
  },

  // 377
  [RandomBabyType.ELF]: {
    name: "Elf Baby",
    description: "Starts with Spear of Destiny (improved) + flight",
    description2: "+ explosion immunity + blindfolded",
    sprite: "377_baby_elf.png",
    item: CollectibleType.SPEAR_OF_DESTINY,
    flight: true,
    explosionImmunity: true,
    blindfolded: true,
    class: bc.ElfBaby,
  },

  // 378
  [RandomBabyType.DARK_ELF]: {
    name: "Dark Elf Baby",
    description: "Book of the Dead effect on hit",
    sprite: "378_baby_darkelf.png",
    class: bc.DarkElfBaby,
  },

  // 379
  [RandomBabyType.DARK_KNIGHT]: {
    name: "Dark Knight Baby",
    description: "Starts with 5x Dry Baby",
    sprite: "379_baby_darkknight.png",
    item: CollectibleType.DRY_BABY,
    itemNum: 5,
  },

  // 380
  [RandomBabyType.OCTOPUS]: {
    name: "Octopus Baby",
    description: "Black creep tears",
    sprite: "380_baby_octopus.png",
    requireTears: true,
    class: bc.OctopusBaby,
  },

  // 381
  [RandomBabyType.ORANGE_PIG]: {
    name: "Orange Pig Baby",
    description: "Double items",
    sprite: "381_baby_orangepig.png",
    item: CollectibleType.DAMOCLES_PASSIVE,
    class: bc.OrangePigBaby,
  },

  // 382
  [RandomBabyType.BLUE_PIG]: {
    name: "Blue Pig Baby",
    description: "Spawns a Mega Troll Bomb every 5 seconds",
    sprite: "382_baby_bluepig.png",
    num: 5,
    class: bc.BluePigBaby,
  },

  // 383
  [RandomBabyType.ELF_PRINCESS]: {
    name: "Elf Princess Baby",
    description: "Starts with 10x Mom's Razor",
    sprite: "383_baby_elfprincess.png",
    item: CollectibleType.MOMS_RAZOR,
    itemNum: 10,
  },

  // 384
  [RandomBabyType.FISHMAN]: {
    name: "Fishman Baby",
    description: "Spawns a random bomb on room clear",
    sprite: "384_baby_fishman.png",
    class: bc.FishmanBaby,
  },

  // 385
  [RandomBabyType.FAIRYMAN]: {
    name: "Fairyman Baby",
    description: "-30% damage on hit",
    sprite: "385_baby_fairyman.png",
    class: bc.FairymanBaby,
  },

  // 386
  [RandomBabyType.IMP]: {
    name: "Imp Baby",
    description: "Blender + flight + explosion immunity + blindfolded",
    sprite: "386_baby_imp.png",
    item: CollectibleType.MOMS_KNIFE,
    item2: CollectibleType.LOKIS_HORNS,
    flight: true,
    explosionImmunity: true,
    num: 3, // In game frames
    // This baby does not use the "blindfolded" property because it would remove knives.
    requireNoEndFloors: true,
    class: bc.ImpBaby,
  },

  // 387
  [RandomBabyType.WORM_2]: {
    name: "Worm Baby 2",
    description: "Starts with 20x Leech",
    sprite: "387_baby_worm.png",
    item: CollectibleType.LEECH,
    itemNum: 20,
  },

  // 388
  [RandomBabyType.BLUE_WRESTLER]: {
    name: "Blue Wrestler Baby",
    description: "Enemies spawn projectiles upon death",
    sprite: "388_baby_bluewrestler.png",
    num: 6,
    class: bc.BlueWrestlerBaby,
  },

  // 389
  [RandomBabyType.RED_WRESTLER]: {
    name: "Red Wrestler Baby",
    description: "Everything is TNT",
    sprite: "389_baby_redwrestler.png",
    class: bc.RedWrestlerBaby,
  },

  // 390
  [RandomBabyType.TOAST]: {
    name: "Toast Baby",
    description: "Enemies leave a Red Candle fire upon death",
    sprite: "390_baby_toast.png",
    class: bc.ToastBaby,
  },

  // 391
  [RandomBabyType.ROBOBOY]: {
    name: "Roboboy Baby",
    description: "Starts with Technology + A Lump of Coal",
    sprite: "391_baby_roboboy.png",
    item: CollectibleType.TECHNOLOGY,
    item2: CollectibleType.LUMP_OF_COAL,
  },

  // 392
  [RandomBabyType.LIBERTY]: {
    name: "Liberty Baby",
    description: "Starts with Azazel's Rage",
    sprite: "392_baby_liberty.png",
    item: CollectibleType.AZAZELS_RAGE,
  },

  // 393
  [RandomBabyType.DREAM_KNIGHT]: {
    name: "Dream Knight Baby",
    description: "Starts with Super Bum",
    sprite: "393_baby_dreamknight.png",
    item: CollectibleType.BUM_FRIEND,
    item2: CollectibleType.DARK_BUM,
    item3: CollectibleType.KEY_BUM,
  },

  // 394
  [RandomBabyType.COWBOY]: {
    name: "Cowboy Baby",
    description: "Pickups shoot",
    sprite: "394_baby_cowboy.png",
    num: 35, // Game frames in between shots
    class: bc.CowboyBaby,
  },

  // 395
  [RandomBabyType.MERMAID]: {
    name: "Mermaid Baby",
    description: "Bombs spawn as keys",
    sprite: "395_baby_mermaid.png",
    class: bc.MermaidBaby,
  },

  // 396
  [RandomBabyType.PLAGUE]: {
    name: "Plague Baby",
    description: "Leaves a trail of creep",
    sprite: "396_baby_plague.png",
    class: bc.PlagueBaby,
  },

  // 397
  [RandomBabyType.SPACE_SOLDIER]: {
    name: "Space Soldier Baby",
    description: "Starts with Void",
    sprite: "397_baby_spacesoldier.png",
    item: CollectibleType.VOID,
  },

  // 398
  [RandomBabyType.DARK_SPACE_SOLDIER]: {
    name: "Dark Space Soldier Baby",
    description: "Chaos card tears (every 5th tear)",
    sprite: "398_baby_darkspacesoldier.png",
    num: 5,
    requireTears: true,
    class: bc.DarkSpaceSoldierBaby,
  },

  // 399
  [RandomBabyType.GAS_MASK]: {
    name: "Gas Mask Baby",
    description: "Starts with Wait What?",
    sprite: "399_baby_gasmask.png",
    item: CollectibleType.WAIT_WHAT,
  },

  // 400
  [RandomBabyType.TOMBOY]: {
    name: "Tomboy Baby",
    description: "Starts with We Need to Go Deeper (uncharged)",
    sprite: "400_baby_tomboy.png",
    item: CollectibleType.WE_NEED_TO_GO_DEEPER,
    uncharged: true,
  },

  // 401
  [RandomBabyType.CORGI]: {
    name: "Corgi Baby",
    description: "Spawns a fly every 1.5 seconds",
    sprite: "401_baby_corgi.png",
    num: 1.5,
    class: bc.CorgiBaby,
  },

  // 402
  [RandomBabyType.UNICORN]: {
    name: "Unicorn Baby",
    description: "Starts with Unicorn Stump + Cube of Meat",
    sprite: "402_baby_unicorn.png",
    item: CollectibleType.UNICORN_STUMP,
    item2: CollectibleType.CUBE_OF_MEAT,
  },

  // 403
  [RandomBabyType.PIXIE]: {
    name: "Pixie Baby",
    description: "Starts with 3x YO LISTEN (improved)",
    sprite: "403_baby_pixie.png",
    item: CollectibleType.YO_LISTEN,
    itemNum: 3,
    class: bc.PixieBaby,
  },

  // 404
  [RandomBabyType.REFEREE]: {
    name: "Referee Baby",
    description: "Tomato tears",
    sprite: "404_baby_referee.png",
    class: bc.RefereeBaby,
  },

  // 405
  [RandomBabyType.DEAL_WITH_IT]: {
    name: "Deal With It Baby",
    description: "Starts with Teleport",
    sprite: "405_baby_dealwithit.png",
    item: CollectibleType.TELEPORT,
  },

  // 406
  [RandomBabyType.ASTRONAUT]: {
    name: "Astronaut Baby",
    description: "Tears have a 5% chance to create a Black Hole effect",
    sprite: "406_baby_astronaut.png",
    requireTears: true,
    class: bc.AstronautBaby,
  },

  // 407
  [RandomBabyType.BLURRED]: {
    name: "Blurred Baby",
    description: "Starts with Ipecac + Ludo + Flat Stone",
    sprite: "407_baby_blurred.png",
    item: CollectibleType.IPECAC,
    item2: CollectibleType.LUDOVICO_TECHNIQUE,
    item3: CollectibleType.FLAT_STONE,
    requireTears: true,
    class: bc.BlurredBaby,
  },

  // 408
  [RandomBabyType.CENSORED]: {
    name: "Censored Baby",
    description: "Starts with Eternal D6",
    sprite: "408_baby_censored.png",
    item: CollectibleType.ETERNAL_D6,
  },

  // 409
  [RandomBabyType.COOL_GHOST]: {
    name: "Cool Ghost Baby",
    description: "Starts with Flock of Succubi",
    sprite: "409_baby_coolghost.png",
    item: CollectibleTypeCustom.FLOCK_OF_SUCCUBI,
    num: 10,
    class: bc.CoolGhostBaby,
  },

  // 410
  [RandomBabyType.GILLS]: {
    name: "Gills Baby",
    description: "Splash tears",
    sprite: "410_baby_gills.png",
    requireTears: true,
    class: bc.GillsBaby,
  },

  // 411
  [RandomBabyType.BLUE_HAT]: {
    name: "Blue Hat Baby",
    description: "Starts with Blue Map",
    sprite: "411_baby_bluehat.png",
    item: CollectibleType.BLUE_MAP,
  },

  // 412
  [RandomBabyType.CATSUIT]: {
    name: "Catsuit Baby",
    description: "Guppy's Paw effect on hit",
    sprite: "412_baby_catsuit.png",
    class: bc.CatsuitBaby,
  },

  // 413
  [RandomBabyType.PIRATE]: {
    name: "Pirate Baby",
    description: "Starts with Treasure Map",
    sprite: "413_baby_pirate.png",
    item: CollectibleType.TREASURE_MAP,
  },

  // 414
  [RandomBabyType.SUPER_ROBO]: {
    name: "Super Robo Baby",
    description: "Starts with Broken Remote",
    sprite: "414_baby_superrobo.png",
    trinket: TrinketType.BROKEN_REMOTE,
  },

  // 415
  [RandomBabyType.LIGHTMAGE]: {
    name: "Lightmage Baby",
    description: "Starts with Trisagion",
    sprite: "415_baby_lightmage.png",
    item: CollectibleType.TRISAGION,
    requireTears: true,
  },

  // 416
  [RandomBabyType.PUNCHER]: {
    name: "Puncher Baby",
    description: "Starts with 10x Punching Bag",
    sprite: "416_baby_puncher.png",
    item: CollectibleType.PUNCHING_BAG,
    itemNum: 10,
  },

  // 417
  [RandomBabyType.HOLY_KNIGHT]: {
    name: "Holy Knight Baby",
    description: "Starts with Eucharist",
    sprite: "417_baby_holyknight.png",
    item: CollectibleType.EUCHARIST,
  },

  // 418
  [RandomBabyType.SHADOWMAGE]: {
    name: "Shadowmage Baby",
    description: "Starts with Spindown Dice",
    sprite: "418_baby_shadowmage.png",
    item: CollectibleType.SPINDOWN_DICE,
  },

  // 419
  [RandomBabyType.FIREMAGE]: {
    name: "Firemage Baby",
    description: "Starts with Fire Mind + 13 luck",
    sprite: "419_baby_firemage.png",
    item: CollectibleType.FIRE_MIND,
    requireTears: true,
    class: bc.FiremageBaby,
  },

  // 420
  [RandomBabyType.PRIEST]: {
    name: "Priest Baby",
    description: "Starts with Anima Sola",
    sprite: "420_baby_priest.png",
    item: CollectibleType.ANIMA_SOLA,
  },

  // 421
  [RandomBabyType.ZIPPER_2]: {
    name: "Zipper Baby 2",
    description: "Starts with Door Stop",
    sprite: "421_baby_zipper.png",
    trinket: TrinketType.DOOR_STOP,
  },

  // 422
  [RandomBabyType.BAG]: {
    name: "Bag Baby",
    description: "Starts with The Swarm",
    sprite: "422_baby_bag.png",
    item: CollectibleType.SWARM,
  },

  // 423
  [RandomBabyType.SAILOR]: {
    name: "Sailor Baby",
    description: "Starts with The Compass",
    sprite: "423_baby_sailor.png",
    item: CollectibleType.COMPASS,
  },

  // 424
  [RandomBabyType.RICH]: {
    name: "Rich Baby",
    description: "Starts with 99 cents",
    sprite: "424_baby_rich.png",
    class: bc.RichBaby,
  },

  // 425
  [RandomBabyType.TOGA]: {
    name: "Toga Baby",
    description: "Starts with Finger (improved)",
    sprite: "425_baby_toga.png",
    item: CollectibleType.FINGER,
    itemNum: 10,
  },

  // 426
  [RandomBabyType.KNIGHT]: {
    name: "Knight Baby",
    description: "Starts with 5x 7 Seals",
    sprite: "426_baby_knight.png",
    item: CollectibleType.SEVEN_SEALS,
    itemNum: 5,
  },

  // 427
  [RandomBabyType.BLACK_KNIGHT]: {
    name: "Black Knight Baby",
    description: "Starts with Black Hole",
    sprite: "427_baby_blackknight.png",
    item: CollectibleType.BLACK_HOLE,
  },

  // 428
  [RandomBabyType.MAGIC_CAT]: {
    name: "Magic Cat Baby",
    description: "Giga Bomb effect on hit",
    sprite: "428_baby_magiccat.png",
    class: bc.MagicCatBaby,
  },

  // 429
  [RandomBabyType.LITTLE_HORN]: {
    name: "Little Horn Baby",
    description: "Void tears (every 5th tear)",
    sprite: "429_baby_littlehorn.png",
    num: 5,
    requireTears: true,
    class: bc.LittleHornBaby,
  },

  // 430
  [RandomBabyType.FOLDER]: {
    name: "Folder Baby",
    description: "Swaps item/shop pools + devil/angel pools",
    sprite: "430_baby_folder.png",
    class: bc.FolderBaby,
  },

  // 431
  [RandomBabyType.DRIVER]: {
    name: "Driver Baby",
    description: "Slippery movement",
    sprite: "431_baby_driver.png",
    seed: SeedEffect.ICE_PHYSICS,
    class: bc.DriverBaby,
  },

  // 432
  [RandomBabyType.DRAGON]: {
    name: "Dragon Baby",
    description: "Starts with Lil Brimstone",
    sprite: "432_baby_dragon.png",
    item: CollectibleType.LIL_BRIMSTONE,
  },

  // 433
  [RandomBabyType.DOWNWELL]: {
    name: "Downwell Baby",
    description: "Starts with Eden's Soul",
    sprite: "433_baby_downwell.png",
    item: CollectibleType.EDENS_SOUL,
    uncharged: true,
  },

  // 434
  [RandomBabyType.CYLINDER]: {
    name: "Cylinder Baby",
    description: "Tear size increases with distance",
    sprite: "434_baby_cylinder.png",
    requireTears: true,
    class: bc.CylinderBaby,
  },

  // 435
  [RandomBabyType.CUP]: {
    name: "Cup Baby",
    description: "Card Against Humanity on hit",
    sprite: "435_baby_cup.png",
    class: bc.CupBaby,
  },

  // 436
  [RandomBabyType.CAVE_ROBOT]: {
    name: "Cave Robot Baby",
    description: "Starts with Hairpin",
    sprite: "436_baby_cave_robot.png",
    trinket: TrinketType.HAIRPIN,
  },

  // 437
  [RandomBabyType.BREADMEAT_HOODIEBREAD]: {
    name: "Breadmeat Hoodiebread Baby",
    description: "Everything is sped up",
    sprite: "437_baby_breadmeat_hoodiebread.png",
    class: bc.BreadmeatHoodiebreadBaby,
  },

  // 438
  [RandomBabyType.BIG_MOUTH_2]: {
    name: "Big Mouth Baby 2",
    description: "Mega Mush effect after 6 hits",
    sprite: "438_baby_bigmouth.png",
    requireNumHits: 6,
    class: bc.BigMouthBaby2,
  },

  // 439
  [RandomBabyType.AFRO_RAINBOW]: {
    name: "Afro Rainbow Baby",
    description: "Starts with 20x Rainbow Baby",
    sprite: "439_baby_afro_rainbow.png",
    item: CollectibleType.RAINBOW_BABY,
    itemNum: 20,
  },

  // 440
  [RandomBabyType.AFRO]: {
    name: "Afro Baby",
    description: "Starts with D1",
    sprite: "440_baby_afro.png",
    item: CollectibleType.D1,
  },

  // 441
  [RandomBabyType.TV]: {
    name: "TV Baby",
    description: "Mega Blast effect after 6 hits",
    sprite: "441_baby_tv.png",
    requireNumHits: 6,
    class: bc.TVBaby,
  },

  // 442
  [RandomBabyType.TOOTH_HEAD]: {
    name: "Tooth Head Baby",
    description: "Tooth tears",
    sprite: "442_baby_tooth.png",
    num: 3,
    requireTears: true,
    class: bc.ToothHeadBaby,
  },

  // 443
  [RandomBabyType.TIRED]: {
    name: "Tired Baby",
    description: "Starts with 5x Bum Friend",
    sprite: "443_baby_tired.png",
    item: CollectibleType.BUM_FRIEND,
    itemNum: 5,
  },

  // 444
  [RandomBabyType.STEROIDS]: {
    name: "Steroids Baby",
    description: "Forget Me Now on 2nd hit (per room)",
    sprite: "444_baby_steroids.png",
    class: bc.SteroidsBaby,
  },

  // 445
  [RandomBabyType.SOAP_MONSTER]: {
    name: "Soap Monster Baby",
    description: "Starts with Butter",
    sprite: "445_baby_soap_monster.png",
    trinket: TrinketType.BUTTER,
  },

  // 446
  [RandomBabyType.ROJEN_WHITEFOX]: {
    name: "Rojen Whitefox Baby",
    description: "Shield on hit",
    sprite: "446_baby_rojen_whitefox.png",
    class: bc.RojenWhitefoxBaby,
  },

  // 447
  [RandomBabyType.ROCKET]: {
    name: "Rocket Baby",
    description: "Starts with Super Magnet",
    sprite: "447_baby_rocket.png",
    trinket: TrinketType.SUPER_MAGNET,
  },

  // 448
  [RandomBabyType.NURF]: {
    name: "Nurf Baby",
    description: "Starts with 3x Rune Bag",
    sprite: "448_baby_nurf.png",
    item: CollectibleType.RUNE_BAG,
    itemNum: 3,
  },

  // 449
  [RandomBabyType.MUTATED_FISH]: {
    name: "Mutated Fish Baby",
    description: "Summons a Sprinkler every 7 seconds",
    sprite: "449_baby_mutated_fish.png",
    num: 7,
    class: bc.MutatedFishBaby,
  },

  // 450
  [RandomBabyType.MOTH]: {
    name: "Moth Baby",
    description: "Starts with Soy Milk + Ipecac",
    sprite: "450_baby_moth.png",
    item: CollectibleType.SOY_MILK,
    item2: CollectibleType.IPECAC,
    requireTears: true,
  },

  // 451
  [RandomBabyType.BUTTFACE]: {
    name: "Buttface Baby",
    description: "Spawns a Black Poop per enemy killed",
    sprite: "451_baby_buttface.png",
    class: bc.ButtfaceBaby,
  },

  // 452
  [RandomBabyType.FLYING_CANDLE]: {
    name: "Flying Candle Baby",
    description: "Starts with Night Light",
    sprite: "452_baby_flying_candle.png",
    item: CollectibleType.NIGHT_LIGHT,
  },

  // 453
  [RandomBabyType.GRAVEN]: {
    name: "Graven Baby",
    description: "Starts with Level 4 Bumbo (improved)",
    sprite: "453_baby_graven.png",
    item: CollectibleType.BUMBO,
    class: bc.GravenBaby,
  },

  // 454
  [RandomBabyType.GIZZY_CHARGESHOT]: {
    name: "Gizzy Chargeshot Baby",
    description: "Starts with Poke Go",
    sprite: "454_baby_gizzy_chargeshot.png",
    item: CollectibleType.POKE_GO,
    // Adding multiple Poke Gos does nothing.
  },

  // 455
  [RandomBabyType.GREEN_KOOPA]: {
    name: "Green Koopa Baby",
    description: "Shoots bouncy green shells",
    sprite: "455_baby_green_koopa.png",
    num: 4, // Seconds that the shell stays active; must match Red Koopa Baby.
    requireTears: true,
    class: bc.GreenKoopaBaby,
  },

  // 456
  [RandomBabyType.HANDSOME_MR_FROG]: {
    name: "Handsome Mr. Frog Baby",
    description: "Spawns 20 Blue Flies on hit",
    sprite: "456_baby_handsome_mrfrog.png",
    num: 20,
    class: bc.HandsomeMrFrogBaby,
  },

  // 457
  [RandomBabyType.PUMPKIN_GUY]: {
    name: "Pumpkin Guy Baby",
    description: "Starts with Pop",
    sprite: "457_baby_pumpkin_guy.png",
    item: CollectibleType.POP,
    requireTears: true,
  },

  // 458
  [RandomBabyType.RED_KOOPA]: {
    name: "Red Koopa Baby",
    description: "Shoots bouncy & homing red shells",
    sprite: "458_baby_red_koopa.png",
    num: 4, // Seconds that the shell stays active; must match Green Koopa Baby.
    requireTears: true,
    class: bc.RedKoopaBaby,
  },

  // 459
  [RandomBabyType.SAD_BUNNY]: {
    name: "Sad Bunny Baby",
    description: "Accuracy increases tear rate",
    sprite: "459_baby_sad_bunny.png",
    requireTears: true,
    class: bc.SadBunnyBaby,
  },

  // 460
  [RandomBabyType.SATURN_2]: {
    name: "Saturn Baby 2",
    description: "Starts with The Ludovico Technique + Strange Attractor",
    sprite: "460_baby_saturn.png",
    item: CollectibleType.LUDOVICO_TECHNIQUE,
    item2: CollectibleType.STRANGE_ATTRACTOR,
    requireTears: true,
  },

  // 461
  [RandomBabyType.TOAST_BOY]: {
    name: "Toast Boy Baby",
    description: "Starts with 5x Friend Zone",
    sprite: "461_baby_toast_boy.png",
    item: CollectibleType.FRIEND_ZONE,
    itemNum: 5,
  },

  // 462
  [RandomBabyType.VOXDOG]: {
    name: "Voxdog Baby",
    description: "Shockwave tears",
    sprite: "462_baby_voxdog.png",
    requireTears: true,
    class: bc.VoxdogBaby,
  },

  // 463
  [RandomBabyType.N_404]: {
    name: "404 Baby",
    description: "-1 coin/bomb/key on hit",
    sprite: "463_baby_404.png",
    class: bc.N404Baby,
  },

  // 464
  [RandomBabyType.ARROWHEAD]: {
    name: "Arrowhead Baby",
    description: "Starts with Technology Zero + Cupid's Arrow",
    sprite: "464_baby_arrowhead.png",
    item: CollectibleType.TECHNOLOGY_ZERO,
    item2: CollectibleType.CUPIDS_ARROW,
    requireTears: true,
  },

  // 465
  [RandomBabyType.BEANIE]: {
    name: "Beanie Baby",
    description: "Starts with Smelter",
    sprite: "465_baby_beanie.png",
    item: CollectibleType.SMELTER,
  },

  // 466
  [RandomBabyType.BLINDCURSED]: {
    name: "Blindcursed Baby",
    description: "Invisible tears",
    sprite: "466_baby_blindcursed.png",
    requireTears: true,
    class: bc.BlindcursedBaby,
  },

  // 467
  [RandomBabyType.BURNING]: {
    name: "Burning Baby",
    description: "Starts with Fire Mind",
    sprite: "467_baby_burning.png",
    item: CollectibleType.FIRE_MIND,
  },

  // 468
  [RandomBabyType.CURSOR]: {
    name: "Cursor Baby",
    description: "Starts with Pause",
    sprite: "468_baby_cursor.png",
    item: CollectibleType.PAUSE,
  },

  // 469
  [RandomBabyType.FLY]: {
    name: "Fly Baby",
    description: "Mass splitting tears",
    sprite: "469_baby_flybaby.png",
    requireTears: true,
    class: bc.FlyBaby,
  },

  // 470
  [RandomBabyType.HEADPHONE]: {
    name: "Headphone Baby",
    description: "Soundwave tears",
    sprite: "470_baby_headphone.png",
    trinket: TrinketType.FLAT_WORM,
    num: 50,
    requireTears: true,
  },

  // 471
  [RandomBabyType.KNIFE]: {
    name: "Knife Baby",
    description: "Starts with Mom's Knife",
    sprite: "471_baby_knife.png",
    item: CollectibleType.MOMS_KNIFE,
  },

  // 472
  [RandomBabyType.MUFFLERSCARF]: {
    name: "Mufflerscarf Baby",
    description: "All enemies get frozen on hit",
    sprite: "472_baby_mufflerscarf.png",
    class: bc.MufflerscarfBaby,
  },

  // 473
  [RandomBabyType.ROBBERMASK]: {
    name: "Robbermask Baby",
    description: "+1 damage per pickup taken",
    sprite: "473_baby_robbermask.png",
    class: bc.RobbermaskBaby,
  },

  // 474
  [RandomBabyType.SCOREBOARD]: {
    name: "Scoreboard Baby",
    description: "Dies 1 minute after getting hit",
    sprite: "474_baby_scoreboard.png",
    class: bc.ScoreboardBaby,
  },

  // 475
  [RandomBabyType.SO_MANY_EYES]: {
    name: "So Many Eyes Baby",
    description: "Starts with Mutant Spider + The Inner Eye",
    sprite: "475_baby_somanyeyes.png",
    item: CollectibleType.MUTANT_SPIDER,
    item2: CollectibleType.INNER_EYE,
  },

  // 476
  [RandomBabyType.TEXT]: {
    name: "Text Baby",
    description: "Starts with Glitched Crown",
    sprite: "476_baby_text.png",
    item: CollectibleType.GLITCHED_CROWN,
  },

  // 477
  [RandomBabyType.WING]: {
    name: "Wing Baby",
    description: "Starts with White Pony",
    sprite: "477_baby_wing.png",
    item: CollectibleType.WHITE_PONY,
  },

  // 478
  [RandomBabyType.TOOTH]: {
    name: "Tooth Baby",
    description: "Starts with Dead Tooth",
    sprite: "478_baby_tooth.png",
    item: CollectibleType.DEAD_TOOTH,
  },

  // 479
  [RandomBabyType.HAUNT]: {
    name: "Haunt Baby",
    description: "Starts with 10x Lil Haunt",
    sprite: "479_baby_haunt.png",
    item: CollectibleType.LIL_HAUNT,
    itemNum: 10,
  },

  // 480
  [RandomBabyType.IMP_2]: {
    name: "Imp Baby 2",
    description: "Acid tears",
    sprite: "480_baby_imp.png",
    requireTears: true,
    class: bc.ImpBaby2,
  },

  // 481
  [RandomBabyType.N_32_BIT]: {
    name: "32bit Baby",
    description: "No HUD",
    sprite: "481_baby_32bit.png",
    seed: SeedEffect.NO_HUD,
  },

  // 482
  [RandomBabyType.ADVENTURE]: {
    name: "Adventure Baby",
    description: "Starts with Moving Box",
    sprite: "482_baby_adventure.png",
    item: CollectibleType.MOVING_BOX,
  },

  // 483
  [RandomBabyType.BUBBLES]: {
    name: "Bubbles Baby",
    description: "+1 damage per pill used",
    sprite: "483_baby_bubbles.png",
    class: bc.BubblesBaby,
  },

  // 484
  [RandomBabyType.BULB]: {
    name: "Bulb Baby",
    description: "Starts with Vibrant Bulb",
    sprite: "484_baby_bulb.png",
    trinket: TrinketType.VIBRANT_BULB,
  },

  // 485
  [RandomBabyType.COOL_ORANGE]: {
    name: "Cool Orange Baby",
    description: "Summons random missiles",
    sprite: "485_baby_coolorange.png",
    num: 1, // Seconds before a missile comes down on a spawned target.
    class: bc.CoolOrangeBaby,
  },

  // 486
  [RandomBabyType.CRAZY_GHOST]: {
    name: "Crazy Ghost Baby",
    description: "Starts with 20x Ghost Baby",
    sprite: "486_baby_crazyghost.png",
    item: CollectibleType.GHOST_BABY,
    itemNum: 20,
  },

  // 487
  [RandomBabyType.CURSED_PILLOW]: {
    name: "Cursed Pillow Baby",
    description: "Every 4th missed tear causes damage",
    sprite: "487_baby_cursedpillow.png",
    num: 4,
    requireTears: true,
    class: bc.CursedPillowBaby,
  },

  // 488
  [RandomBabyType.EGG]: {
    name: "Egg Baby",
    description: "Random pill effect on hit",
    sprite: "488_baby_egg.png",
    class: bc.EggBaby,
  },

  // 489
  [RandomBabyType.FACTORY]: {
    name: "Factory Baby",
    description: "Starts with Clockwork Assembly",
    sprite: "489_baby_factory.png",
    item: CollectibleTypeCustom.CLOCKWORK_ASSEMBLY,
    class: bc.FactoryBaby,
  },

  // 490
  [RandomBabyType.ERSATZ]: {
    name: "Ersatz Baby",
    description: "Starts with Incubus",
    sprite: "490_baby_ersatz.png",
    item: CollectibleType.INCUBUS,
  },

  // 491
  [RandomBabyType.FUNNY]: {
    name: "Funny Baby",
    description: "Enemies spawn Troll Bombs on death",
    sprite: "491_baby_funny.png",
    class: bc.FunnyBaby,
  },

  // 492
  [RandomBabyType.GAMER]: {
    name: "Gamer Baby",
    description: "Constant Retro Vision pill effect",
    sprite: "492_baby_gamer.png",
    seed: SeedEffect.RETRO_VISION,
  },

  // 493
  [RandomBabyType.GLITTERY_PEACH]: {
    name: "Glittery Peach Baby",
    description: "Teleports to the boss room after 6 hits",
    sprite: "493_baby_glitterypeach.png",
    requireNumHits: 6,
    class: bc.GlitteryPeachBaby,
  },

  // 494
  [RandomBabyType.POMPADOUR]: {
    name: "Pompadour Baby",
    description: "Shrink tears",
    sprite: "494_baby_pompadour.png",
    requireTears: true,
    class: bc.PompadourBaby,
  },

  // 495
  [RandomBabyType.HEAD_KICK]: {
    name: "Head Kick Baby",
    description: "Starts with Kamikaze + explosion immunity",
    sprite: "495_baby_headkick.png",
    item: CollectibleType.KAMIKAZE,
    explosionImmunity: true,
  },

  // 496
  [RandomBabyType.HORN]: {
    name: "Horn Baby",
    description: "Starts with Dark Bum",
    sprite: "496_baby_horn.png",
    item: CollectibleType.DARK_BUM,
  },

  // 497
  [RandomBabyType.ICHOR]: {
    name: "Ichor Baby",
    description: "Starts with 5x Lil Spewer",
    sprite: "497_baby_ichor.png",
    item: CollectibleType.LIL_SPEWER,
    itemNum: 5,
  },

  // 498
  [RandomBabyType.ILL]: {
    name: "Ill Baby",
    description: "Bob's Rotten Head tears",
    sprite: "498_baby_ill.png",
    requireTears: true,
    class: bc.IllBaby,
  },

  // 499
  [RandomBabyType.LAZY]: {
    name: "Lazy Baby",
    description: "Random card effect on hit",
    sprite: "499_baby_lazy.png",
    class: bc.LazyBaby,
  },

  // 500
  [RandomBabyType.MERN]: {
    name: "Mern Baby",
    description: "Double tears",
    sprite: "500_baby_mern.png",
    requireTears: true,
    class: bc.MernBaby,
  },

  // 501
  [RandomBabyType.NECRO]: {
    name: "Necro Baby",
    description: "Starts with Book of the Dead",
    sprite: "501_baby_necro.png",
    item: CollectibleType.BOOK_OF_THE_DEAD,
  },

  // 502
  [RandomBabyType.PEEPING]: {
    name: "Peeping Baby",
    description: "Starts with 8x Bloodshot Eye",
    sprite: "502_baby_peeping.png",
    item: CollectibleType.BLOODSHOT_EYE,
    itemNum: 8,
  },

  // 503
  [RandomBabyType.PENANCE]: {
    name: "Penance Baby",
    description: "Starts with 3x Sworn Protector",
    sprite: "503_baby_penance.png",
    item: CollectibleType.SWORN_PROTECTOR,
    itemNum: 3,
  },

  // 504
  [RandomBabyType.PSYCHIC]: {
    name: "Psychic Baby",
    description: "Starts with Abel; tears come from Abel; 2x damage",
    sprite: "504_baby_psychic.png",
    item: CollectibleType.ABEL,
    requireTears: true,
    class: bc.PsychicBaby,
  },

  // 505
  [RandomBabyType.PUPPET]: {
    name: "Puppet Baby",
    description: "Starts with Salvation",
    sprite: "505_baby_puppet.png",
    item: CollectibleType.SALVATION,
  },

  // 506
  [RandomBabyType.REAPER]: {
    name: "Reaper Baby",
    description: "Spawns a random rune on hit",
    sprite: "506_baby_reaper.png",
    class: bc.ReaperBaby,
  },

  // 507
  [RandomBabyType.ROAD_KILL]: {
    name: "Road Kill Baby",
    description: "Starts with Pointy Rib x3 + blindfolded",
    sprite: "507_baby_roadkill.png",
    item: CollectibleType.POINTY_RIB,
    num: 3,
    blindfolded: true,
  },

  // 508
  [RandomBabyType.SAUSAGE_LOVER]: {
    name: "Sausage Lover Baby",
    description: "Summons Monstro every 5 seconds",
    sprite: "508_baby_sausagelover.png",
    class: bc.SausageLoverBaby,
  },

  // 509
  [RandomBabyType.SCRIBBLE]: {
    name: "Scribble Baby",
    description: "Starts with Lead Pencil",
    sprite: "509_baby_scribble.png",
    item: CollectibleType.LEAD_PENCIL,
    requireTears: true,
  },

  // 510
  [RandomBabyType.STAR_PLANT]: {
    name: "Star Plant Baby",
    description: "Starts with Dim Bulb",
    sprite: "510_baby_starplant.png",
    trinket: TrinketType.DIM_BULB,
  },

  // 511
  [RandomBabyType.TWITCHY]: {
    name: "Twitchy Baby",
    description: "Tear rate oscillates",
    sprite: "511_baby_twitchy.png",
    requireTears: true,
    num: 60, // Time between fire rate changes, in game frames
    min: -4, // Tear delay change
    max: 4, // Tear delay change
    class: bc.TwitchyBaby,
  },

  // 512
  [RandomBabyType.WITCH]: {
    name: "Witch Baby",
    description: "Starts with Crystal Ball (uncharged)",
    sprite: "512_baby_witch.png",
    item: CollectibleType.CRYSTAL_BALL,
    uncharged: true,
  },

  // 513
  [RandomBabyType.WORKSHOP]: {
    name: "Workshop Baby",
    description: "Starts with Humbling Bundle",
    sprite: "513_baby_workshop.png",
    item: CollectibleType.HUMBLING_BUNDLE,
  },

  // 514
  [RandomBabyType.HOOLIGAN]: {
    name: "Hooligan Baby",
    description: "Double enemies",
    sprite: "514_baby_hooligan.png",
    class: bc.HooliganBaby,
  },

  // 515
  [RandomBabyType.HALF_SPIDER]: {
    name: "Half Spider Baby",
    description: "Starts with 3x Pretty Fly",
    sprite: "515_baby_halfspider.png",
    item: CollectibleType.HALO_OF_FLIES,
    itemNum: 2,
    class: bc.HalfSpiderBaby,
  },

  // 516
  [RandomBabyType.SILLY]: {
    name: "Silly Baby",
    description: "Constant I'm Excited pill effect",
    sprite: "516_baby_silly.png",
    class: bc.SillyBaby,
  },

  // 517
  [RandomBabyType.MASTER_COOK]: {
    name: "Master Cook Baby",
    description: "Egg tears",
    sprite: "517_baby_mastercook.png",
    requireTears: true,
    class: bc.MasterCookBaby,
  },

  // 518
  [RandomBabyType.GREEN_PEPPER]: {
    name: "Green Pepper Baby",
    description: "Starts with Abyss",
    sprite: "518_baby_greenpepper.png",
    item: CollectibleType.ABYSS,
  },

  // 519
  [RandomBabyType.BAGGY_CAP]: {
    name: "Baggy Cap Baby",
    description: "Cannot bomb through rooms",
    sprite: "519_baby_baggycap.png",
    requireBombs: true,
    class: bc.BaggyCapBaby,
  },

  // 520
  [RandomBabyType.STYLISH]: {
    name: "Stylish Baby",
    description: "Starts with Store Credit",
    sprite: "520_baby_stylish.png",
    trinket: TrinketType.STORE_CREDIT,
  },

  // -----------------------------------------------------------------------------------------------

  // 521
  [RandomBabyType.FOUND_SOUL]: {
    name: "Found Soul Baby",
    description: "Starts with a Dark Esau",
    sprite: "059_found_soul.png",
    class: bc.FoundSoulBaby,
  },

  // 522
  [RandomBabyType.LOST_WHITE]: {
    name: "Lost White Baby",
    description: "Eternal D6 effect on hit",
    sprite: "60_baby_lost_white.png",
    class: bc.LostWhiteBaby,
  },

  // 523
  [RandomBabyType.LOST_BLACK]: {
    name: "Lost Black Baby",
    description: "Spindown Dice effect on hit",
    sprite: "61_baby_lost_black.png",
    class: bc.LostBlackBaby,
  },

  // 524
  [RandomBabyType.LOST_BLUE]: {
    name: "Lost Blue Baby",
    description: "D10 effect on hit", // Re-roll enemies
    sprite: "62_baby_lost_blue.png",
    class: bc.LostBlueBaby,
  },

  // 525
  [RandomBabyType.LOST_GREY]: {
    name: "Lost Grey Baby",
    description: "D7 effect on hit", // Restart the room
    sprite: "63_baby_lost_grey.png",
    class: bc.LostGreyBaby,
  },

  // 526
  [RandomBabyType.WISP_2]: {
    name: "Wisp Baby 2",
    description: "Starts with Book of Virtues",
    sprite: "064_baby_wisp.png",
    item: CollectibleType.BOOK_OF_VIRTUES,
  },

  // 527
  [RandomBabyType.DOUBLE]: {
    name: "Double Baby",
    description: "Starts with Flip",
    sprite: "065_baby_double.png",
    item: CollectibleType.FLIP,
  },

  // 528
  [RandomBabyType.GLOWING]: {
    name: "Glowing Baby",
    description: "Starts with Monstrance",
    sprite: "066_baby_glowing.png",
    item: CollectibleType.MONSTRANCE,
  },

  // 529
  [RandomBabyType.ILLUSION]: {
    name: "Illusion Baby",
    description: "Spawns a Crane Game on hit",
    sprite: "067_baby_illusion.png",
    class: bc.IllusionBaby,
  },

  // 530
  [RandomBabyType.HOPE]: {
    name: "Hope Baby",
    description: "Starts with Found Soul",
    sprite: "068_baby_hope.png",
    trinket: TrinketType.FOUND_SOUL,
  },

  // 531
  [RandomBabyType.SOLOMONS_A]: {
    name: "Solomon's Baby A",
    description: "Can't shoot right",
    sprite: "069_baby_solomon_a.png",
    class: bc.SolomonsBabyA,
  },

  // 532
  [RandomBabyType.SOLOMONS_B]: {
    name: "Solomon's Baby B",
    description: "Can't shoot left",
    sprite: "070_baby_solomon_b.png",
    class: bc.SolomonsBabyB,
  },

  // -----------------------------------------------------------------------------------------------

  // 533
  [RandomBabyType.THIRTEENTH]: {
    name: "Thirteenth Baby",
    description: "Starts with Sacrificial Dagger",
    sprite: "533_baby_thirteenth.png",
    item: CollectibleType.SACRIFICIAL_DAGGER,
  },

  // 534
  [RandomBabyType.BERRY]: {
    name: "Berry Baby",
    description: "Starts with Red Stew",
    sprite: "534_baby_goldberry.png",
    item: CollectibleType.RED_STEW,
  },

  // 535
  [RandomBabyType.EYEBAT]: {
    name: "Eyebat Baby",
    description: "Floors are reversed",
    sprite: "535_baby_eyebat.png",
    class: bc.EyebatBaby,
  },

  // 536
  [RandomBabyType.BABY_IS_YOU]: {
    name: "Baby Is You",
    description: "Starts with Luna",
    sprite: "536_baby_isyou.png",
    item: CollectibleType.LUNA,
  },

  // 537
  [RandomBabyType.VESSEL]: {
    name: "Vessel Baby",
    description: "Starts with 5x Worm Friend",
    sprite: "537_baby_vessel.png",
    item: CollectibleType.WORM_FRIEND,
    itemNum: 5,
  },

  // 538
  [RandomBabyType.ROCK]: {
    name: "Rock Baby",
    description: "Starts with Terra",
    sprite: "538_baby_rock.png",
    item: CollectibleType.TERRA,
  },

  // 539
  [RandomBabyType.JANITOR]: {
    name: "Janitor Baby",
    description: "Starts with Aquarius + Playdough Cookie",
    sprite: "539_baby_janitor.png",
    item: CollectibleType.AQUARIUS,
    item2: CollectibleType.PLAYDOUGH_COOKIE,
  },

  // 540
  [RandomBabyType.MEATY]: {
    name: "Meaty Baby",
    description: "Starts with Mars",
    sprite: "540_baby_meaty.png",
    item: CollectibleType.MARS,
  },

  // 541
  [RandomBabyType.PIG]: {
    name: "Pig Baby",
    description: "Starts with Bloody Gust",
    sprite: "541_baby_pig.png",
    item: CollectibleType.BLOODY_GUST,
  },

  // 542
  [RandomBabyType.PEGASUS]: {
    name: "Pegasus Baby",
    description: "3x Keeper's Box effect on room clear",
    sprite: "542_baby_pegasus.png",
    num: 3,
    class: bc.PegasusBaby,
  },

  // 543
  [RandomBabyType.MR_E]: {
    name: "Mr. E Baby",
    description: "Starts with Purgatory",
    sprite: "543_baby_mre.png",
    item: CollectibleType.PURGATORY,
  },

  // 544
  [RandomBabyType.SLAB]: {
    name: "Slab Baby",
    description: "Starts with Bag of Crafting",
    sprite: "544_baby_slab.png",
    item: CollectibleType.BAG_OF_CRAFTING,
  },

  // 545
  [RandomBabyType.POG]: {
    name: "Pog Baby",
    description: "Starts with Sacred Orb",
    sprite: "545_baby_pog.png",
    item: CollectibleType.SACRED_ORB,
  },

  // 546
  [RandomBabyType.HIVE_KING]: {
    name: "Hive King Baby",
    description: "Giant cell effect on room clear",
    sprite: "546_baby_hiveking.png",
    class: bc.HiveKingBaby,
  },

  // 547
  [RandomBabyType.PILL_SHIP]: {
    name: "Pill Ship Baby",
    description: "Starts with Neptunus",
    sprite: "547_baby_pillship.png",
    item: CollectibleType.NEPTUNUS,
  },

  // 548
  [RandomBabyType.POINT]: {
    name: "Point Baby",
    description: "SUPERHOT",
    sprite: "548_baby_point.png",
    seed: SeedEffect.SUPER_HOT,
  },

  // 549
  [RandomBabyType.WYRM]: {
    name: "Wyrm Baby",
    description: "Starts with C Section",
    sprite: "549_baby_gunwyrm.png",
    item: CollectibleType.C_SECTION,
  },

  // 550
  [RandomBabyType.BULLET]: {
    name: "Bullet Baby",
    description: "Starts with Rocket in a Jar + golden bomb + blindfolded",
    sprite: "550_baby_bullet.png",
    item: CollectibleType.ROCKET_IN_A_JAR,
    goldenBomb: true,
    blindfolded: true,
  },

  // 551
  [RandomBabyType.PURPLE_HORSE]: {
    name: "Purple Horse Baby",
    description: "Starts with Blessed Penny",
    sprite: "551_baby_purplehorse.png",
    trinket: TrinketType.BLESSED_PENNY,
  },

  // 552
  [RandomBabyType.KOALA]: {
    name: "Koala Baby",
    description: "Genesis effect after 6 hits",
    sprite: "552_baby_koala.png",
    requireNumHits: 6,
    class: bc.KoalaBaby,
  },

  // 553
  [RandomBabyType.CLIFF_HANGER]: {
    name: "Cliff Hanger Baby",
    description: "Starts with Options?",
    sprite: "553_baby_cliffhanger.png",
    item: CollectibleType.OPTIONS,
  },

  // 554
  [RandomBabyType.PENGUIN]: {
    name: "Penguin Baby",
    description: "Starts with Blood Puppy",
    sprite: "554_baby_penguin.png",
    item: CollectibleType.BLOOD_PUPPY,
  },

  // 555
  [RandomBabyType.KINDA_LOVABLE]: {
    name: "Kinda Loveable Baby",
    description: "Spawns a Lovers card on hit",
    sprite: "555_baby_kindaloveable.png",
    class: bc.KindaLovableBaby,
  },

  // 556
  [RandomBabyType.CURSED_ROOM]: {
    name: "Cursed Room Baby",
    description: "Starts with Holy Mantle + Curse of the Cursed",
    sprite: "556_baby_cursedroom.png",
    item: CollectibleType.HOLY_MANTLE,
    class: bc.CursedRoomBaby,
  },

  // 557
  [RandomBabyType.PROTO]: {
    name: "Proto Baby",
    description: "Starts with Brimstone + Haemolacria",
    sprite: "557_baby_proto.png",
    item: CollectibleType.BRIMSTONE,
    item2: CollectibleType.HAEMOLACRIA,
    requireTears: true,
  },

  // 558
  [RandomBabyType.FINGER]: {
    name: "Finger Baby",
    description: "All items from the Secret Room pool",
    sprite: "558_baby_finger.png",
    class: bc.FingerBaby,
  },

  // 559
  [RandomBabyType.BALD]: {
    name: "Bald Baby",
    description: "All items from the Boss Room pool",
    sprite: "559_baby_bald.png",
    class: bc.BaldBaby,
  },

  // 560
  [RandomBabyType.HEX]: {
    name: "Hex Baby",
    description: "Starts with Eye of the Occult",
    sprite: "560_baby_hex.png",
    item: CollectibleType.EYE_OF_THE_OCCULT,
  },

  // 561
  [RandomBabyType.SINGING]: {
    name: "Singing Baby",
    description: "Starts with Astral Projection",
    sprite: "561_baby_singing.png",
    item: CollectibleType.ASTRAL_PROJECTION,
  },

  // 562
  [RandomBabyType.JUNK]: {
    name: "Junk Baby",
    description: "Starts with Binge Eater",
    sprite: "562_baby_junk.png",
    item: CollectibleType.BINGE_EATER,
  },

  // 563
  [RandomBabyType.LUCKY]: {
    name: "Lucky Baby",
    description: "Starts with The Stairway",
    sprite: "563_baby_lucky.png",
    item: CollectibleType.STAIRWAY,
  },

  // 564
  [RandomBabyType.FINGER_2]: {
    name: "Finger Baby 2",
    description: "Starts with Urn of Souls",
    sprite: "564_baby_finger.png",
    item: CollectibleType.URN_OF_SOULS,
  },

  // 565
  [RandomBabyType.SUCKY_2]: {
    name: "Sucky Baby 2",
    description: "Starts with Psy Fly",
    sprite: "565_baby_sucky.png",
    item: CollectibleType.PSY_FLY,
  },

  // 566
  [RandomBabyType.DOOR_MIMIC]: {
    name: "Door Mimic Baby",
    description: "Starts with Bot Fly",
    sprite: "566_baby_doormimic.png", // cspell:ignore doormimic
    item: CollectibleType.BOT_FLY,
  },

  // 567
  [RandomBabyType.KYUUKYUU]: {
    name: "Kyuukyuu Baby",
    description: "Starts with Hungry Soul",
    sprite: "567_baby_kyuukyuu.png",
    item: CollectibleType.HUNGRY_SOUL,
  },

  // 568
  [RandomBabyType.MOON_JELLY]: {
    name: "Moon Jelly Baby",
    description: "Starts with Saturnus",
    sprite: "568_baby_moonjelly.png", // cspell:ignore moonjelly
    item: CollectibleType.SATURNUS,
  },

  // 569
  [RandomBabyType.EXCELSIOR]: {
    name: "Excelsior Baby",
    description: "Starts with Revelation",
    sprite: "569_baby_excelsior.png",
    item: CollectibleType.REVELATION,
  },

  // 570
  [RandomBabyType.PAINFUL]: {
    name: "Painful Baby",
    description: "Starts with Soy Milk + booger tears",
    sprite: "570_baby_painful.png",
    item: CollectibleType.SOY_MILK,
    requireTears: true,
    class: bc.PainfulBaby,
  },

  // 571
  [RandomBabyType.POINTLESS]: {
    name: "Pointless Baby",
    description: "Items are replaced with 6 cards",
    sprite: "571_baby_pointless.png",
    num: 6,
    class: bc.PointlessBaby,
  },

  // 572
  [RandomBabyType.DOLEFUL]: {
    name: "Doleful Baby",
    description: "Starts with The Intruder",
    sprite: "572_baby_doleful.png",
    item: CollectibleType.INTRUDER,
  },

  // 573
  [RandomBabyType.CUBIC]: {
    name: "Cubic Baby",
    description: "Starts with Brimstone Bombs",
    sprite: "573_baby_cubic.png",
    item: CollectibleType.BRIMSTONE_BOMBS,
  },

  // 574
  [RandomBabyType.FOOD_REVIEWER]: {
    name: "Food Reviewer Baby",
    description: "All items are food items",
    sprite: "574_baby_foodreviewer.png", // cspell:ignore foodreviewer
    class: bc.FoodReviewerBaby,
  },

  // -----------------------------------------------------------------------------------------------

  // 575
  [RandomBabyType.FALLING]: {
    name: "Falling Baby",
    description: "Starts with Twisted Pair",
    // There are two sprites with the prefix of "490_" and this is the second one, so we assign it
    // at the end.
    sprite: "490_baby_falling.png",
    item: CollectibleType.TWISTED_PAIR,
  },

  // -----------------------------------------------------------------------------------------------

  // 576
  [RandomBabyType.BROTHER_BOBBY]: {
    name: "Brother Bobby", // CollectibleType.BROTHER_BOBBY (8)
    description: "Slings Godhead aura (improved)",
    sprite: "familiar_shooters_01_brotherbobby.png",
    item: CollectibleType.MOMS_KNIFE,
    requireTears: true,
    class: bc.BrotherBobby,
  },

  // 577
  [RandomBabyType.SISTER_MAGGY]: {
    name: "Sister Maggy", // CollectibleType.SISTER_MAGGY (67)
    description: "Loses last item on 2nd hit (per room)",
    sprite: "familiar_shooters_07_sistermaggie.png",
    num: 2,
    class: bc.SisterMaggy,
  },

  // 578
  [RandomBabyType.ROBO]: {
    name: "Robo-Baby", // CollectibleType.ROBO_BABY (95)
    description: "Starts with Technology",
    sprite: "familiar_shooters_06_robobaby.png",
    item: CollectibleType.TECHNOLOGY,
  },

  // 579
  [RandomBabyType.LITTLE_GISH]: {
    name: "Little Gish", // CollectibleType.LITTLE_GISH (99)
    description: "All items from the Curse Room pool",
    sprite: "familiar_shooters_04_littlegish.png",
    class: bc.LittleGish,
  },

  // 580
  [RandomBabyType.LITTLE_STEVEN]: {
    name: "Little Steven", // CollectibleType.LITTLE_STEVEN (100)
    description:
      "Starts with 20 Ring Cap + golden bomb + blindfolded + explosion immunity",
    sprite: "familiar_shooters_05_littlesteve.png",
    trinket: TrinketType.RING_CAP,
    num: 20,
    goldenBomb: true,
    blindfolded: true,
    explosionImmunity: true,
  },

  // 581
  [RandomBabyType.DEMON]: {
    name: "Demon Baby", // CollectibleType.DEMON_BABY (113)
    description: "Free devil deals",
    sprite: "familiar_shooters_02_demonbaby.png",
    class: bc.DemonBaby,
  },

  // 582
  [RandomBabyType.GHOST]: {
    name: "Ghost Baby", // CollectibleType.GHOST_BABY (163)
    description: "All items from the shop pool",
    sprite: "familiar_shooters_09_ghostbaby.png",
    class: bc.GhostBaby,
  },

  // 583
  [RandomBabyType.HARLEQUIN]: {
    name: "Harlequin Baby", // CollectibleType.HARLEQUIN_BABY (167)
    description: "Starts with The Wiz",
    sprite: "familiar_shooters_10_harlequinbaby.png",
    item: CollectibleType.WIZ,
    requireTears: true,
  },

  // 584
  [RandomBabyType.RAINBOW]: {
    name: "Rainbow Baby", // CollectibleType.RAINBOW_BABY (174)
    description: "Chest per enemy killed",
    sprite: "familiar_shooters_11_rainbowbaby.png",
    class: bc.RainbowBaby,
  },

  // 585
  [RandomBabyType.ABEL]: {
    name: "Abel", // CollectibleType.ABEL (188)
    description: "Every 5th missed tear causes paralysis",
    sprite: "familiar_shooters_08_abel.png",
    num: 5,
    requireTears: true,
    class: bc.Abel,
  },

  // 586
  [RandomBabyType.ROBO_2]: {
    name: "Robo-Baby 2.0", // CollectibleType.ROBO_BABY_2 (267)
    description: "Starts with Undefined (uncharged)",
    sprite: "familiar_shooters_267_robobaby20.png",
    item: CollectibleType.UNDEFINED,
    uncharged: true,
  },

  // 587
  [RandomBabyType.ROTTEN]: {
    name: "Rotten Baby", // CollectibleType.ROTTEN_BABY (268)
    description: "Shoots Blue Flies + flight",
    sprite: "familiar_shooters_268_rottenbaby.png",
    flight: true,
    requireTears: true,
    class: bc.RottenBaby,
  },

  // 588
  [RandomBabyType.LIL_BRIMSTONE]: {
    name: "Lil Brimstone", // CollectibleType.LIL_BRIMSTONE (275)
    description: "Starts with Brimstone",
    // We cannot use the vanilla sprite since it has extra frames for charging.
    sprite: "familiar_shooters_275_lilbrimstone_custom.png",
    item: CollectibleType.BRIMSTONE,
  },

  // 589
  [RandomBabyType.MONGO]: {
    name: "Mongo Baby", // CollectibleType.MONGO_BABY (322)
    description: "All items from the Angel Room pool",
    sprite: "familiar_shooters_322_mongobaby.png",
    class: bc.MongoBaby,
  },

  // 590
  [RandomBabyType.INCUBUS]: {
    name: "Incubus", // CollectibleType.INCUBUS (360)
    description: "All items from the Devil Room pool",
    sprite: "familiar_shooters_80_incubus.png",
    class: Incubus,
  },

  // 591
  [RandomBabyType.FATES_REWARD]: {
    name: "Fate's Reward", // CollectibleType.FATES_REWARD (361)
    description: "Items cost money",
    sprite: "familiar_shooters_81_fatesreward.png",
    class: bc.FatesReward,
  },

  // 592
  [RandomBabyType.SERAPHIM]: {
    name: "Seraphim", // CollectibleType.SERAPHIM (390)
    description: "Censer aura",
    sprite: "familiars_shooters_92_seraphim.png",
    item: CollectibleType.CENSER,
    class: bc.Seraphim,
  },

  // 593
  [RandomBabyType.LIL_LOKI]: {
    name: "Lil Loki", // CollectibleType.LIL_LOKI (435)
    description: "Cross tears",
    sprite: "familiar_097_shooters_lilloki.png",
    requireTears: true,
    class: bc.LilLoki,
  },

  // 594
  [RandomBabyType.LIL_MONSTRO]: {
    name: "Lil Monstro", // CollectibleType.LIL_MONSTRO (471)
    description: "Starts with Monstro's Lung",
    // We cannot use the vanilla sprite since it does not follow the same format.
    sprite: "familiar_108_lilmonstro_custom.png",
    item: CollectibleType.MONSTROS_LUNG,
  },

  // 595
  [RandomBabyType.BOILED]: {
    name: "Boiled Baby", // CollectibleType.BOILED_BABY (607)
    description: "All items from the Ultra Secret Room pool",
    // We cannot use the vanilla sprite since it is unidirectional.
    sprite: "003.208_boilbaby_custom.png",
    class: bc.BoiledBaby,
  },

  // 596
  [RandomBabyType.FREEZER]: {
    name: "Freezer Baby", // CollectibleType.FREEZER_BABY (608)
    description: "Ice tears",
    sprite: "003.209_freezerbaby.png",
    class: bc.FreezerBaby,
  },

  // 597
  [RandomBabyType.LIL_ABADDON]: {
    name: "Lil Abaddon", // CollectibleType.LIL_ABADDON (679)
    description: "Starts with Devil's Crown",
    // The vanilla spritesheet has a different format than the other familiars, so we have to
    // manually make a custom one.
    sprite: "familiar_lil_abaddon_custom.png",
    trinket: TrinketType.DEVILS_CROWN,
  },

  // 598
  [RandomBabyType.TWISTED]: {
    name: "Twisted Baby", // CollectibleType.TWISTED_PAIR (698)
    description: "Spore tears",
    sprite: "familiar_twisted_pair_custom.png",
    class: bc.TwistedBaby,
  },

  // 599
  [RandomBabyType.ESAU_JR]: {
    name: "Esau Jr. Baby",
    description: "Soul of Jacob and Esau effect on hit",
    sprite: "familiar_esau_jr.png",
    class: bc.EsauJrBaby,
  },

  // 600
  [RandomBabyType.GELLO]: {
    name: "Gello", // CollectibleType.GELLO (728)
    description: "Starts with Sol",
    // In vanilla, there are spritesheets for each component of Gello, so this is a custom
    // spritesheet that was manually compiled by Gamonymous.
    sprite: "familiar_gello_custom.png",
    item: CollectibleType.SOL,
  },

  // 601
  [RandomBabyType.SIREN_SHOOTER]: {
    name: "Siren Shooter",
    description: "Spawns a pedestal item after 6 hits",
    sprite: "familiar_siren_shooter.png",
    num: 6,
    class: bc.SirenShooter,
  },

  // 602
  [RandomBabyType.INVISIBLE]: {
    name: "Invisible Baby",
    description: "Invisibility",
    // This file does not actually exist, but we cannot specify a blank string.
    sprite: "invisible_baby.png",
    class: bc.InvisibleBaby,
  },
} as const satisfies HasAllEnumKeys<RandomBabyType, BabyDescription>;
