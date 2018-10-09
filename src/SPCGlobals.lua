local SPCGlobals  = {}

--
-- Variables
--

SPCGlobals.run = {}
SPCGlobals.pastBabies = {}
SPCGlobals.debug = 0

function SPCGlobals:InitRun()
  -- Local variables
  local game = Game()
  local level = game:GetLevel()
  local levelSeed = level:GetDungeonPlacementSeed()

  -- Add the last baby to the pastBabies table
  if SPCGlobals.run.babyType ~= nil and
     SPCGlobals.run.babyType ~= 0 then

    local elapsedTime = Isaac.GetTime() - SPCGlobals.run.startedTime
    if elapsedTime > 15000 then -- 15 seconds
      SPCGlobals.pastBabies[#SPCGlobals.pastBabies + 1] = SPCGlobals.run.babyType
      if #SPCGlobals.pastBabies > 100 then -- We only want to remember 100 babies
        table.remove(SPCGlobals.pastBabies, 1)
      end
      Isaac.DebugString("Added baby " .. tostring(SPCGlobals.run.babyType) .. " to the past babies table.")
    end
  end

  -- Reset some variables to defaults
  SPCGlobals.run = {
    -- General run-based variables
    startedTime          = Isaac.GetTime(),
    babyType             = 0,
    drawIntro            = false,
    storedItem           = 0,
    storedItemCharge     = 0,
    storedTrinket        = 0,
    queuedItems          = false,
    passiveItems         = {}, -- Keep track of all of the pedestal items that we pick up over the course of the run
    animation            = "",
    randomSeed           = levelSeed,
    invulnerable         = false, -- Used to make the player temporarily invulnerable
    invulnerabilityFrame = 0, -- Used to make the player temporarily invulnerable
    dealingExtraDamage   = false,

    -- Tracking per floor
    currentFloor             = 0,
    -- We start at 0 so that we can trigger the PostNewRoom callback after the PostNewLevel callback
    currentFloorType         = 0, -- We need to track this because we can go from Cathedral to Sheol, for example
    currentFloorFrame        = 0,
    currentFloorRoomsEntered = 0,
    replacedPedestals        = {},
    trinketGone              = false,

    -- Tracking per room
    roomClear           = true,
    roomRNG             = 0,
    roomPseudoClear     = true,
    roomDoorsModified   = {},
    roomButtonsPushed   = false,
    roomClearDelayFrame = 0,
    lastRoomIndex       = 0,
    currentRoomIndex    = 0,

    -- Baby-specific variables
    babyBool         = false,
    babyCounters     = 0,
    babyCountersRoom = 0,
    babyFrame        = 0,
    babyTearInfo     = {
      tear     = 1,
      frame    = 0,
      velocity = Vector(0, 0),
    },
    babyNPC = {
      type    = 0,
      variant = 0,
      subType = 0,
    },
    killedPoops = {},
    debug       = false,

    -- Item-specific variables
    clockworkAssembly = false,
  }
end

--
-- Functions
--

-- From: http://lua-users.org/wiki/SimpleRound
function SPCGlobals:Round(num, numDecimalPlaces)
  local mult = 10 ^ (numDecimalPlaces or 0)
  return math.floor(num * mult + 0.5) / mult
end

function SPCGlobals:GetItemConfig(itemID)
  -- Local variables
  local itemConfig = Isaac.GetItemConfig()

  if itemID == 0 then
    return 0
  end
  return itemConfig:GetCollectible(itemID)
end

-- Find out how many charges this item has
function SPCGlobals:GetItemMaxCharges(itemID)
  return SPCGlobals:GetItemConfig(itemID).MaxCharges
end

function SPCGlobals:IncrementRNG(seed)
  -- The game expects seeds in the range of 0 to 4294967295
  local rng = RNG()
  rng:SetSeed(seed, 35)
  -- This is the ShiftIdx that blcd recommended after having reviewing the game's internal functions
  rng:Next()
  local newSeed = rng:GetSeed()
  return newSeed
end

function SPCGlobals:InsideSquare(pos1, pos2, squareSize)
  if pos1.X >= pos2.X - squareSize and
     pos1.X <= pos2.X + squareSize and
     pos1.Y >= pos2.Y - squareSize and
     pos1.Y <= pos2.Y + squareSize then

    return true
  else
    return false
  end
end

function SPCGlobals:GridToPos(x, y)
  local game = Game()
  local room = game:GetRoom()
  x = x + 1
  y = y + 1
  return room:GetGridPosition(y * room:GetGridWidth() + x)
end

--
-- Constants
--

-- The sprite value is not currently used, but it can be used as a quick reference to see what number the co-op baby is
SPCGlobals.babies = {
  {
    name = "Love Baby",
    description = "Spawns a random heart per room cleared",
    sprite = "001_baby_love.png",
  },
  {
    name = "Bloat Baby",
    description = "Starts with ???'s Only Friend + blindfolded",
    sprite = "002_baby_bloat.png",
    item = CollectibleType.COLLECTIBLE_BLUEBABYS_ONLY_FRIEND, -- 320
    blindfolded = true,
  },
  {
    name = "Water Baby",
    description = "Starts with Isaac's Tears (improved)",
    sprite = "003_baby_water.png",
    item = CollectibleType.COLLECTIBLE_ISAACS_TEARS, -- 323
  },
  {
    name = "Psy Baby",
    description = "Starts with Spoon Bender",
    sprite = "004_baby_psy.png",
    item = CollectibleType.COLLECTIBLE_SPOON_BENDER, -- 3
  },
  {
    name = "Cursed Baby",
    description = "Starts with Cursed Eye",
    sprite = "005_baby_cursed.png",
    item = CollectibleType.COLLECTIBLE_CURSED_EYE, -- 316
  },
  {
    name = "Troll Baby",
    description = "Spawns a Troll Bomb every 3 seconds",
    sprite = "006_baby_troll.png",
  },
  {
    name = "Ybab Baby",
    description = "Starts with Analog Stick",
    sprite = "007_baby_ybab.png",
    item = CollectibleType.COLLECTIBLE_ANALOG_STICK, -- 465
  },
  {
    name = "Cockeyed Baby",
    description = "Shoots extra tears with random velocity",
    sprite = "008_baby_cockeyed.png",
  },
  {
    name = "Host Baby",
    description = "Spawns 10 Blue Spiders on hit",
    sprite = "009_baby_host.png",
  },
  {
    name = "Lost Baby",
    description = "Starts with Holy Mantle + Lost-style health",
    sprite = "010_baby_lost.png",
    item = CollectibleType.COLLECTIBLE_HOLY_MANTLE, -- 313
  },
  {
    name = "Cute Baby",
    description = "-1 damage per pickup taken",
    sprite = "011_baby_cute.png",
    item = CollectibleType.COLLECTIBLE_MAGGYS_BOW, -- 312
  },
  {
    name = "Crow Baby",
    description = "Starts with Dead Bird (improved)",
    sprite = "012_baby_crow.png",
    item = CollectibleType.COLLECTIBLE_DEAD_BIRD, -- 117
  },
  {
    name = "Shadow Baby",
    description = "Devil Rooms / Angel Rooms go to the Black Market instead",
    sprite = "013_baby_shadow.png",
  },
  {
    name = "Glass Baby",
    description = "Spawns a random pickup on hit",
    sprite = "014_baby_glass.png",
  },
  {
    name = "Gold Baby",
    description = "Starts with Midas' Touch + rooms are gold",
    sprite = "015_baby_gold.png",
    item = CollectibleType.COLLECTIBLE_MIDAS_TOUCH, -- 202
  },
  {
    name = "Cy-Baby",
    description = "Has oribiting laser ring",
    sprite = "016_baby_cy.png",
  },
  {
    name = "Bean Baby",
    description = "Teleport to starting room on hit",
    sprite = "017_baby_bean.png",
  },
  {
    name = "Mag Baby",
    description = "Confusion tears",
    sprite = "018_baby_mag.png",
  },
  {
    name = "Wrath Baby",
    description = "Anarchist Cookbook effect every 10 seconds",
    sprite = "019_baby_wrath.png",
  },
  {
    name = "Wrapped Baby",
    description = "5x Kamikaze! effect on hit",
    sprite = "020_baby_wrapped.png",
  },
  {
    name = "Begotten Baby",
    description = "Starts with Eve's Mascara",
    sprite = "021_baby_begotten.png",
    item = CollectibleType.COLLECTIBLE_EVES_MASCARA, -- 310
  },
  {
    name = "Dead Baby",
    description = "Needle tears",
    sprite = "022_baby_dead.png",
  },
  {
    name = "Fighting Baby",
    description = "Destroying machines gives items",
    sprite = "023_baby_fighting.png",
  },
  {
    name = "-0- Baby",
    description = "Invulnerability",
    sprite = "024_baby_0.png",
  },
  {
    name = "Glitch Baby",
    description = "Starts with 40x GB Bug",
    sprite = "025_baby_glitch.png",
    item = CollectibleType.COLLECTIBLE_GB_BUG, -- 405
    itemNum = 40,
  },
  {
    name = "Magnet Baby",
    description = "Starts with Magneto",
    sprite = "026_baby_magnet.png",
    item = CollectibleType.COLLECTIBLE_MAGNETO, -- 53
  },
  {
    name = "Black Baby",
    description = "Curse Room doors in uncleared rooms",
    sprite = "027_baby_black.png",
  },
  {
    name = "Red Baby",
    description = "Starts with 5x Distant Admiration",
    sprite = "028_baby_red.png",
    item = CollectibleType.COLLECTIBLE_DISTANT_ADMIRATION, -- 57
    itemNum = 5,
  },
  {
    name = "White Baby",
    description = "Starts with Hallowed Ground",
    sprite = "029_baby_white.png",
    item = CollectibleType.COLLECTIBLE_HALLOWED_GROUND, -- 543
  },
  {
    name = "Blue Baby",
    description = "Sprinkler tears",
    sprite = "030_baby_blue.png",
    blindfolded = true,
  },
  {
    name = "Rage Baby",
    description = "Starts with Lusty Blood",
    sprite = "031_baby_rage.png",
    item = CollectibleType.COLLECTIBLE_LUSTY_BLOOD, -- 411
  },
  {
    name = "Cry Baby",
    description = "Enemies are fully healed on hit",
    sprite = "032_baby_cry.png",
  },
  {
    name = "Yellow Baby",
    description = "Lemon Party effect on hit",
    sprite = "033_baby_yellow.png",
  },
  {
    name = "Long Baby",
    description = "Flat tears",
    sprite = "034_baby_long.png",
  },
  {
    name = "Green Baby",
    description = "Booger tears",
    sprite = "035_baby_green.png",
  },
  {
    name = "Lil' Baby",
    description = "Starts with 3x Lil Delirium",
    sprite = "036_baby_lil.png",
    item = CollectibleType.COLLECTIBLE_LIL_DELIRIUM, -- 519
    itemNum = 3,
  },
  {
    name = "Big Baby",
    description = "Starts with 5x Big Chubby",
    sprite = "037_baby_big.png",
    item = CollectibleType.COLLECTIBLE_BIG_CHUBBY, -- 473
    itemNum = 5,
  },
  {
    name = "Brown Baby",
    description = "Spawns a poop per enemy killed",
    sprite = "038_baby_brown.png",
  },
  {
    name = "Noose Baby",
    description = "Starts with Transcendence",
    sprite = "039_baby_noose.png",
    item = CollectibleType.COLLECTIBLE_TRANSCENDENCE, -- 20
  },
  {
    name = "Hive Baby",
    description = "Starts with Hive Mind + max Blue Flies + max Blue Spiders",
    sprite = "040_baby_hive.png",
    item = CollectibleType.COLLECTIBLE_HIVE_MIND, -- 248
  },
  {
    name = "Buddy Baby",
    description = "Starts with Guillotine",
    sprite = "041_baby_buddy.png",
    item = CollectibleType.COLLECTIBLE_GUILLOTINE, -- 206
  },
  {
    name = "Colorful Baby",
    description = "Starts with 3 Dollar Bill",
    sprite = "042_baby_colorful.png",
    item = CollectibleType.COLLECTIBLE_3_DOLLAR_BILL, -- 191
  },
  {
    name = "Whore Baby",
    description = "Starts with Whore of Babylon",
    sprite = "043_baby_whore.png",
    item = CollectibleType.COLLECTIBLE_WHORE_OF_BABYLON, -- 122
  },
  {
    name = "Cracked Baby",
    description = "Starts with Cracked Dice",
    sprite = "044_baby_cracked.png",
    trinket = TrinketType.TRINKET_CRACKED_DICE, -- 67
  },
  {
    name = "Dripping Baby",
    description = "Starts with Isaac's Heart",
    sprite = "045_baby_dripping.png",
    item = CollectibleType.COLLECTIBLE_ISAACS_HEART, -- 276
  },
  {
    name = "Blinding Baby",
    description = "Spawns a Sun Card on hit",
    sprite = "046_baby_blinding.png",
  },
  {
    name = "Sucky Baby",
    description = "Has Succubus aura",
    sprite = "047_baby_sucky.png",
    item = CollectibleType.COLLECTIBLE_SUCCUBUS, -- 417
  },
  {
    name = "Dark Baby",
    description = "Starts with Dark Matter",
    sprite = "048_baby_dark.png",
    item = CollectibleType.COLLECTIBLE_DARK_MATTER, -- 259
  },
  {
    name = "Picky Baby",
    description = "Starts with More Options",
    sprite = "049_baby_picky.png",
    item = CollectibleType.COLLECTIBLE_MORE_OPTIONS, -- 414
  },
  {
    name = "Revenge Baby",
    description = "Spawns a random heart on hit",
    sprite = "050_baby_revenge.png",
  },
  {
    name = "Belial Baby",
    description = "Starts with passive Book of Belial effect",
    sprite = "051_baby_belial.png",
  },
  {
    name = "Sale Baby",
    description = "Starts with Steam Sale",
    sprite = "052_baby_sale.png",
    item = CollectibleType.COLLECTIBLE_STEAM_SALE, -- 64
  },
  {
    name = "Goat Head Baby",
    description = "Starts with Goat Head",
    sprite = "053_baby_goatbaby.png",
    item = CollectibleType.COLLECTIBLE_GOAT_HEAD, -- 215
  },
  {
    name = "Super Greed Baby",
    description = "Midas tears",
    sprite = "054_baby_super greedbaby.png",
  },
  {
    name = "Mort Baby",
    description = "Starts with The Mulligan",
    sprite = "055_baby_mort.png",
    item = CollectibleType.COLLECTIBLE_MULLIGAN, -- 151
  },
  {
    name = "Apollyon Baby",
    description = "Starts with 2x Halo of Flies",
    sprite = "056_baby_apollyon.png",
    item = CollectibleType.COLLECTIBLE_HALO_OF_FLIES, -- 10
    itemNum = 2,
  },
  {
    name = "Boner Baby",
    description = "Starts with Brittle Bones",
    sprite = "057_baby_boner.png",
    item = CollectibleType.COLLECTIBLE_BRITTLE_BONES, -- 549
  },
  {
    name = "Bound Baby",
    description = "Box of Friends effect every 7 seconds",
    sprite = "058_baby_bound.png",
  },
  {
    name = "Big Eyes Baby",
    description = "Starts with Speed Ball",
    sprite = "059_baby_bigeyes.png",
    item = CollectibleType.COLLECTIBLE_SPEED_BALL, -- 143
  },
  {
    name = "Sleep Baby",
    description = "Starts with Broken Modem",
    sprite = "060_baby_sleep.png",
    item = CollectibleType.COLLECTIBLE_BROKEN_MODEM, -- 514
  },
  {
    name = "Zombie Baby",
    description = "Starts with The Common Cold",
    sprite = "061_baby_zombie.png",
    item = CollectibleType.COLLECTIBLE_COMMON_COLD, -- 103
  },
  {
    name = "Goat Baby",
    description = "Starts with Pentagram",
    sprite = "062_baby_goat.png",
    item = CollectibleType.COLLECTIBLE_PENTAGRAM, -- 51
  },
  {
    name = "Butthole Baby",
    description = "Spawns a random poop every 5 seconds",
    sprite = "063_baby_butthole.png",
  },
  {
    name = "Eye Patch Baby",
    description = "Starts with Paper Clip",
    sprite = "064_baby_eyepatch.png",
    trinket = TrinketType.TRINKET_PAPER_CLIP, -- 19
  },
  {
    name = "Blood Eyes Baby",
    description = "Starts with Haemolacria",
    sprite = "065_baby_bloodeyes.png",
    item = CollectibleType.COLLECTIBLE_HAEMOLACRIA, -- 531
  },
  {
    name = "Mustache Baby",
    description = "Boomerang tears",
    sprite = "066_baby_mustache.png",
  },
  {
    name = "Spittle Baby",
    description = "Starts with Dead Onion",
    sprite = "067_baby_spittle.png",
    item = CollectibleType.COLLECTIBLE_DEAD_ONION, -- 336
  },
  {
    name = "Brain Baby",
    description = "Starts with The Mind",
    sprite = "068_baby_brain.png",
    item = CollectibleType.COLLECTIBLE_MIND, -- 333
  },
  {
    name = "3 Eyes Baby",
    description = "Starts with The Inner Eye",
    sprite = "069_baby_threeeyes.png",
    item = CollectibleType.COLLECTIBLE_INNER_EYE, -- 2
  },
  {
    name = "Viridian Baby",
    description = "Starts with How to Jump",
    sprite = "070_baby_viridian.png",
    item = CollectibleType.COLLECTIBLE_HOW_TO_JUMP, -- 282
  },
  {
    name = "Blockhead Baby",
    description = "Blocks are destroyed on touch",
    sprite = "071_baby_blockhead.png",
  },
  {
    name = "Worm Baby",
    description = "Starts with 5x Little Chubby",
    sprite = "072_baby_worm.png",
    item = CollectibleType.COLLECTIBLE_LITTLE_CHUBBY, -- 88
    itemNum = 5,
  },
  {
    name = "Lowface Baby",
    description = "0.5x range",
    sprite = "073_baby_lowface.png",
  },
  {
    name = "Alien Hominid Baby",
    description = "Starts with The Parasite",
    sprite = "074_baby_alienhominid.png",
    item = CollectibleType.COLLECTIBLE_PARASITE, -- 104
  },
  {
    name = "Bomb Baby",
    description = "Starts with Mr. Mega",
    sprite = "075_baby_bomb.png",
    item = CollectibleType.COLLECTIBLE_MR_MEGA, -- 106
  },
  {
    name = "Video Baby",
    description = "Starts with Tech X",
    sprite = "076_baby_video.png",
    item = CollectibleType.COLLECTIBLE_TECH_X, -- 395
  },
  {
    name = "Parasite Baby",
    description = "Balloon tears",
    sprite = "077_baby_parasite.png",
  },
  {
    name = "Derp Baby",
    description = "Starts with Little Baggy",
    sprite = "078_baby_derp.png",
    item = CollectibleType.COLLECTIBLE_LITTLE_BAGGY, -- 252
  },
  {
    name = "Lobotomy Baby",
    description = "Starts with Delirious",
    sprite = "079_baby_lobotomy.png",
    item = CollectibleType.COLLECTIBLE_DELIRIOUS, -- 510
  },
  {
    name = "Choke Baby",
    description = "Starts with Kidney Stone",
    sprite = "080_baby_choke.png",
    item = CollectibleType.COLLECTIBLE_KIDNEY_STONE, -- 440
  },
  {
    name = "Scream Baby",
    description = "Starts with Shoop Da Whoop!",
    sprite = "081_baby_scream.png",
    item = CollectibleType.COLLECTIBLE_SHOOP_DA_WHOOP, -- 49
  },
  {
    name = "Gurdy Baby",
    description = "Starts with 20x Lil Gurdy",
    sprite = "082_baby_gurdy.png",
    item = CollectibleType.COLLECTIBLE_LIL_GURDY, -- 384
    itemNum = 20,
  },
  {
    name = "Ghoul Baby",
    description = "Starts with The Mark",
    sprite = "083_baby_ghoul.png",
    item = CollectibleType.COLLECTIBLE_MARK, -- 79
  },
  {
    name = "Goatee Baby",
    description = "Starts with Black Candle",
    sprite = "084_baby_goatee.png",
    item = CollectibleType.COLLECTIBLE_BLACK_CANDLE, -- 260
  },
  {
    name = "Shades Baby",
    description = "Starts with X-Ray Vision",
    sprite = "085_baby_shades.png",
    item = CollectibleType.COLLECTIBLE_XRAY_VISION, -- 76
  },
  {
    name = "Statue Baby",
    description = "Starts with Duality",
    sprite = "086_baby_statue.png",
    item = CollectibleType.COLLECTIBLE_DUALITY, -- 498
  },
  {
    name = "Bloodsucker Baby",
    description = "Starts with Charm of the Vampire",
    sprite = "087_baby_bloodsucker.png",
    item = CollectibleType.COLLECTIBLE_CHARM_VAMPIRE, -- 62
  },
  {
    name = "Bandaid Baby",
    description = "Spawns a random pedestal item per room cleared",
    sprite = "088_baby_bandaid.png",
  },
  {
    name = "Eyebrows Baby",
    description = "Starts with Guppy's Hair Ball",
    sprite = "089_baby_eyebrows.png",
    item = CollectibleType.COLLECTIBLE_GUPPYS_HAIRBALL, -- 187
  },
  {
    name = "Nerd Baby",
    description = "Locked doors in uncleared rooms",
    sprite = "090_baby_nerd.png",
  },
  {
    name = "Boss Baby",
    description = "Starts with There's Options",
    sprite = "091_baby_boss.png",
    item = CollectibleType.COLLECTIBLE_THERES_OPTIONS, -- 249
  },
  {
    name = "Turd Baby",
    description = "Starts with Butt Bombs",
    sprite = "092_baby_turd.png",
    item = CollectibleType.COLLECTIBLE_BUTT_BOMBS, -- 209
  },
  {
    name = "O Baby",
    description = "Starts with Tiny Planet",
    sprite = "093_baby_o.png",
    item = CollectibleType.COLLECTIBLE_TINY_PLANET, -- 233
  },
  {
    name = "Square Eyes Baby",
    description = "Square tears",
    sprite = "094_baby_squareeyes.png",
  },
  {
    name = "Teeth Baby",
    description = "Starts with 3x Mystery Sack",
    sprite = "095_baby_teeth.png",
    item = CollectibleType.COLLECTIBLE_MYSTERY_SACK, -- 271
    itemNum = 3,
  },
  {
    name = "Frown Baby",
    description = "Summons Best Friend every 5 seconds",
    sprite = "096_baby_frown.png",
  },
  {
    name = "Tongue Baby",
    description = "Starts with Judas' Tongue",
    sprite = "097_baby_tongue.png",
    trinket = TrinketType.TRINKET_JUDAS_TONGUE, -- 56
  },
  {
    name = "Half Head Baby",
    description = "Takes 2x damage",
    sprite = "098_baby_halfhead.png",
  },
  {
    name = "Makeup Baby",
    description = "Starts with Bloody Penny",
    sprite = "099_baby_makeup.png",
    trinket = TrinketType.TRINKET_BLOODY_PENNY, -- 49
  },
  {
    name = "Ed Baby",
    description = "Starts with 9 Volt",
    sprite = "100_baby_ed.png",
    item = CollectibleType.COLLECTIBLE_NINE_VOLT, -- 116
  },
  {
    name = "D Baby",
    description = "Spawns creep on hit (improved)",
    sprite = "101_baby_d.png",
  },
  {
    name = "Guppy Baby",
    description = "Starts with Guppy's Head",
    sprite = "102_baby_guppy.png",
    item = CollectibleType.COLLECTIBLE_GUPPYS_HEAD, -- 145
  },
  {
    name = "Puke Baby",
    description = "Starts with Ipecac",
    sprite = "103_baby_puke.png",
    item = CollectibleType.COLLECTIBLE_IPECAC, -- 149
  },
  {
    name = "Dumb Baby",
    description = "Starts with No. 2",
    sprite = "104_baby_dumb.png",
    item = CollectibleType.COLLECTIBLE_NUMBER_TWO, -- 378
  },
  {
    name = "Lipstick Baby",
    description = "Starts with 3x Lil Chest",
    sprite = "105_baby_lipstick.png",
    item = CollectibleType.COLLECTIBLE_LIL_CHEST, -- 362
    itemNum = 3,
  },
  {
    name = "Aether Baby",
    description = "Each tear shoots outwards in the 8 cardinal directions",
    sprite = "106_baby_aether.png",
  },
  {
    name = "Brownie Baby",
    description = "Starts with Level 4 Meatboy + Level 4 Meatgirl",
    sprite = "107_baby_brownie.png",
  },
  {
    name = "VVVVVV Baby",
    description = "Starts with Anti-Gravity",
    sprite = "108_baby_vvvvvv.png",
    item = CollectibleType.COLLECTIBLE_ANTI_GRAVITY, -- 222
  },
  {
    name = "Nosferatu Baby",
    description = "Starts with The Pact",
    sprite = "109_baby_nosferatu.png",
    item = CollectibleType.COLLECTIBLE_PACT, -- 80
  },
  {
    name = "Pubic Baby",
    description = "Must full clear",
    sprite = "110_baby_pubic.png",
  },
  {
    name = "Eyemouth Baby",
    description = "Shoots an extra tear every 3rd shot",
    sprite = "111_baby_eyemouth.png",
  },
  {
    name = "Weirdo Baby",
    description = "Starts with The Ludovico Technique",
    sprite = "112_baby_weirdo.png",
    item = CollectibleType.COLLECTIBLE_LUDOVICO_TECHNIQUE, -- 329
  },
  {
    name = "V Baby",
    description = "Starts with Pupula Duplex",
    sprite = "113_baby_v.png",
    item = CollectibleType.COLLECTIBLE_PUPULA_DUPLEX, -- 379
  },
  {
    name = "Strange Mouth Baby",
    description = "Wiggle tears",
    sprite = "114_baby_strangemouth.png",
  },
  {
    name = "Masked Baby",
    description = "Starts with Abaddon",
    sprite = "115_baby_masked.png",
    item = CollectibleType.COLLECTIBLE_ABADDON, -- 230
  },
  {
    name = "Cyber Baby",
    description = "Starts with Technology 2",
    sprite = "116_baby_cyber.png",
    item = CollectibleType.COLLECTIBLE_TECHNOLOGY_2, -- 152
  },
  {
    name = "Axe Wound Baby",
    description = "Starts with Sacrificial Dagger + Host Hat + flight + blindfolded",
    sprite = "117_baby_axewound.png",
    item = CollectibleType.COLLECTIBLE_SACRIFICIAL_DAGGER, -- 172
    item2 = CollectibleType.COLLECTIBLE_HOST_HAT, -- 375
    blindfolded = true,
    flight = true,
  },
  {
    name = "Statue Baby 2",
    description = "Improved Secret Rooms",
    sprite = "118_baby_statue.png",
  },
  {
    name = "Grin Baby",
    description = "Starts with Godhead",
    sprite = "119_baby_grin.png",
    item = CollectibleType.COLLECTIBLE_GODHEAD, -- 331
  },
  {
    name = "Upset Baby",
    description = "Starts with Sad Bombs",
    sprite = "120_baby_upset.png",
    item = CollectibleType.COLLECTIBLE_SAD_BOMBS, -- 220
  },
  {
    name = "Plastic Baby",
    description = "Starts with Rubber Cement",
    sprite = "121_baby_plastic.png",
    item = CollectibleType.COLLECTIBLE_RUBBER_CEMENT, -- 221
  },
  {
    name = "Monochrome Baby",
    description = "Starts with Dead Eye",
    sprite = "122_baby_monochrome.png",
    item = CollectibleType.COLLECTIBLE_DEAD_EYE, -- 373
  },
  {
    name = "One Tooth Baby",
    description = "Starts with Rainbow Worm",
    sprite = "123_baby_onetooth.png",
    trinket = TrinketType.TRINKET_RAINBOW_WORM, -- 64
  },
  {
    name = "Tusks Baby",
    description = "2x damage",
    sprite = "124_baby_tusks.png",
  },
  {
    name = "Hopeless Baby",
    description = "+2 keys + keys are hearts",
    sprite = "125_baby_hopeless.png",
  },
  {
    name = "Big Mouth Baby",
    description = "Starts with 10x Jaw Bone",
    sprite = "126_baby_bigmouth.png",
    item = CollectibleType.COLLECTIBLE_JAW_BONE, -- 548
    itemNum = 10,
  },
  {
    name = "Pee Eyes Baby",
    description = "Starts with Number One",
    sprite = "127_baby_peeeyes.png",
    item = CollectibleType.COLLECTIBLE_NUMBER_ONE, -- 6
  },
  {
    name = "Earwig Baby",
    description = "Starts with Fish Tail",
    sprite = "128_baby_earwig.png",
    trinket = TrinketType.TRINKET_FISH_TAIL, -- 94
  },
  {
    name = "Ninkumpoop Baby",
    description = "Starts with Ring Worm",
    sprite = "129_baby_ninkumpoop.png",
    trinket = TrinketType.TRINKET_RING_WORM, -- 11
  },
  {
    name = "Strange Shape Baby",
    description = "Pulsing tears",
    sprite = "130_baby_strangeshape.png",
  },
  {
    name = "Bugeyed Baby",
    description = "Pickups turn into Blue Spiders",
    sprite = "131_baby_bugeyed.png",
  },
  {
    name = "Freaky Baby",
    description = "Converter effect on hit",
    sprite = "132_baby_freaky.png",
  },
  {
    name = "Crooked Baby",
    description = "Tears angled by 15 degrees to the left",
    sprite = "133_baby_crooked.png",
  },
  {
    name = "Spider Legs Baby",
    description = "Starts with 15x Sissy Longlegs",
    sprite = "134_baby_spiderlegs.png",
    item = CollectibleType.COLLECTIBLE_SISSY_LONGLEGS, -- 280
    itemNum = 15,
  },
  {
    name = "Smiling Baby",
    description = "Starts with Sacred Heart",
    sprite = "135_baby_smiling.png",
    item = CollectibleType.COLLECTIBLE_SACRED_HEART, -- 182
  },
  {
    name = "Tears Baby",
    description = "Starts with Toothpicks",
    sprite = "136_baby_tears.png",
    item = CollectibleType.COLLECTIBLE_TOOTH_PICKS, -- 183
  },
  {
    name = "Bowling Baby",
    description = "Starts with Flat Stone",
    sprite = "137_baby_bowling.png",
    item = CollectibleType.COLLECTIBLE_FLAT_STONE, -- 540
  },
  {
    name = "Mohawk Baby",
    description = "+2 bombs + bombs are hearts",
    sprite = "138_baby_mohawk.png",
  },
  {
    name = "Rotten Meat Baby",
    description = "Has constant Butter Bean effect",
    sprite = "139_baby_rottenmeat.png",
  },
  {
    name = "No Arms Baby",
    description = "Pickups are bouncy",
    sprite = "140_baby_noarms.png",
  },
  {
    name = "Twin Baby",
    description = "Uncontrollable teleports",
    sprite = "141_baby_twin2.png",
  },
  {
    name = "Ugly Girl Baby",
    description = "Starts with Ipecac + Dr. Fetus",
    sprite = "142_baby_uglygirl.png",
    item = CollectibleType.COLLECTIBLE_IPECAC, -- 149
    item2 = CollectibleType.COLLECTIBLE_DR_FETUS, -- 52
  },
  {
    name = "Chompers Baby",
    description = "Everything is Red Poop",
    sprite = "143_baby_chompers.png",
  },
  {
    name = "Camillo Jr. Baby",
    description = "Starts with Tech.5",
    sprite = "144_baby_camillojr.png",
    item = CollectibleType.COLLECTIBLE_TECH_5, -- 244
  },
  {
    name = "Eyeless Baby",
    description = "Starts with 20x The Peeper",
    sprite = "145_baby_eyeless.png",
    item = CollectibleType.COLLECTIBLE_PEEPER, -- 155
    itemNum = 20,
  },
  {
    name = "Sloppy Baby",
    description = "Starts with Epic Fetus (improved)",
    sprite = "146_baby_sloppy.png",
    item = CollectibleType.COLLECTIBLE_EPIC_FETUS, -- 168
  },
  {
    name = "Bluebird Baby",
    description = "Starts with Dead Dove",
    sprite = "147_baby_bluebird.png",
    item = CollectibleType.COLLECTIBLE_DEAD_DOVE, -- 185
  },
  {
    name = "Fat Baby",
    description = "Starts with Counterfeit Penny",
    sprite = "148_baby_fat.png",
    trinket = TrinketType.TRINKET_COUNTERFEIT_PENNY, -- 52
  },
  {
    name = "Butterfly Baby",
    description = "Improved Super Secret Rooms",
    sprite = "149_baby_butterfly.png",
  },
  {
    name = "Goggles Baby",
    description = "Starts with 20/20",
    sprite = "150_baby_goggles.png",
    item = CollectibleType.COLLECTIBLE_20_20, -- 245
  },
  {
    name = "Apathetic Baby",
    description = "Starts with Diplopia",
    sprite = "151_baby_apathetic.png",
    item = CollectibleType.COLLECTIBLE_DIPLOPIA, -- 347
  },
  {
    name = "Cape Baby",
    description = "Starts with The Halo",
    sprite = "152_baby_cape.png",
    item = CollectibleType.COLLECTIBLE_HALO, -- 101
  },
  {
    name = "Sorrow Baby",
    description = "Starts with Razor Blade",
    sprite = "153_baby_sorrow.png",
    item = CollectibleType.COLLECTIBLE_RAZOR_BLADE, -- 126
  },
  {
    name = "Rictus Baby",
    description = "Scared pickups",
    sprite = "154_baby_rictus.png",
  },
  {
    name = "Awaken Baby",
    description = "Constant Telekinesis effect",
    sprite = "155_baby_awaken.png",
  },
  {
    name = "Puff Baby",
    description = "Mega Bean effect every 5 seconds",
    sprite = "156_baby_puff.png",
  },
  {
    name = "Attractive Baby",
    description = "All enemies are permanently charmed",
    sprite = "157_baby_attractive.png",
    seed = SeedEffect.SEED_ALWAYS_CHARMED, -- 17
  },
  {
    name = "Pretty Baby",
    description = "Summons a random familiar every 5 seconds",
    sprite = "158_baby_pretty.png",
  },
  {
    name = "Cracked Infamy Baby",
    description = "Starts with Blood Rights + Isaac's Heart",
    sprite = "159_baby_crackedinfamy.png",
    item = CollectibleType.COLLECTIBLE_BLOOD_RIGHTS, -- 186
    item2 = CollectibleType.COLLECTIBLE_ISAACS_HEART, -- 276
  },
  {
    name = "Distended Baby",
    description = "Starts with Contagion",
    sprite = "160_baby_distended.png",
    item = CollectibleType.COLLECTIBLE_CONTAGION, -- 466
  },
  {
    name = "Mean Baby",
    description = "Starts with Epic Fetus",
    sprite = "161_baby_mean.png",
    item = CollectibleType.COLLECTIBLE_EPIC_FETUS, -- 168
  },
  {
    name = "Digital Baby",
    description = "B00B T00B",
    sprite = "162_baby_digital.png",
    seed = SeedEffect.SEED_OLD_TV, -- 8
  },
  {
    name = "Helmet Baby",
    description = "Starts with Spear of Destiny",
    sprite = "163_baby_helmet.png",
    item = CollectibleType.COLLECTIBLE_SPEAR_OF_DESTINY, -- 400
  },
  {
    name = "Black Eye Baby",
    description = "Starts with Leprosy",
    sprite = "164_baby_blackeye.png",
    item = CollectibleType.COLLECTIBLE_LEPROCY, -- 525
  },
  {
    name = "Lights Baby",
    description = "Holy tears",
    sprite = "165_baby_lights.png",
  },
  {
    name = "Spike Baby",
    description = "All chests are Mimics + all chests have items",
    sprite = "166_baby_spike.png",
  },
  {
    name = "Worry Baby",
    description = "Touching items/pickups causes teleportation",
    sprite = "167_baby_worry.png",
  },
  {
    name = "Ears Baby",
    description = "Starts with Dog Tooth",
    sprite = "168_baby_ears.png",
    item = CollectibleType.COLLECTIBLE_DOG_TOOTH, -- 445
  },
  {
    name = "Funeral Baby",
    description = "Starts with Death's Touch",
    sprite = "169_baby_funeral.png",
    item = CollectibleType.COLLECTIBLE_DEATHS_TOUCH, -- 237
  },
  {
    name = "Libra Baby",
    description = "Starts with Libra",
    sprite = "170_baby_libra.png",
    item = CollectibleType.COLLECTIBLE_LIBRA, -- 304
  },
  {
    name = "Gappy Baby",
    description = "Starts with Bloody Lust",
    sprite = "171_baby_gappy.png",
    item = CollectibleType.COLLECTIBLE_BLOODY_LUST, -- 157
  },
  {
    name = "Sunburn Baby",
    description = "Starts with Ghost Pepper",
    sprite = "172_baby_sunburn.png",
    item = CollectibleType.COLLECTIBLE_GHOST_PEPPER, -- 495
  },
  {
    name = "Ate Poop Baby",
    description = "Destroying poops spawns random pickups",
    sprite = "173_baby_atepoop.png",
  },
  {
    name = "Electric Baby",
    description = "Starts with Jacob's Ladder",
    sprite = "174_baby_electris.png",
    item = CollectibleType.COLLECTIBLE_JACOBS_LADDER, -- 494
  },
  {
    name = "Blood Hole Baby",
    description = "Starts with Proptosis",
    sprite = "175_baby_bloodhole.png",
    item = CollectibleType.COLLECTIBLE_PROPTOSIS, -- 261
  },
  {
    name = "Transforming Baby",
    description = "Starts with Technology Zero",
    sprite = "176_baby_transforming.png",
    item = CollectibleType.COLLECTIBLE_TECHNOLOGY_ZERO, -- 524
  },
  {
    name = "Aban Baby",
    description = "+2 coins + Sonic-style health",
    sprite = "177_baby_aban.png",
  },
  {
    name = "Bandage Girl Baby",
    description = "Starts with Cube of Meat + Ball of Bandages",
    sprite = "178_baby_bandagegirl.png",
    item = CollectibleType.COLLECTIBLE_CUBE_OF_MEAT, -- 73
    item2 = CollectibleType.COLLECTIBLE_BALL_OF_BANDAGES, -- 207
  },
  {
    name = "Piece A Baby",
    description = "Starts with The Gamekid",
    sprite = "179_baby_piecea.png",
    item = CollectibleType.COLLECTIBLE_GAMEKID, -- 93
  },
  {
    name = "Piece B Baby",
    description = "Electric ring tears",
    sprite = "180_baby_pieceb.png",
  },
  {
    name = "Spelunker Baby",
    description = "Starts with Stud Finder; Crawlspace --> Black Market",
    sprite = "181_baby_spelunker.png",
    trinket = TrinketType.TRINKET_STUD_FINDER, -- 74
  },
  {
    name = "Frog Baby",
    description = "Starts with Scorpio",
    sprite = "182_baby_frog.png",
    item = CollectibleType.COLLECTIBLE_SCORPIO, -- 305
  },
  {
    name = "Crook Baby",
    description = "Starts with Mr. ME!",
    sprite = "183_baby_crook.png",
     item = CollectibleType.COLLECTIBLE_MR_ME, -- 527
  },
  {
    name = "Don Baby",
    description = "Starts with Bob's Brain",
    sprite = "184_baby_don.png",
    item = CollectibleType.COLLECTIBLE_BOBS_BRAIN, -- 273
  },
  {
    name = "Web Baby",
    description = "Slow tears",
    sprite = "185_baby_web.png",
  },
  {
    name = "Faded Baby",
    description = "Starts with Faded Polaroid",
    sprite = "186_baby_faded.png",
    trinket = TrinketType.TRINKET_FADED_POLAROID, -- 69
  },
  {
    name = "Sick Baby",
    description = "Starts with Tonsil",
    sprite = "187_baby_sick.png",
    item = CollectibleType.COLLECTIBLE_TONSIL, -- 474
  },
  {
    name = "Dr. Fetus Baby",
    description = "Starts with Dr. Fetus",
    sprite = "188_baby_drfetus.png",
    item = CollectibleType.COLLECTIBLE_DR_FETUS, -- 52
  },
  {
    name = "Spectral Baby",
    description = "Starts with Ouija Board",
    sprite = "189_baby_spectral.png",
    item = CollectibleType.COLLECTIBLE_OUIJA_BOARD, -- 115
  },
  {
    name = "Red Skeleton Baby",
    description = "Starts with 3x Slipped Rib",
    sprite = "190_baby_redskeleton.png",
    item = CollectibleType.COLLECTIBLE_SLIPPED_RIB, -- 542
    itemNum = 3,
  },
  {
    name = "Skeleton Baby",
    description = "Starts with Compound Fracture",
    sprite = "191_baby_skeleton.png",
    item = CollectibleType.COLLECTIBLE_COMPOUND_FRACTURE, -- 453
  },
  {
    name = "Jammies Baby",
    description = "Starts with Triple A Battery",
    sprite = "192_baby_jammies.png",
    trinket = TrinketType.TRINKET_AAA_BATTERY, -- 3
  },
  {
    name = "New Jammies Baby",
    description = "Starts with Blanket",
    sprite = "193_baby_newjammies.png",
    item = CollectibleType.COLLECTIBLE_BLANKET, -- 535
  },
  {
    name = "Cold Baby",
    description = "Freeze tears",
    sprite = "194_baby_cold.png",
  },
  {
    name = "Old Man Baby",
    description = "Starts with Dad's Key",
    sprite = "195_baby_oldman.png",
    item = CollectibleType.COLLECTIBLE_DADS_KEY, -- 175
  },
  {
    name = "Spooked Baby",
    description = "All enemies are permanently feared",
    sprite = "196_baby_spooked.png",
    seed = SeedEffect.SEED_ALWAYS_AFRAID, -- 19
  },
  {
    name = "Nice Baby",
    description = "Brimstone tears",
    sprite = "197_baby_nice.png",
  },
  {
    name = "Dots Baby",
    description = "Starts with Cricket's Body",
    sprite = "198_baby_dots.png",
    item = CollectibleType.COLLECTIBLE_CRICKETS_BODY, -- 224
  },
  {
    name = "Peeling Baby",
    description = "Starts with Potato Peeler",
    sprite = "199_baby_peeling.png",
    item = CollectibleType.COLLECTIBLE_POTATO_PEELER, -- 487
  },
  {
    name = "Small Face Baby",
    description = "My Little Unicorn effect on hit",
    sprite = "200_baby_smallface.png",
  },
  {
    name = "Good Baby",
    description = "Starts with 15x Seraphim",
    sprite = "201_baby_good.png",
    item = CollectibleType.COLLECTIBLE_SERAPHIM, -- 390
  },
  {
    name = "Blindfold Baby",
    description = "Starts with Incubus + blindfolded",
    sprite = "202_baby_blindfold.png",
    item = CollectibleType.COLLECTIBLE_INCUBUS, -- 360
    blindfolded = true,
  },
  {
    name = "Pipe Baby",
    description = "Starts with Pisces",
    sprite = "203_baby_pipe.png",
    item = CollectibleType.COLLECTIBLE_PISCES, -- 309
  },
  {
    name = "Dented Baby",
    description = "Starts with The Small Rock",
    sprite = "204_baby_dented.png",
    item = CollectibleType.COLLECTIBLE_SMALL_ROCK, -- 90
  },
  {
    name = "Steven Baby",
    description = "Starts with 20x Little Steven",
    sprite = "205_baby_steven.png",
    item = CollectibleType.COLLECTIBLE_LITTLE_STEVEN, -- 100
    itemNum = 20,
  },
  {
    name = "Monocle Baby",
    description = "3x tear size",
    sprite = "206_baby_monocle.png",
  },
  {
    name = "Belial Baby 2",
    description = "Starts with Eye of Belial",
    sprite = "207_baby_belial.png",
    item = CollectibleType.COLLECTIBLE_EYE_OF_BELIAL, -- 462
  },
  {
    name = "Monstro Baby",
    description = "Starts with 5x Lil Monstro",
    sprite = "208_baby_monstro.png",
    item = CollectibleType.COLLECTIBLE_LIL_MONSTRO, -- 471
    itemNum = 5,
  },
  {
    name = "Fez Baby",
    description = "Starts with The Book of Belial",
    sprite = "209_baby_fez.png",
    item = CollectibleType.COLLECTIBLE_BOOK_OF_BELIAL, -- 34
  },
  {
    name = "MeatBoy Baby",
    description = "Potato Peeler effect on hit",
    sprite = "210_baby_meatboy.png",
  },
  {
    name = "Skull Baby",
    description = "Starts with Host Hat",
    sprite = "211_baby_skull.png",
    item = CollectibleType.COLLECTIBLE_HOST_HAT, -- 375
  },
  {
    name = "Conjoined Baby",
    description = "Doors open on hit",
    sprite = "212_baby_conjoined.png",
  },
  {
    name = "Skinny Baby",
    description = "Super homing tears",
    sprite = "213_baby_skinny.png",
  },
  {
    name = "Basic Spider Baby",
    description = "Starts with Mutant Spider",
    sprite = "214_baby_spider.png",
    item = CollectibleType.COLLECTIBLE_MUTANT_SPIDER, -- 153
  },
  {
    name = "Shopkeeper Baby",
    description = "Free shop items",
    sprite = "215_baby_shopkeeper.png",
  },
  {
    name = "Fancy Baby",
    description = "Starts with A Quarter",
    sprite = "216_baby_fancy.png",
    item = CollectibleType.COLLECTIBLE_QUARTER, -- 74
  },
  {
    name = "Chubby Baby",
    description = "Starts with Technology Zero + Tiny Planet",
    sprite = "217_baby_chubby.png",
    item = CollectibleType.COLLECTIBLE_TECHNOLOGY_ZERO, -- 524
    item2 = CollectibleType.COLLECTIBLE_TINY_PLANET, -- 233
  },
  {
    name = "Cyclops Baby",
    description = "Starts with Polyphemus",
    sprite = "218_baby_cyclops.png",
    item = CollectibleType.COLLECTIBLE_POLYPHEMUS, -- 169
  },
  {
    name = "Isaac Baby",
    description = "Starts with The Battery",
    sprite = "219_baby_isaac.png",
    item = CollectibleType.COLLECTIBLE_BATTERY, -- 63
  },
  {
    name = "Plug Baby",
    description = "Starts with the Sharp Plug",
    sprite = "220_baby_plug.png",
    item = CollectibleType.COLLECTIBLE_SHARP_PLUG, -- 205
  },
  {
    name = "Drool Baby",
    description = "Starts with Monstro's Tooth",
    sprite = "221_baby_drool.png",
    item = CollectibleType.COLLECTIBLE_MONSTROS_TOOTH, -- 86
  },
  {
    name = "Wink Baby",
    description = "Starts with the Stop Watch",
    sprite = "222_baby_wink.png",
    item = CollectibleType.COLLECTIBLE_STOP_WATCH, -- 232
  },
  {
    name = "Pox Baby",
    description = "Starts with Toxic Shock",
    sprite = "223_baby_pox.png",
    item = CollectibleType.COLLECTIBLE_TOXIC_SHOCK, -- 350
  },
  {
    name = "Onion Baby",
    description = "Starts with The Sad Onion",
    sprite = "224_baby_onion.png",
    item = CollectibleType.COLLECTIBLE_SAD_ONION, -- 1
  },
  {
    name = "Zipper Baby",
    description = "Starts with Flat Penny",
    sprite = "225_baby_zipper.png",
    trinket = TrinketType.TRINKET_FLAT_PENNY, -- 51
  },
  {
    name = "Buckteeth Baby",
    description = "Starts with 15x Angry Fly",
    sprite = "226_baby_buckteeth.png",
    item = CollectibleType.COLLECTIBLE_ANGRY_FLY, -- 511
    itemNum = 15,
  },
  {
    name = "Beard Baby",
    description = "Crooked Penny effect on hit",
    sprite = "227_baby_beard.png",
  },
  {
    name = "Hanger Baby",
    description = "Starts with Wire Coat Hanger",
    sprite = "228_baby_hanger.png",
    item = CollectibleType.COLLECTIBLE_WIRE_COAT_HANGER, -- 32
  },
  {
    name = "Vampire Baby",
    description = "Starts with Contract From Below",
    sprite = "229_baby_vampire.png",
    item = CollectibleType.COLLECTIBLE_CONTRACT_FROM_BELOW, -- 241
  },
  {
    name = "Tilt Baby",
    description = "Tears angled by 15 degrees to the right",
    sprite = "230_baby_tilt.png",
  },
  {
    name = "Bawl Baby",
    description = "Has constant Isaac's Tears effect",
    sprite = "231_baby_bawl.png",
    blindfolded = true,
  },
  {
    name = "Lemon Baby",
    description = "Starts with Lemon Mishap (improved)",
    sprite = "232_baby_lemon.png",
    item = CollectibleType.COLLECTIBLE_LEMON_MISHAP, -- 56
  },
  {
    name = "Punkboy Baby",
    description = "Starts with The Polaroid",
    sprite = "233_baby_punkboy.png",
    item = CollectibleType.COLLECTIBLE_POLAROID, -- 327
  },
  {
    name = "Punkgirl Baby",
    description = "Starts with The Negative",
    sprite = "234_baby_punkgirl.png",
    item = CollectibleType.COLLECTIBLE_NEGATIVE, -- 328
  },
  {
    name = "Computer Baby",
    description = "Starts with Technology + Technology 2",
    sprite = "235_baby_computer.png",
    item = CollectibleType.COLLECTIBLE_TECHNOLOGY, -- 68
    item2 = CollectibleType.COLLECTIBLE_TECHNOLOGY_2, -- 152
  },
  {
    name = "Mask Baby",
    description = "All enemies are permanently confused",
    sprite = "236_baby_mask.png",
    seed = SeedEffect.SEED_ALWAYS_CONFUSED, -- 18
  },
  {
    name = "Gem Baby",
    description = "Pennies spawn as nickels",
    sprite = "237_baby_gem.png",
  },
  {
    name = "Shark Baby",
    description = "Starts with 5x Fate's Reward",
    sprite = "238_baby_shark.png",
    item = CollectibleType.COLLECTIBLE_FATES_REWARD, -- 361
    itemNum = 5,
  },
  {
    name = "Beret Baby",
    description = "All champions",
    sprite = "239_baby_beret.png",
    seed = SeedEffect.SEED_ALL_CHAMPIONS, -- 13
  },
  {
    name = "Blisters Baby",
    description = "Low shot speed",
    sprite = "240_baby_blisters.png",
  },
  {
    name = "Radioactive Baby",
    description = "Starts with Mysterious Liquid",
    sprite = "241_baby_radioactive.png",
    item = CollectibleType.COLLECTIBLE_MYSTERIOUS_LIQUID, -- 317
  },
  {
    name = "Beast Baby",
    description = "Random enemies",
    sprite = "242_baby_beast.png",
  },
  {
    name = "Dark Baby 2",
    description = "Starts with Strange Attractor",
    sprite = "243_baby_dark.png",
    item = CollectibleType.COLLECTIBLE_STRANGE_ATTRACTOR, -- 315
  },
  {
    name = "Snail Baby",
    description = "0.5x speed",
    sprite = "244_baby_snail.png",
  },
  {
    name = "Blood Baby",
    description = "Starts with 5x Forever Alone",
    sprite = "245_baby_blood.png",
    item = CollectibleType.COLLECTIBLE_FOREVER_ALONE, -- 128
    itemNum = 5,
  },
  {
    name = "8 Ball Baby",
    description = "Starts with Starter Deck",
    sprite = "246_baby_8ball.png",
    item = CollectibleType.COLLECTIBLE_STARTER_DECK, -- 251
  },
  {
    name = "Wisp Baby",
    description = "Starts with Crack the Sky",
    sprite = "247_baby_wisp.png",
    item = CollectibleType.COLLECTIBLE_CRACK_THE_SKY, -- 160
  },
  {
    name = "Cactus Baby",
    description = "Starts with Locust of Famine",
    sprite = "248_baby_cactus.png",
    trinket = TrinketType.TRINKET_LOCUST_OF_FAMINE, -- 115
  },
  {
    name = "Love Eye Baby",
    description = "Falls in loves with the first enemy killed",
    sprite = "249_baby_loveeye.png",
  },
  {
    name = "Medusa Baby",
    description = "Starts with Mom's Wig",
    sprite = "250_baby_medusa.png",
    item = CollectibleType.COLLECTIBLE_MOMS_WIG, -- 217
  },
  {
    name = "Nuclear Baby",
    description = "Starts with Mama Mega!",
    sprite = "251_baby_nuclear.png",
    item = CollectibleType.COLLECTIBLE_MAMA_MEGA, -- 483
  },
  {
    name = "Purple Baby",
    description = "Fires are holy",
    sprite = "252_baby_purple.png",
  },
  {
    name = "Wizard Baby",
    description = "Cards are face up",
    sprite = "253_baby_wizard.png",
  },
  {
    name = "Earth Baby",
    description = "Starts with Fruit Cake",
    sprite = "254_baby_earth.png",
    item = CollectibleType.COLLECTIBLE_FRUIT_CAKE, -- 418
  },
  {
    name = "Saturn Baby",
    description = "Starts with Continuum",
    sprite = "255_baby_saturn.png",
    item = CollectibleType.COLLECTIBLE_CONTINUUM, -- 369
  },
  {
    name = "Cloud Baby",
    description = "Ventricle Razor effect every 20 seconds",
    sprite = "256_baby_cloud.png",
  },
  {
    name = "Tube Baby",
    description = "Starts with Varicose Veins",
    sprite = "257_baby_tube.png",
    item = CollectibleType.COLLECTIBLE_VARICOSE_VEINS, -- 452
  },
  {
    name = "Rocker Baby",
    description = "Starts with Cancer (trinket)",
    sprite = "258_baby_rocker.png",
    trinket = TrinketType.TRINKET_CANCER, -- 39
  },
  {
    name = "King Baby",
    description = "Starts with Crown of Light",
    sprite = "259_baby_king.png",
    item = CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT, -- 415
  },
  {
    name = "Coat Baby",
    description = "Starts with The Soul",
    sprite = "260_baby_coat.png",
    item = CollectibleType.COLLECTIBLE_SOUL, -- 335
  },
  {
    name = "Viking Baby",
    description = "Secret Room --> Super Secret Room",
    sprite = "261_baby_viking.png",
  },
  {
    name = "Panda Baby",
    description = "Starts with The Poop (improved)",
    sprite = "262_baby_panda.png",
    item = CollectibleType.COLLECTIBLE_POOP, -- 36
  },
  {
    name = "Raccoon Baby",
    description = "Random rocks",
    sprite = "263_baby_raccoon.png",
  },
  {
    name = "Bear Baby",
    description = "Starts with Mystery Gift",
    sprite = "264_baby_bear.png",
    item = CollectibleType.COLLECTIBLE_MYSTERY_GIFT, -- 515
  },
  {
    name = "Polar Bear Baby",
    description = "Starts with Lil Brimstone + Robo Baby + Baby Bender",
    sprite = "265_baby_polarbear.png",
    item = CollectibleType.COLLECTIBLE_LIL_BRIMSTONE, -- 275
    item2 = CollectibleType.COLLECTIBLE_ROBO_BABY, -- 95
    trinket = TrinketType.TRINKET_BABY_BENDER, -- 127
  },
  {
    name = "Lovebear Baby",
    description = "Starts with The Relic",
    sprite = "266_baby_lovebear.png",
    item = CollectibleType.COLLECTIBLE_RELIC, -- 98
  },
  {
    name = "Hare Baby",
    description = "Takes damage when standing still",
    sprite = "267_baby_hare.png",
    seed = SeedEffect.SEED_DAMAGE_WHEN_STOPPED, -- 26
  },
  {
    name = "Squirrel Baby",
    description = "Starts with Walnut (improved)",
    sprite = "268_baby_squirrel.png",
    trinket = TrinketType.TRINKET_WALNUT, -- 108
  },
  {
    name = "Tabby Baby",
    description = "Starts with Brimstone + Tammy's Head",
    sprite = "269_baby_tabby.png",
    item = CollectibleType.COLLECTIBLE_BRIMSTONE, -- 118
    item2 = CollectibleType.COLLECTIBLE_TAMMYS_HEAD, -- 38
  },
  {
    name = "Porcupine Baby",
    description = "Wait What? effect every 5 seconds",
    sprite = "270_baby_porcupine.png",
  },
  {
    name = "Puppy Baby",
    description = "Starts with Cricket's Head",
    sprite = "271_baby_puppy.png",
    item = CollectibleType.COLLECTIBLE_MAXS_HEAD, -- 4
  },
  {
    name = "Parrot Baby",
    description = "Starts with The Pony",
    sprite = "272_baby_parrot.png",
    item = CollectibleType.COLLECTIBLE_PONY, -- 130
  },
  {
    name = "Chameleon Baby",
    description = "Starts with 5x Rotten Baby",
    sprite = "273_baby_chameleon.png",
    item = CollectibleType.COLLECTIBLE_ROTTEN_BABY, -- 268
    itemNum = 5,
  },
  {
    name = "Boulder Baby",
    description = "Starts with Leo",
    sprite = "274_baby_boulder.png",
    item = CollectibleType.COLLECTIBLE_LEO, -- 302
  },
  {
    name = "Aqua Baby",
    description = "Starts with Taurus",
    sprite = "275_baby_aqua.png",
    item = CollectibleType.COLLECTIBLE_TAURUS, -- 299
  },
  {
    name = "Gargoyle Baby",
    description = "Head of Krampus effect on hit",
    sprite = "276_baby_gargoyle.png",
  },
  {
    name = "Spiky Demon Baby",
    description = "Pre-nerf Mimic Chests",
    sprite = "277_baby_spikydemon.png",
  },
  {
    name = "Red Demon Baby",
    description = "Starts with Brimstone + Anti-Gravity",
    sprite = "278_baby_reddemon.png",
    item = CollectibleType.COLLECTIBLE_BRIMSTONE, -- 118
    item2 = CollectibleType.COLLECTIBLE_ANTI_GRAVITY, -- 222
  },
  {
    name = "Orange Demon Baby",
    description = "Explosivo tears",
    sprite = "279_baby_orangedemon.png",
  },
  {
    name = "Eye Demon Baby",
    description = "Starts with Evil Eye",
    sprite = "280_baby_eyedemon.png",
    item = CollectibleType.COLLECTIBLE_EVIL_EYE, -- 410
  },
  {
    name = "Fang Demon Baby",
    description = "Starts with Synthoil",
    sprite = "281_baby_fangdemon.png",
    item = CollectibleType.COLLECTIBLE_SYNTHOIL, -- 345
  },
  {
    name = "Ghost Baby 2",
    description = "Starts with Spirit of the Night",
    sprite = "282_baby_ghost.png",
    item = CollectibleType.COLLECTIBLE_SPIRIT_NIGHT, -- 159
  },
  {
    name = "Arachnid Baby",
    description = "Starts with 5x Daddy Longlegs",
    sprite = "283_baby_arachnid.png",
    item = CollectibleType.COLLECTIBLE_DADDY_LONGLEGS, -- 170
    itemNum = 5,
  },
  {
    name = "Bony Baby",
    description = "All bombs are doubled",
    sprite = "284_baby_bony.png",
  },
  {
    name = "Big Tongue Baby",
    description = "Flush effect on hit",
    sprite = "285_baby_bigtongue.png",
  },
  {
    name = "3D Baby",
    description = "Starts with My Reflection",
    sprite = "286_baby_3d.png",
    item = CollectibleType.COLLECTIBLE_MY_REFLECTION, -- 5
  },
  {
    name = "Suit Baby",
    description = "Starts with PHD",
    sprite = "287_baby_suit.png",
    item = CollectibleType.COLLECTIBLE_PHD, -- 75
  },
  {
    name = "Butt Baby",
    description = "Farts after shooting",
    sprite = "288_baby_butt.png",
  },
  {
    name = "Cupid Baby",
    description = "Starts with Cupid's Arrow",
    sprite = "289_baby_cupid.png",
    item = CollectibleType.COLLECTIBLE_CUPIDS_ARROW, -- 48
  },
  {
    name = "Heart Baby",
    description = "Dull Razor effect every 5 seconds",
    sprite = "290_baby_heart.png",
  },
  {
    name = "Killer Baby",
    description = "+0.2 damage per enemy killed",
    sprite = "291_baby_killer.png",
  },
  {
    name = "Lantern Baby",
    description = "Godhead aura + blindfolded",
    sprite = "292_baby_lantern.png",
    item = CollectibleType.COLLECTIBLE_GODHEAD, -- 331
    item2 = CollectibleType.COLLECTIBLE_LUDOVICO_TECHNIQUE, -- 329
  },
  {
    name = "Banshee Baby",
    description = "Crack the Sky effect on hit",
    sprite = "293_baby_banshee.png",
  },
  {
    name = "Ranger Baby",
    description = "2x range",
    sprite = "294_baby_ranger.png",
  },
  {
    name = "Rider Baby",
    description = "Starts with A Pony (improved) + blindfolded",
    sprite = "295_baby_rider.png",
    item = CollectibleType.COLLECTIBLE_PONY, -- 130
    blindfolded = true,
  },
  {
    name = "Choco Baby",
    description = "Starts with Chocolate Milk",
    sprite = "296_baby_choco.png",
    item = CollectibleType.COLLECTIBLE_CHOCOLATE_MILK, -- 69
  },
  {
    name = "Woodsman Baby",
    description = "All doors are open",
    sprite = "297_baby_woodsman.png",
  },
  {
    name = "Brunette Baby",
    description = "Starts with The Poop + Brown Cap",
    sprite = "298_baby_brunette.png",
    item = CollectibleType.COLLECTIBLE_POOP, -- 36
    trinket = TrinketType.TRINKET_BROWN_CAP, -- 90
  },
  {
    name = "Blonde Baby",
    description = "Starts with Dad's Ring",
    sprite = "299_baby_blonde.png",
    item = CollectibleType.COLLECTIBLE_DADS_RING, -- 546
  },
  {
    name = "Blue Hair Baby",
    description = "Starts with The Candle",
    sprite = "300_baby_bluehair.png",
    item = CollectibleType.COLLECTIBLE_CANDLE, -- 164
  },
  {
    name = "Bloodied Baby",
    description = "Starts with Blood Rights",
    sprite = "301_baby_bloodied.png",
    item = CollectibleType.COLLECTIBLE_BLOOD_RIGHTS, -- 186
  },
  {
    name = "Cheese Baby",
    description = "Starts with Libra + Soy Milk",
    sprite = "302_baby_cheese.png",
    item = CollectibleType.COLLECTIBLE_LIBRA, -- 304
    item2 = CollectibleType.COLLECTIBLE_SOY_MILK, -- 330
  },
  {
    name = "Pizza Baby",
    description = "Starts with Brown Nugget (improved)",
    sprite = "303_baby_pizza.png",
    item = CollectibleType.COLLECTIBLE_BROWN_NUGGET, -- 504
    delay = 3, -- In game frames
  },
  {
    name = "Hotdog Baby",
    description = "Has constant The Bean effect",
    sprite = "304_baby_hotdog.png",
    blindfolded = true,
    noEndFloors = true,
  },
  {
    name = "Nature Baby",
    description = "Starts with Sprinkler",
    sprite = "305_baby_pear.png",
    item = CollectibleType.COLLECTIBLE_SPRINKLER, -- 516
  },
  {
    name = "Borg Baby",
    description = "Starts with Teleport 2.0",
    sprite = "306_baby_borg.png",
    item = CollectibleType.COLLECTIBLE_TELEPORT_2, -- 419
  },
  {
    name = "Corrupted Baby",
    description = "Touching items/pickups causes damage",
    sprite = "307_baby_corrupted.png",
  },
  {
    name = "X Mouth Baby",
    description = "Moving Box effect on hit",
    sprite = "308_baby_xmouth.png",
  },
  {
    name = "X Eyed Baby",
    description = "Starts with Marked",
    sprite = "309_baby_xeyes.png",
    item = CollectibleType.COLLECTIBLE_MARKED, -- 394
  },
  {
    name = "Starry Eyed Baby",
    description = "Spawns a Stars Card on hit",
    sprite = "310_baby_stareyes.png",
  },
  {
    name = "Surgeon Baby",
    description = "Starts with Ventricle Razor",
    sprite = "311_baby_surgeon.png",
    item = CollectibleType.COLLECTIBLE_VENTRICLE_RAZOR, -- 396
  },
  {
    name = "Sword Baby",
    description = "Starts with Sacrificial Dagger",
    sprite = "312_baby_sword.png",
    item = CollectibleType.COLLECTIBLE_SACRIFICIAL_DAGGER, -- 172
  },
  {
    name = "Monk Baby",
    description = "PAC1F1CM",
    sprite = "313_baby_monk.png",
    seed = SeedEffect.SEED_PACIFIST, -- 25
  },
  {
    name = "Disco Baby",
    description = "Starts with Angelic Prism",
    sprite = "314_baby_disco.png",
    item = CollectibleType.COLLECTIBLE_ANGELIC_PRISM, -- 528
  },
  {
    name = "Puzzle Baby",
    description = "The D6 effect on hit",
    sprite = "315_baby_puzzle.png",
  },
  {
    name = "Speaker Baby",
    description = "X splitting tears",
    sprite = "316_baby_speaker.png",
  },
  {
    name = "Scary Baby",
    description = "Items cost hearts",
    sprite = "317_baby_scary.png",
  },
  {
    name = "Fireball Baby",
    description = "Explosion immunity + fire immunity",
    sprite = "318_baby_fireball.png",
    item = CollectibleType.COLLECTIBLE_PYROMANIAC, -- 223
  },
  {
    name = "Maw Baby",
    description = "Starts with Maw of the Void",
    sprite = "319_baby_maw.png",
    item = CollectibleType.COLLECTIBLE_MAW_OF_VOID, -- 399
  },
  {
    name = "Exploding Baby",
    description = "Kamikaze! effect upon touching an obstacle",
    sprite = "320_baby_exploding.png",
  },
  {
    name = "Cupcake Baby",
    description = "High shot speed",
    sprite = "321_baby_cupcake.png",
  },
  {
    name = "Skinless Baby",
    description = "2x damage + takes 2x damage",
    sprite = "322_baby_skinless.png",
  },
  {
    name = "Ballerina Baby",
    description = "Fires tears while moving + blindfolded",
    sprite = "323_baby_ballerina.png",
    blindfolded = true,
    SeedEffect.SEED_SHOOT_IN_MOVEMENT_DIRECTION, -- 74
  },
  {
    name = "Goblin Baby",
    description = "Starts with Rotten Penny",
    sprite = "324_baby_goblin.png",
    trinket = TrinketType.TRINKET_ROTTEN_PENNY, -- 126
  },
  {
    name = "Cool Goblin Baby",
    description = "Starts with 5x Acid Baby",
    sprite = "325_baby_coolgoblin.png",
    item = CollectibleType.COLLECTIBLE_ACID_BABY, -- 491
    itemNum = 5,
  },
  {
    name = "Geek Baby",
    description = "Starts with 20x Robo-Baby 2.0",
    sprite = "326_baby_geek.png",
    item = CollectibleType.COLLECTIBLE_ROBO_BABY_2, -- 267
    itemNum = 20,
  },
  {
    name = "Long Beard Baby",
    description = "Starts with Coupon",
    sprite = "327_baby_longbeard.png",
    item = CollectibleType.COLLECTIBLE_COUPON, -- 521
  },
  {
    name = "Muttonchops Baby",
    description = "Starts with Lachryphagy",
    sprite = "328_baby_muttonchops.png",
    item = CollectibleType.COLLECTIBLE_LACHRYPHAGY, -- 532
  },
  {
    name = "Spartan Baby",
    description = "Starts with Trinity Shield",
    sprite = "329_baby_spartan.png",
    item = CollectibleType.COLLECTIBLE_TRINITY_SHIELD, -- 243
  },
  {
    name = "Tortoise Baby",
    description = "0.5x speed + 50% chance to ignore damage",
    sprite = "330_baby_tortoise.png",
  },
  {
    name = "Slicer Baby",
    description = "Slice tears",
    sprite = "331_baby_slicer.png",
    item = CollectibleType.COLLECTIBLE_SOY_MILK, -- 330
    item2 = CollectibleType.COLLECTIBLE_PROPTOSIS, -- 261
  },
  {
    name = "Butterfly Baby 2",
    description = "Has flight + can walk through walls",
    sprite = "332_baby_butterfly.png",
    item = CollectibleType.COLLECTIBLE_TRANSCENDENCE, -- 20
  },
  {
    name = "Homeless Baby",
    description = "Starts with 20x Buddy in a Box",
    sprite = "333_baby_homeless.png",
    item = CollectibleType.COLLECTIBLE_BUDDY_IN_A_BOX, -- 518
    itemNum = 20,
  },
  {
    name = "Lumberjack Baby",
    description = "Starts with 3x Sack of Sacks",
    sprite = "334_baby_lumberjack.png",
    item = CollectibleType.COLLECTIBLE_SACK_OF_SACKS, -- 500
    itemNum = 3,
  },
  {
    name = "Cyberspace Baby",
    description = "Starts with Brimstone + Spoon Bender",
    sprite = "335_baby_cyberspace.png",
    item = CollectibleType.COLLECTIBLE_BRIMSTONE, -- 118
    item2 = CollectibleType.COLLECTIBLE_SPOON_BENDER, -- 3
  },
  {
    name = "Hero Baby",
    description = "3x damage + 3x tear rate when at 1 heart or less",
    sprite = "336_baby_hero.png",
  },
  {
    name = "Boxers Baby",
    description = "Boxing glove tears",
    sprite = "337_baby_boxers.png",
  },
  {
    name = "Wing Helmet Baby",
    description = "Starts with The Ludovico Technique + The Parasite",
    sprite = "338_baby_winghelmet.png",
    item = CollectibleType.COLLECTIBLE_LUDOVICO_TECHNIQUE, -- 329
    item2 = CollectibleType.COLLECTIBLE_PARASITE, -- 104
  },
  {
    name = "X Baby",
    description = "Shoots 4 tears diagonally",
    sprite = "339_baby_x.png",
  },
  {
    name = "O Baby 2",
    description = "Spiral tears",
    sprite = "340_baby_o.png",
  },
  {
    name = "Vomit Baby",
    description = "Must stand still every 6 seconds",
    sprite = "341_baby_vomit.png",
    time = 6 * 30 -- 6 seconds (in game frames)
  },
  {
    name = "Merman Baby",
    description = "Keys spawn as bombs",
    sprite = "342_baby_merman.png",
  },
  {
    name = "Cyborg Baby",
    description = "Sees numerical damage values", -- debug 7
    sprite = "343_baby_cyborg.png",
  },
  {
    name = "Barbarian Baby",
    description = "Mama Mega bombs",
    sprite = "344_baby_barbarian.png",
  },
  {
    name = "Locust Baby",
    description = "Starts with Soy Milk + booger tears",
    sprite = "345_baby_locust.png",
    item = CollectibleType.COLLECTIBLE_SOY_MILK, -- 330
  },
  {
    name = "Twotone Baby",
    description = "Starts with Blank Card",
    sprite = "346_baby_twotone.png",
    item = CollectibleType.COLLECTIBLE_BLANK_CARD, -- 286
  },
  {
    name = "2600 Baby",
    description = "Backwards tears",
    sprite = "347_baby_2600.png",
  },
  {
    name = "Fourtone Baby",
    description = "Starts with The Candle + blindfolded",
    sprite = "348_baby_fourtone.png",
    item = CollectibleType.COLLECTIBLE_CANDLE, -- 164
    blindfolded = true,
  },
  {
    name = "Grayscale Baby",
    description = "Delirious effect every 10 seconds",
    sprite = "349_baby_grayscale.png",
  },
  {
    name = "Rabbit Baby",
    description = "Starts with Guppy's Paw",
    sprite = "350_baby_rabbit.png",
    item = CollectibleType.COLLECTIBLE_GUPPYS_PAW, -- 133
  },
  {
    name = "Mouse Baby",
    description = "Coin doors in uncleared rooms",
    sprite = "351_baby_mouse.png",
    item = CollectibleType.COLLECTIBLE_PAY_TO_PLAY, -- 380
  },
  {
    name = "Critter Baby",
    description = "Starts with Infestation 2",
    sprite = "352_baby_critter.png",
    item = CollectibleType.COLLECTIBLE_INFESTATION_2, -- 234
  },
  {
    name = "Blue Robot Baby",
    description = "Starts with Broken Watch",
    sprite = "353_baby_bluerobot.png",
    item = CollectibleType.COLLECTIBLE_BROKEN_WATCH, -- 337
  },
  {
    name = "Pilot Baby",
    description = "Starts with Dr. Fetus + Haemolacria",
    sprite = "354_baby_pilot.png",
    item = CollectibleType.COLLECTIBLE_DR_FETUS, -- 52
    item2 = CollectibleType.COLLECTIBLE_HAEMOLACRIA, -- 531
  },
  {
    name = "Red Plumber Baby",
    description = "Starts with Locust of War",
    sprite = "355_baby_redplumber.png",
    trinket = TrinketType.TRINKET_LOCUST_OF_WRATH, -- 113
  },
  {
    name = "Green Plumber Baby",
    description = "Starts with Locust of Pestilence",
    sprite = "356_baby_greenplumber.png",
    trinket = TrinketType.TRINKET_LOCUST_OF_PESTILENCE, -- 114
  },
  {
    name = "Yellow Plumber Baby",
    description = "Starts with Locust of Conquest",
    sprite = "357_baby_yellowplumber.png",
    trinket = TrinketType.TRINKET_LOCUST_OF_CONQUEST, -- 117
  },
  {
    name = "Purple Plumber Baby",
    description = "Starts with Locust of Death",
    sprite = "358_baby_purpleplumber.png",
    trinket = TrinketType.TRINKET_LOCUST_OF_DEATH, -- 116
  },
  {
    name = "Tanooki Baby",
    description = "Mr. ME! effect on hit",
    sprite = "359_baby_tanooki.png",
  },
  {
    name = "Mushroom Man Baby",
    description = "Starts with Magic Mushroom",
    sprite = "360_baby_mushroomman.png",
    item = CollectibleType.COLLECTIBLE_MAGIC_MUSHROOM, -- 12
  },
  {
    name = "Mushroom Girl Baby",
    description = "Every 8th shot is a bomb",
    sprite = "361_baby_mushroomgirl.png",
    num = 8,
  },
  {
    name = "Cannonball Baby",
    description = "Starts with Samson's Chains",
    sprite = "362_baby_cannonball.png",
    item = CollectibleType.COLLECTIBLE_SAMSONS_CHAINS, -- 321
  },
  {
    name = "Froggy Baby",
    description = "Starts with Ludo + Brimstone + Wiggle Worm",
    sprite = "363_baby_froggy.png",
    item = CollectibleType.COLLECTIBLE_LUDOVICO_TECHNIQUE, -- 329
    item2 = CollectibleType.COLLECTIBLE_BRIMSTONE, -- 118
    trinket = TrinketType.TRINKET_WIGGLE_WORM, -- 10
  },
  {
    name = "Turtle Dragon Baby",
    description = "Fiery tears",
    sprite = "364_baby_turtledragon.png",
  },
  {
    name = "Shell Suit Baby",
    description = "Starts with Burnt Penny",
    sprite = "365_baby_shellsuit.png",
    trinket = TrinketType.TRINKET_BURNT_PENNY, -- 50
  },
  {
    name = "Fiery Baby",
    description = "Spawns a fire on hit",
    sprite = "366_baby_fiery.png",
  },
  {
    name = "Mean Mushroom Baby",
    description = "Starts with 5x Sack of Pennies",
    sprite = "367_baby_meanmushroom.png",
    item = CollectibleType.COLLECTIBLE_SACK_OF_PENNIES, -- 94
    itemNum = 5,
  },
  {
    name = "Arcade Baby",
    description = "Razor blade tears",
    sprite = "368_baby_arcade.png",
  },
  {
    name = "Scared Ghost Baby",
    description = "2x speed",
    sprite = "369_baby_scaredghost.png",
  },
  {
    name = "Blue Ghost Baby",
    description = "Max tear rate",
    sprite = "370_baby_blueghost.png",
  },
  {
    name = "Red Ghost Baby",
    description = "+10 damage",
    sprite = "371_baby_redghost.png",
  },
  {
    name = "Pink Ghost Baby",
    description = "Charm tears",
    sprite = "372_baby_pinkghost.png",
  },
  {
    name = "Orange Ghost Baby",
    description = "Placed bombs are Mega Troll Bombs",
    sprite = "373_baby_orangeghost.png",
  },
  {
    name = "Pink Princess Baby",
    description = "Summons random stomps",
    sprite = "374_baby_pinkprincess.png",
  },
  {
    name = "Yellow Princess Baby",
    description = "Starts with Cracked Crown",
    sprite = "375_baby_yellowprincess.png",
    trinket = TrinketType.TRINKET_CRACKED_CROWN, -- 92
  },
  {
    name = "Dino Baby",
    description = "Gains a explosive egg per enemy killed",
    sprite = "376_baby_dino.png",
  },
  {
    name = "Elf Baby",
    description = "Starts with Spear of Destiny (improved) + explosion immunity + blindfolded",
    sprite = "377_baby_elf.png",
    item = CollectibleType.COLLECTIBLE_SPEAR_OF_DESTINY, -- 400
    item2 = CollectibleType.COLLECTIBLE_PYROMANIAC, -- 223
    blindfolded = true,
  },
  {
    name = "Dark Elf Baby",
    description = "Book of the Dead effect on hit",
    sprite = "378_baby_darkelf.png",
  },
  {
    name = "Dark Knight Baby",
    description = "Starts with 5x Dry Baby",
    sprite = "379_baby_darkknight.png",
    item = CollectibleType.COLLECTIBLE_DRY_BABY, -- 265
    itemNum = 5,
  },
  {
    name = "Octopus Baby",
    description = "Tears make black creep",
    sprite = "380_baby_octopus.png",
  },
  {
    name = "Orange Pig Baby",
    description = "Double items",
    sprite = "381_baby_orangepig.png",
  },
  {
    name = "Blue Pig Baby",
    description = "Spawns a Mega Troll Bomb every 5 seconds",
    sprite = "382_baby_bluepig.png",
  },
  {
    name = "Elf Princess Baby",
    description = "Starts with 10x Mom's Razor",
    sprite = "383_baby_elfprincess.png",
    item = CollectibleType.COLLECTIBLE_MOMS_RAZOR, -- 508
    itemNum = 10,
  },
  {
    name = "Fishman Baby",
    description = "Spawns a random bomb per room cleared",
    sprite = "384_baby_fishman.png",
  },
  {
    name = "Fairyman Baby",
    description = "-30% damage on hit",
    sprite = "385_baby_fairyman.png",
  },
  {
    name = "Imp Baby",
    description = "Starts with Compost",
    sprite = "386_baby_imp.png",
    item = CollectibleType.COLLECTIBLE_COMPOST, -- 480
  },
  {
    name = "Worm Baby 2",
    description = "Starts with Leech",
    sprite = "387_baby_worm.png",
    item = CollectibleType.COLLECTIBLE_LEECH, -- 270
    itemNum = 20,
  },
  {
    name = "Blue Wrestler Baby",
    description = "Starts with Capricorn",
    sprite = "388_baby_bluewrestler.png",
    item = CollectibleType.COLLECTIBLE_CAPRICORN, -- 307
  },
  {
    name = "Red Wrestler Baby",
    description = "Uses pills immediately",
    sprite = "389_baby_redwrestler.png",
  },
  {
    name = "Toast Baby",
    description = "Enemies leave a Red Candle fire upon death",
    sprite = "390_baby_toast.png",
  },
  {
    name = "Roboboy Baby",
    description = "Starts with Technology + A Lump of Coal",
    sprite = "391_baby_roboboy.png",
    item = CollectibleType.COLLECTIBLE_TECHNOLOGY, -- 68
    item2 = CollectibleType.COLLECTIBLE_LUMP_OF_COAL, -- 132
  },
  {
    name = "Liberty Baby",
    description = "Starts with Liberty Cap",
    sprite = "392_baby_liberty.png",
    trinket = TrinketType.TRINKET_LIBERTY_CAP, -- 32
  },
  {
    name = "Dream Knight Baby",
    description = "Starts with Super Bum",
    sprite = "393_baby_dreamknight.png",
    item = CollectibleType.COLLECTIBLE_BUM_FRIEND, -- 144
    item2 = CollectibleType.COLLECTIBLE_DARK_BUM, -- 278
    -- Key Bum is given separately
  },
  {
    name = "Cowboy Baby",
    description = "Pickups shoot",
    sprite = "394_baby_cowboy.png",
  },
  {
    name = "Mermaid Baby",
    description = "Bombs spawn as keys",
    sprite = "395_baby_mermaid.png",
  },
  {
    name = "Plague Baby",
    description = "Leaves a trail of green creep",
    sprite = "396_baby_plague.png",
  },
  {
    name = "Space Soldier Baby",
    description = "Starts with Void",
    sprite = "397_baby_spacesoldier.png",
    item = CollectibleType.COLLECTIBLE_VOID, -- 477
  },
  {
    name = "Dark Space Soldier Baby",
    description = "Chaos card tears",
    sprite = "398_baby_darkspacesoldier.png",
  },
  {
    name = "Gas Mask Baby",
    description = "Starts with Wait What?",
    sprite = "399_baby_gasmask.png",
    item = CollectibleType.COLLECTIBLE_WAIT_WHAT, -- 484
  },
  {
    name = "Tomboy Baby",
    description = "Starts with We Need to Go Deeper! (uncharged)",
    sprite = "400_baby_tomboy.png",
    item = CollectibleType.COLLECTIBLE_WE_NEED_GO_DEEPER, -- 84
    uncharged = true,
  },
  {
    name = "Corgi Baby",
    description = "Spawns a fly every 1.5 seconds",
    sprite = "401_baby_corgi.png",
  },
  {
    name = "Unicorn Baby",
    description = "Starts with My Little Unicorn",
    sprite = "402_baby_unicorn.png",
    item = CollectibleType.COLLECTIBLE_MY_LITTLE_UNICORN, -- 77
  },
  {
    name = "Pixie Baby",
    description = "Starts with 3x YO LISTEN! (improved)",
    sprite = "403_baby_pixie.png",
    item = CollectibleType.COLLECTIBLE_YO_LISTEN, -- 492
    itemNum = 3,
  },
  {
    name = "Referee Baby",
    description = "Starts with Crooked Penny",
    sprite = "404_baby_referee.png",
    item = CollectibleType.COLLECTIBLE_CROOKED_PENNY, -- 485
  },
  {
    name = "Deal With It Baby",
    description = "Starts with Teleport",
    sprite = "405_baby_dealwithit.png",
    item = CollectibleType.COLLECTIBLE_TELEPORT, -- 44
  },
  {
    name = "Astronaut Baby",
    description = "Tears have a 5% chance to create a Black Hole effect",
    sprite = "406_baby_astronaut.png",
  },
  {
    name = "Blurred Baby",
    description = "Starts with Virgo",
    sprite = "407_baby_blurred.png",
    item = CollectibleType.COLLECTIBLE_VIRGO, -- 303
  },
  {
    name = "Censored Baby",
    description = "All enemies get confused on hit",
    sprite = "408_baby_censored.png",
  },
  {
    name = "Cool Ghost Baby",
    description = "Starts with Flock of Succubi",
    sprite = "409_baby_coolghost.png",
    item = Isaac.GetItemIdByName("Flock of Succubi"),
  },
  {
    name = "Gills Baby",
    description = "Splash tears",
    sprite = "410_baby_gills.png",
  },
  {
    name = "Blue Hat Baby",
    description = "Starts with Blue Map",
    sprite = "411_baby_bluehat.png",
    item = CollectibleType.COLLECTIBLE_BLUE_MAP, -- 246
  },
  {
    name = "Catsuit Baby",
    description = "Guppy's Paw effect on hit",
    sprite = "412_baby_catsuit.png",
  },
  {
    name = "Pirate Baby",
    description = "Starts with Treasure Map",
    sprite = "413_baby_pirate.png",
    item = CollectibleType.COLLECTIBLE_TREASURE_MAP, -- 54
  },
  {
    name = "Super Robo Baby",
    description = "Starts with Broken Remote",
    sprite = "414_baby_superrobo.png",
    trinket = TrinketType.TRINKET_BROKEN_REMOTE, -- 4
  },
  {
    name = "Lightmage Baby",
    description = "Starts with Trisagion",
    sprite = "415_baby_lightmage.png",
    item = CollectibleType.COLLECTIBLE_TRISAGION, -- 533
  },
  {
    name = "Puncher Baby",
    description = "Starts with 10x Punching Bag",
    sprite = "416_baby_puncher.png",
    item = CollectibleType.COLLECTIBLE_PUNCHING_BAG, -- 281
    itemNum = 10,
  },
  {
    name = "Holy Knight Baby",
    description = "Starts with Eucharist",
    sprite = "417_baby_holyknight.png",
    item = CollectibleType.COLLECTIBLE_EUCHARIST, -- 499
  },
  {
    name = "Shadowmage Baby",
    description = "Starts with Death's List",
    sprite = "418_baby_shadowmage.png",
    item = CollectibleType.COLLECTIBLE_DEATH_LIST, -- 530
  },
  {
    name = "Firemage Baby",
    description = "Starts with Fire Mind + 13 luck",
    sprite = "419_baby_firemage.png",
    item = CollectibleType.COLLECTIBLE_FIRE_MIND, -- 257
  },
  {
    name = "Priest Baby",
    description = "Starts with Scapular",
    sprite = "420_baby_priest.png",
    item = CollectibleType.COLLECTIBLE_SCAPULAR, -- 142
  },
  {
    name = "Zipper Baby 2",
    description = "Starts with Door Stop",
    sprite = "421_baby_zipper.png",
    trinket = TrinketType.TRINKET_DOOR_STOP, -- 124
  },
  {
    name = "Bag Baby",
    description = "Starts with Sack Head",
    sprite = "422_baby_bag.png",
    item = CollectibleType.COLLECTIBLE_SACK_HEAD, -- 424
  },
  {
    name = "Sailor Baby",
    description = "Starts with The Compass",
    sprite = "423_baby_sailor.png",
    item = CollectibleType.COLLECTIBLE_COMPASS, -- 21
  },
  {
    name = "Rich Baby",
    description = "Starts with A Dollar",
    sprite = "424_baby_rich.png",
    item = CollectibleType.COLLECTIBLE_DOLLAR, -- 18
  },
  {
    name = "Toga Baby",
    description = "Starts with Finger! (improved)",
    sprite = "425_baby_toga.png",
    item = CollectibleType.COLLECTIBLE_FINGER, -- 467
    itemNum = 10,
  },
  {
    name = "Knight Baby",
    description = "Starts with 5x 7 Seals",
    sprite = "426_baby_knight.png",
    item = CollectibleType.COLLECTIBLE_LIL_HARBINGERS, -- 526
    itemNum = 5,
  },
  {
    name = "Black Knight Baby",
    description = "Starts with Black Hole",
    sprite = "427_baby_blackknight.png",
  },
  {
    name = "Magic Cat Baby",
    description = "Has constant Kidney Bean effect",
    sprite = "428_baby_magiccat.png",
  },
  {
    name = "Little Horn Baby",
    description = "Void tears",
    sprite = "429_baby_littlehorn.png",
  },
  {
    name = "Folder Baby",
    description = "Swaps item/shop pools + devil/angel pools",
    sprite = "430_baby_folder.png",
  },
  {
    name = "Driver Baby",
    description = "Slippery movement",
    sprite = "431_baby_driver.png",
    seed = SeedEffect.SEED_ICE_PHYSICS, -- 52
  },
  {
    name = "Dragon Baby",
    description = "Starts with Lil Brimstone",
    sprite = "432_baby_dragon.png",
    item = CollectibleType.COLLECTIBLE_LIL_BRIMSTONE, -- 275
  },
  {
    name = "Downwell Baby",
    description = "Starts with Eden's Soul",
    sprite = "433_baby_downwell.png",
    item = CollectibleType.COLLECTIBLE_EDENS_SOUL, -- 490
  },
  {
    name = "Cylinder Baby",
    description = "Starts with Wooden Cross",
    sprite = "434_baby_cylinder.png",
    trinket = TrinketType.TRINKET_WOODEN_CROSS, -- 121
  },
  {
    name = "Cup Baby",
    description = "Card Against Humanity on hit",
    sprite = "435_baby_cup.png",
  },
  {
    name = "Cave Robot Baby",
    description = "Starts with Hairpin",
    sprite = "436_baby_cave_robot.png",
    trinket = TrinketType.TRINKET_HAIRPIN, -- 120
  },
  {
    name = "Breadmeat Hoodiebread Baby",
    description = "Starts with Eye of Greed",
    sprite = "437_baby_breadmeat_hoodiebread.png",
    item = CollectibleType.COLLECTIBLE_EYE_OF_GREED, -- 450
  },
  {
    name = "Big Mouth Baby 2",
    description = "Starts with Mega Blast",
    sprite = "438_baby_bigmouth.png",
    item = CollectibleType.COLLECTIBLE_MEGA_SATANS_BREATH, -- 441
  },
  {
    name = "Afro Rainbow Baby",
    description = "Starts with 20x Rainbow Baby",
    sprite = "439_baby_afro_rainbow.png",
    item = CollectibleType.COLLECTIBLE_RAINBOW_BABY, -- 174
    itemNum = 20,
  },
  {
    name = "Afro Baby",
    description = "Starts with D1",
    sprite = "440_baby_afro.png",
    item = CollectibleType.COLLECTIBLE_D1, -- 476
  },
  {
    name = "TV Baby",
    description = "Starts with Doctor's Remote",
    sprite = "441_baby_tv.png",
    item = CollectibleType.COLLECTIBLE_DOCTORS_REMOTE, -- 47
  },
  {
    name = "Tooth Head Baby",
    description = "Tooth tears",
    sprite = "442_baby_tooth.png",
  },
  {
    name = "Tired Baby",
    description = "Starts with 5x Bum Friend",
    sprite = "443_baby_tired.png",
    item = CollectibleType.COLLECTIBLE_BUM_FRIEND, -- 144
    itemNum = 5,
  },
  {
    name = "Steroids Baby",
    description = "Starts with Growth Hormones",
    sprite = "444_baby_steroids.png",
    item = CollectibleType.COLLECTIBLE_GROWTH_HORMONES, -- 70
  },
  {
    name = "Soap Monster Baby",
    description = "Starts with Butter",
    sprite = "445_baby_soap_monster.png",
    trinket = TrinketType.TRINKET_BUTTER, -- 122
  },
  {
    name = "Rojen Whitefox Baby",
    description = "Starts with Filigree Feather",
    sprite = "446_baby_rojen_whitefox.png",
    trinket = TrinketType.TRINKET_FILIGREE_FEATHERS, -- 123
  },
  {
    name = "Rocket Baby",
    description = "Starts with Super Magnet",
    sprite = "447_baby_rocket.png",
    trinket = TrinketType.TRINKET_SUPER_MAGNET, -- 68
  },
  {
    name = "Nurf Baby",
    description = "Starts with 3x Rune Bag",
    sprite = "448_baby_nurf.png",
    item = CollectibleType.COLLECTIBLE_RUNE_BAG, -- 389
    itemNum = 3,
  },
  {
    name = "Mutated Fish Baby",
    description = "Summons a Sprinkler every 7 seconds",
    sprite = "449_baby_mutated_fish.png",
  },
  {
    name = "Moth Baby",
    description = "Starts with Soy Milk + Ipecac",
    sprite = "450_baby_moth.png",
    item = CollectibleType.COLLECTIBLE_SOY_MILK, -- 330
    item2 = CollectibleType.COLLECTIBLE_IPECAC, -- 149
  },
  {
    name = "Buttface Baby",
    description = "Spawns a Black Poop per enemy killed",
    sprite = "451_baby_buttface.png",
  },
  {
    name = "Flying Candle Baby",
    description = "Starts with Night Light",
    sprite = "452_baby_flying_candle.png",
    item = CollectibleType.COLLECTIBLE_NIGHT_LIGHT, -- 425
  },
  {
    name = "Graven Baby",
    description = "Starts with Level 4 Bumbo (improved)",
    sprite = "453_baby_graven.png",
    item = CollectibleType.COLLECTIBLE_BUMBO, -- 385
  },
  {
    name = "Gizzy Chargeshot Baby",
    description = "Starts with Poke Go",
    sprite = "454_baby_gizzy_chargeshot.png",
    item = CollectibleType.COLLECTIBLE_POKE_GO, -- 505
    -- (adding multiple Poke Gos does nothing)
  },
  {
    name = "Green Koopa Baby",
    description = "Shoots bouncy green shells",
    sprite = "455_baby_green_koopa.png",
  },
  {
    name = "Handsome Mr. Frog Baby",
    description = "Spawns 20 Blue Flies on hit",
    sprite = "456_baby_handsome_mrfrog.png",
    num = 20,
  },
  {
    name = "Pumpkin Guy Baby",
    description = "Starts with Pop!",
    sprite = "457_baby_pumpkin_guy.png",
    item = CollectibleType.COLLECTIBLE_POP, -- 529
  },
  {
    name = "Red Koopa Baby",
    description = "Shoots bouncy & homing red shells",
    sprite = "458_baby_red_koopa.png",
  },
  {
    name = "Sad Bunny Baby",
    description = "Accuracy increases tear rate",
    sprite = "459_baby_sad_bunny.png",
  },
  {
    name = "Saturn Baby 2",
    description = "Starts with Baby-Bender",
    sprite = "460_baby_saturn.png",
    trinket = TrinketType.TRINKET_BABY_BENDER, -- 127
  },
  {
    name = "Toast Boy Baby",
    description = "Starts with 5x Friend Zone",
    sprite = "461_baby_toast_boy.png",
    item = CollectibleType.COLLECTIBLE_FRIEND_ZONE, -- 364
    itemNum = 5,
  },
  {
    name = "Voxdog Baby",
    description = "Bomb sack tears",
    sprite = "462_baby_voxdog.png",
  },
  {
    name = "404 Baby",
    description = "Acid trip",
    sprite = "463_baby_404.png",
  },
  {
    name = "Arrowhead Baby",
    description = "Starts with Technology Zero + Cupid's Arrow",
    sprite = "464_baby_arrowhead.png",
    item = CollectibleType.COLLECTIBLE_TECHNOLOGY_ZERO, -- 524
    item2 = CollectibleType.COLLECTIBLE_CUPIDS_ARROW, -- 48
  },
  {
    name = "Beanie Baby",
    description = "Starts with Smelter",
    sprite = "465_baby_beanie.png",
    item = CollectibleType.COLLECTIBLE_SMELTER, -- 479
  },
  {
    name = "Blindcursed Baby",
    description = "Invisible tears",
    sprite = "466_baby_blindcursed.png",
  },
  {
    name = "Burning Baby",
    description = "Starts with Fire Mind",
    sprite = "467_baby_burning.png",
    item = CollectibleType.COLLECTIBLE_FIRE_MIND, -- 257
  },
  {
    name = "Cursor Baby",
    description = "Starts with Pause",
    sprite = "468_baby_cursor.png",
    item = CollectibleType.COLLECTIBLE_PAUSE, -- 478
  },
  {
    name = "Fly Baby",
    description = "Mass splitting tears",
    sprite = "469_baby_flybaby.png",
  },
  {
    name = "Headphone Baby",
    description = "Soundwave tears",
    sprite = "470_baby_headphone.png",
  },
  {
    name = "Knife Baby",
    description = "Starts with Mom's Knife",
    sprite = "471_baby_knife.png",
    item = CollectibleType.COLLECTIBLE_MOMS_KNIFE, -- 114
  },
  {
    name = "Mufflerscarf Baby",
    description = "All enemies get freezed on hit",
    sprite = "472_baby_mufflerscarf.png",
  },
  {
    name = "Robbermask Baby",
    description = "+1 damage per pickup taken",
    sprite = "473_baby_robbermask.png",
  },
  {
    name = "Scoreboard Baby",
    description = "Dies 1 minute after getting hit",
    sprite = "474_baby_scoreboard.png",
  },
  {
    name = "So Many Eyes Baby",
    description = "Starts with Mutant Spider + The Inner Eye",
    sprite = "475_baby_somanyeyes.png",
    item = CollectibleType.COLLECTIBLE_MUTANT_SPIDER, -- 153
    item2 = CollectibleType.COLLECTIBLE_INNER_EYE, -- 2
  },
  {
    name = "Text Baby",
    description = "0.5x damage",
    sprite = "476_baby_text.png",
  },
  {
    name = "Wing Baby",
    description = "Starts with White Pony",
    sprite = "477_baby_wing.png",
    item = CollectibleType.COLLECTIBLE_WHITE_PONY, -- 181
  },
  {
    name = "Tooth Baby",
    description = "Starts with Dead Tooth",
    sprite = "478_baby_tooth.png",
    item = CollectibleType.COLLECTIBLE_DEAD_TOOTH, -- 446
  },
  {
    name = "Haunt Baby",
    description = "Starts with 10x Lil Haunt",
    sprite = "479_baby_haunt.png",
    item = CollectibleType.COLLECTIBLE_LIL_HAUNT, -- 277
    itemNum = 10,
  },
  {
    name = "Imp Baby 2",
    description = "Acid tears",
    sprite = "480_baby_imp.png",
  },
  {
    name = "32bit Baby",
    description = "No HUD",
    sprite = "481_baby_32bit.png",
    seed = SeedEffect.SEED_NO_HUD, -- 10
  },
  {
    name = "Adventure Baby",
    description = "Starts with Moving Box",
    sprite = "482_baby_adventure.png",
    item = CollectibleType.COLLECTIBLE_MOVING_BOX, -- 523
  },
  {
    name = "Bubbles Baby",
    description = "+1 damage per pill used",
    sprite = "483_baby_bubbles.png",
  },
  {
    name = "Bulb Baby",
    description = "Starts with Vibrant Bulb",
    sprite = "484_baby_bulb.png",
    trinket = TrinketType.TRINKET_VIBRANT_BULB, -- 100
  },
  {
    name = "Cool Orange Baby",
    description = "Summons random missiles",
    sprite = "485_baby_coolorange.png",
  },
  {
    name = "Crazy Ghost Baby",
    description = "Starts with 20x Ghost Baby",
    sprite = "486_baby_crazyghost.png",
    item = CollectibleType.COLLECTIBLE_GHOST_BABY, -- 163
    itemNum = 20,
  },
  {
    name = "Cursed Pillow Baby",
    description = "Missed tears cause damage",
    sprite = "487_baby_cursedpillow.png",
  },
  {
    name = "Egg Baby",
    description = "Random pill effect on hit",
    sprite = "488_baby_egg.png",
  },
  {
    name = "Factory Baby",
    description = "Starts with Clockwork Assembly",
    sprite = "489_baby_factory.png",
    item = Isaac.GetItemIdByName("Clockwork Assembly"),
  },
  {
    name = "Falling Baby",
    description = "Starts with Incubus",
    sprite = "490_baby_falling.png",
    item = CollectibleType.COLLECTIBLE_INCUBUS, -- 360
  },
  {
    name = "Funny Baby",
    description = "Enemies spawn Mega Troll Bombs on death",
    sprite = "491_baby_funny.png",
  },
  {
    name = "Gamer Baby",
    description = "Has constant Retro Vision pill effect",
    sprite = "492_baby_gamer.png",
  },
  {
    name = "Glittery Peach Baby",
    description = "Teleports to the boss room after 6 hits",
    sprite = "493_baby_glitterypeach.png",
    num = 6,
  },
  {
    name = "Pompadour Baby",
    description = "Shrink tears",
    sprite = "494_baby_pompadour.png",
  },
  {
    name = "Head Kick Baby",
    description = "Starts with Kamikaze! + Host Hat",
    sprite = "495_baby_headkick.png",
    item = CollectibleType.COLLECTIBLE_KAMIKAZE, -- 40
    item2 = CollectibleType.COLLECTIBLE_HOST_HAT, -- 375
  },
  {
    name = "Horn Baby",
    description = "Starts with Dark Bum",
    sprite = "496_baby_horn.png",
    item = CollectibleType.COLLECTIBLE_DARK_BUM, -- 278
  },
  {
    name = "Ichor Baby",
    description = "Starts with 5x Lil Spewer",
    sprite = "497_baby_ichor.png",
    item = CollectibleType.COLLECTIBLE_LIL_SPEWER, -- 537
    itemNum = 5,
  },
  {
    name = "Ill Baby",
    description = "Bob's Brain tears",
    sprite = "498_baby_ill.png",
  },
  {
    name = "Lazy Baby",
    description = "Zit tears",
    sprite = "499_baby_lazy.png",
  },
  {
    name = "Mern Baby",
    description = "Double tears",
    sprite = "500_baby_mern.png",
  },
  {
    name = "Necro Baby",
    description = "Starts with Book of the Dead",
    sprite = "501_baby_necro.png",
    item = CollectibleType.COLLECTIBLE_BOOK_OF_THE_DEAD, -- 545
  },
  {
    name = "Peeping Baby",
    description = "Starts with 8x Bloodshot Eye",
    sprite = "502_baby_peeping.png",
    item = CollectibleType.COLLECTIBLE_BLOODSHOT_EYE, -- 509
    itemNum = 8,
  },
  {
    name = "Penance Baby",
    description = "Starts with 3x Sworn Protector",
    sprite = "503_baby_penance.png",
    item = CollectibleType.COLLECTIBLE_SWORN_PROTECTOR, -- 363
    itemNum = 3,
  },
  {
    name = "Psychic Baby",
    description = "Starts with Abel; tears come from Abel",
    sprite = "504_baby_psychic.png",
    item = CollectibleType.COLLECTIBLE_ABEL, -- 188
  },
  {
    name = "Puppet Baby",
    description = "Starts with 5x Key Bum",
    sprite = "505_baby_puppet.png",
    item = CollectibleType.COLLECTIBLE_KEY_BUM, -- 388
    itemNum = 5,
  },
  {
    name = "Reaper Baby",
    description = "Starts with Sacrificial Altar",
    sprite = "506_baby_reaper.png",
    item = CollectibleType.COLLECTIBLE_SACRIFICIAL_ALTAR, -- 536
  },
  {
    name = "Road Kill Baby",
    description = "Starts with Pointy Rib (improved) + blindfolded",
    sprite = "507_baby_roadkill.png",
    item = CollectibleType.COLLECTIBLE_POINTY_RIB, -- 544
    blindfolded = true,
  },
  {
    name = "Sausage Lover Baby",
    description = "Summons Monstro every 5 seconds",
    sprite = "508_baby_sausagelover.png",
  },
  {
    name = "Scribble Baby",
    description = "Starts with Lead Pencil",
    sprite = "509_baby_scribble.png",
    item = CollectibleType.COLLECTIBLE_LEAD_PENCIL, -- 444
  },
  {
    name = "Star Plant Baby",
    description = "Starts with Dim Bulb",
    sprite = "510_baby_starplant.png",
    trinket = TrinketType.TRINKET_DIM_BULB, -- 101
  },
  {
    name = "Twitchy Baby",
    description = "Tear rate oscillates",
    sprite = "511_baby_twitchy.png",
    num = 60, -- Time between fire rate changes, in game frames
    min = -4, -- Tear delay change
    max = 4, -- Tear delay change
  },
  {
    name = "Witch Baby",
    description = "Starts with Crystal Ball (uncharged)",
    sprite = "512_baby_witch.png",
    item = CollectibleType.COLLECTIBLE_CRYSTAL_BALL, -- 158
    uncharged = true,
  },
  {
    name = "Workshop Baby",
    description = "Starts with Humbling Bundle",
    sprite = "513_baby_workshop.png",
    item = CollectibleType.COLLECTIBLE_HUMBLEING_BUNDLE, -- 203
  },
  {
    name = "Hooligan Baby",
    description = "Double enemies",
    sprite = "514_baby_hooligan.png",
  },
  {
    name = "Half Spider Baby",
    description = "Starts with Spider Mod",
    sprite = "515_baby_halfspider.png",
    item = CollectibleType.COLLECTIBLE_SPIDER_MOD, -- 403
  },
  {
    name = "Silly Baby",
    description = "Has constant I'm Excited pill effect",
    sprite = "516_baby_silly.png",
  },
  {
    name = "Master Cook Baby",
    description = "Egg tears",
    sprite = "517_baby_mastercook.png",
  },
  {
    name = "Green Pepper Baby",
    description = "Starts with Serpent's Kiss",
    sprite = "518_baby_greenpepper.png",
    item = CollectibleType.COLLECTIBLE_SERPENTS_KISS, -- 393
  },
  {
    name = "Baggy Cap Baby",
    description = "Cannot bomb through rooms",
    sprite = "519_baby_baggycap.png",
  },
  {
    name = "Stylish Baby",
    description = "Starts with Store Credit",
    sprite = "520_baby_stylish.png",
    trinket = TrinketType.TRINKET_STORE_CREDIT -- 13
  },
  {
    -- Spider Baby is number 0, but we move it to 521 since Lua tables are 1-indexed
    name = "Spider Baby",
    description = "Shoots a Blue Spider every 2nd tear",
    sprite = "000_baby_spider.png",
  },
  {
    name = "Brother Bobby", -- 522
    description = "Slings Godhead aura",
    sprite = "familiar_shooters_01_brotherbobby.png",
    item = CollectibleType.COLLECTIBLE_MOMS_KNIFE, -- 114
  },
  {
    name = "Sister Maggy", -- 523
    description = "Loses last item on 2nd hit (per room)",
    sprite = "familiar_shooters_07_sistermaggie.png",
  },
  {
    name = "Robo-Baby", -- 524
    description = "Starts with Technology",
    sprite = "familiar_shooters_06_robobaby.png",
    item = CollectibleType.COLLECTIBLE_TECHNOLOGY, -- 68
  },
  {
    name = "Little Gish", -- 525
    description = "All items from the Curse Room pool",
    sprite = "familiar_shooters_04_littlegish.png",
  },
  {
    name = "Little Steven", -- 526
    description = "Starts with Chaos",
    sprite = "familiar_shooters_05_littlesteve.png",
    item = CollectibleType.COLLECTIBLE_CHAOS, -- 402
  },
  {
    name = "Demon Baby", -- 527
    description = "Free devil deals",
    sprite = "familiar_shooters_02_demonbaby.png",
  },
  {
    name = "Ghost Baby", -- 528
    description = "All items from the Shop pool",
    sprite = "familiar_shooters_09_ghostbaby.png",
  },
  {
    name = "Harlequin Baby", -- 529
    description = "V tears",
    sprite = "familiar_shooters_10_harlequinbaby.png",
    item = CollectibleType.COLLECTIBLE_THE_WIZ, -- 358
  },
  {
    name = "Rainbow Baby", -- 530
    description = "Chest per enemy killed",
    sprite = "familiar_shooters_11_rainbowbaby.png",
  },
  {
    name = "Abel", -- 531
    description = "Missed tears cause paralysis",
    sprite = "familiar_shooters_08_abel.png",
  },
  {
    name = "Robo-Baby 2.0", -- 532
    description = "Starts with Undefined (uncharged)",
    sprite = "familiar_shooters_267_robobaby20.png",
    item = CollectibleType.COLLECTIBLE_UNDEFINED, -- 324
    uncharged = true,
  },
  {
    name = "Rotten Baby", -- 533
    description = "Shoots Blue Flies",
    sprite = "costume_268_rottenbaby.png",
  },
  {
    name = "Lil Brimstone", -- 534
    description = "Starts with Brimstone",
    sprite = "costume_rebirth_77_lilbrimstone.png",
    item = CollectibleType.COLLECTIBLE_BRIMSTONE, -- 118
  },
  {
    name = "Mongo Baby", -- 535
    description = "All items from the Angel Room pool",
    sprite = "familiar_shooters_322_mongobaby.png",
  },
  {
    name = "Incubus", -- 536
    description = "All items from the Devil Room pool",
    sprite = "familiar_shooters_80_incubus.png",
  },
  {
    name = "Fate's Reward", -- 537
    description = "Items cost money",
    sprite = "familiar_shooters_81_fatesreward.png",
  },
  {
    name = "Seraphim", -- 538
    description = "Has Censer aura",
    sprite = "familiars_shooters_92_seraphim.png",
    item = CollectibleType.COLLECTIBLE_CENSER, -- 387
  },
  {
    name = "Lil' Loki", -- 539
    description = "Cross tears",
    sprite = "familiar_097_shooters_lilloki.png",
  },
  {
    name = "Lil Monstro", -- 540
    description = "Starts with Monstro's Lung",
    sprite = "familiar_108_lilmonstro.png",
    item = CollectibleType.COLLECTIBLE_MONSTROS_LUNG, -- 229
  },
  {
    name = "Invisible Baby", -- 541
    description = "Has invisibility",
    sprite = "n/a",
  },
}

return SPCGlobals
