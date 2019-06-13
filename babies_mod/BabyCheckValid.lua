local BabyCheckValid = {}

-- Includes
local g = require("babies_mod/globals")

function BabyCheckValid:Main(type)
  -- Local variables
  local stage = g.l:GetStage()
  local activeItem = g.p:GetActiveItem()
  local maxHearts = g.p:GetMaxHearts()
  local soulHearts = g.p:GetSoulHearts()
  local boneHearts = g.p:GetBoneHearts()
  local coins = g.p:GetNumCoins()
  local bombs = g.p:GetNumBombs()
  local keys = g.p:GetNumKeys()
  local baby = g.babies[type]

  -- Check to see if we already got this baby in this run / multi-character custom challenge
  for i = 1, #g.pastBabies do
    if g.pastBabies[i] == type then
      return false
    end
  end

  -- Check to see if this baby requires a separate mod
  if baby.requiresRacingPlus ~= nil and
     RacingPlusGlobals == nil then

    -- We don't have Racing+ enabled
    return false
  end

  -- Check for overlapping items
  if baby.item ~= nil and
     g.p:HasCollectible(baby.item) then

    return false
  end
  if baby.item2 ~= nil and
     g.p:HasCollectible(baby.item2) then

    return false
  end

  -- If the player does not have a slot for an active item, do not give them an active item baby
  if baby.item ~= nil and
     g:GetItemConfig(baby.item).Type == ItemType.ITEM_ACTIVE then -- 3

    if activeItem ~= 0 and
       ((RacingPlusGlobals ~= nil and
         g.p:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM) and
         RacingPlusGlobals.run.schoolbag.item ~= 0) or
        (g.p:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG) and -- 534
         g.p.SecondaryActiveItem.Item ~= 0)) then

      -- The player has an active item and an item inside of the Schoolbag
      return false
    end

    if activeItem ~= 0 and
       (RacingPlusGlobals == nil or
        not g.p:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM)) and
       not g.p:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG) then -- 534

      -- The player has an active item and does not have the Schoolbag
      return false
    end
  end

  -- If the player already has a trinket, do not give them a trinket baby
  if baby.trinket ~= nil and
     g.p:GetTrinket(0) ~= 0 then

    return false
  end

  -- Check for conflicting health values
  local totalHealth = maxHearts + soulHearts + boneHearts
  if baby.numHits ~= nil and
     totalHealth < baby.numHits then

    return false
  end
  if baby.item == CollectibleType.COLLECTIBLE_POTATO_PEELER and -- 487
     maxHearts == 0 then

    return false
  end
  if (baby.item == CollectibleType.COLLECTIBLE_SOUL_JAR or
      baby.item2 == CollectibleType.COLLECTIBLE_SOUL_JAR) and
     maxHearts == 0 then

    return false
  end
  if baby.name == "MeatBoy Baby" and -- 210
     maxHearts == 0 then

    -- Potato Peeler effect on hit
    return false
  end

  -- Check for inventory restrictions
  if baby.requireCoins and
     coins == 0 then

    return false
  end
  if baby.name == "Fancy Baby" and -- 216
     coins < 10 then

    return false
  end
  if baby.name == "Fate's Reward" and -- 537
     coins < 15 then

    return false
  end
  if (baby.item == CollectibleType.COLLECTIBLE_DOLLAR or -- 18
      baby.item2 == CollectibleType.COLLECTIBLE_DOLLAR) and -- 18
     coins >= 50 then

    return false
  end
  if baby.requireBombs and
     bombs == 0 then

    return false
  end
  if baby.name == "Rage Baby" and
     bombs >= 50 then

    return false
  end
  if baby.requireKeys and
     keys == 0 then

    return false
  end

  -- Check for conflicting items
  if baby.blindfolded and
     (g.p:HasCollectible(CollectibleType.COLLECTIBLE_CHOCOLATE_MILK) or -- 69
      g.p:HasCollectible(CollectibleType.COLLECTIBLE_LIBRA)) then -- 304

    -- Even with very high tear delay, you can still spam tears with Chocolate Milk
    -- With Libra, the extra tear delay from the blindfold is redistributed,
    -- so the player will be able to shoot after saving and quitting
    return false
  end
  if (baby.mustHaveTears or
      baby.item == CollectibleType.COLLECTIBLE_SOY_MILK or -- 330
      baby.item2 == CollectibleType.COLLECTIBLE_SOY_MILK) and -- 330
     (g.p:HasCollectible(CollectibleType.COLLECTIBLE_DR_FETUS) or -- 52
      g.p:HasCollectible(CollectibleType.COLLECTIBLE_TECHNOLOGY) or -- 68
      g.p:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) or -- 114
      g.p:HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE) or -- 118
      g.p:HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) or -- 168
      g.p:HasCollectible(CollectibleType.COLLECTIBLE_TECH_X)) then -- 395

    return false
  end
  if baby.item == CollectibleType.COLLECTIBLE_ISAACS_TEARS and -- 323
     g.p:HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) then -- 149

    return false
  end
  if (baby.item == CollectibleType.COLLECTIBLE_COMPASS or -- 21
      baby.item2 == CollectibleType.COLLECTIBLE_COMPASS or -- 21
      baby.item == CollectibleType.COLLECTIBLE_TREASURE_MAP or -- 54
      baby.item2 == CollectibleType.COLLECTIBLE_TREASURE_MAP or -- 54
      baby.item == CollectibleType.COLLECTIBLE_BLUE_MAP or -- 246
      baby.item2 == CollectibleType.COLLECTIBLE_BLUE_MAP) and -- 246
     g.p:HasCollectible(CollectibleType.COLLECTIBLE_MIND) then -- 333

    return false
  end
  if (baby.item == CollectibleType.COLLECTIBLE_TECH_X or -- 395
      baby.item2 == CollectibleType.COLLECTIBLE_TECH_X) and -- 395
     g.p:HasCollectible(CollectibleType.COLLECTIBLE_DEAD_EYE) then -- 373

    return false
  end
  if (baby.item == CollectibleType.COLLECTIBLE_DEAD_EYE or -- 373
      baby.item2 == CollectibleType.COLLECTIBLE_DEAD_EYE) and -- 373
     g.p:HasCollectible(CollectibleType.COLLECTIBLE_TECH_X) then -- 395

    return false
  end
  if baby.name == "Whore Baby" and -- 43
     g.p:HasCollectible(CollectibleType.COLLECTIBLE_SACRIFICIAL_DAGGER) then -- 172

    return false

  elseif baby.name == "Belial Baby" and -- 51
         g.p:HasCollectible(CollectibleType.COLLECTIBLE_TECH_X) then -- 395

    return false

  elseif baby.name == "Goat Baby" and -- 62
         (g.p:HasCollectible(CollectibleType.COLLECTIBLE_GOAT_HEAD) or -- 215
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_DUALITY)) then -- 498

    return false

  elseif baby.name == "Aether Baby" and -- 106
         g.p:HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) then -- 149

    return false

  elseif baby.name == "Masked Baby" and -- 115
         (g.p:HasCollectible(CollectibleType.COLLECTIBLE_CHOCOLATE_MILK) or -- 69
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) or -- 229
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_CURSED_EYE)) then -- 399

    -- Can't shoot while moving
    -- This messes up with charge items
    return false

  elseif baby.name == "Earwig Baby" and -- 128
         (g.p:HasCollectible(CollectibleType.COLLECTIBLE_COMPASS) or -- 21
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_TREASURE_MAP) or -- 54
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_MIND)) then -- 333

    -- 3 rooms are already explored
    -- If the player has mapping, this effect is largely useless
    -- (but having the Blue Map is okay)
    return false

  elseif baby.name == "Sloppy Baby" and -- 146
         (g.p:HasCollectible(CollectibleType.COLLECTIBLE_INNER_EYE) or -- 2
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER) or -- 153
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_20_20) or -- 245
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_THE_WIZ) or -- 358
          g.p:HasPlayerForm(PlayerForm.PLAYERFORM_BABY) or -- 7
          g.p:HasPlayerForm(PlayerForm.PLAYERFORM_BOOK_WORM)) then-- 10

    return false

  elseif baby.name == "Blindfold Baby" and -- 202
         (g.p:HasCollectible(CollectibleType.COLLECTIBLE_TECHNOLOGY_2) or -- 152
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG)) then -- 229

    return false

  elseif baby.name == "Bawl Baby" and -- 231
         g.p:HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) then -- 149

    return false

  elseif baby.name == "Tabby Baby" and -- 269
         g.p:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) then -- 114

    return false

  elseif baby.name == "Red Demon Baby" and -- 278
         (g.p:HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) or -- 168
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_TECH_X)) then -- 395

    return false

  elseif baby.name == "Fang Demon Baby" and -- 281
         (g.p:HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) or -- 168
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) or -- 229
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_TECH_X)) then -- 395

    return false

  elseif baby.name == "Lantern Baby" and -- 292
         g.p:HasCollectible(CollectibleType.COLLECTIBLE_TRISAGION ) then -- 533

    return false

  elseif baby.name == "Cupcake Baby" and -- 321
         g.p:HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) then -- 168

    -- High shot speed
    return false

  elseif baby.name == "Slicer Baby" and -- 331
         g.p:HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) then -- 149

    -- Slice tears
    -- Ipecac causes the tears to explode instantly, which causes unavoidable damage
    return false

  elseif baby.name == "Mushroom Girl Baby" and -- 361
         g.p:HasCollectible(CollectibleType.COLLECTIBLE_DR_FETUS) then -- 52

    return false

  elseif baby.name == "Blue Ghost Baby" and -- 370
         g.p:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) then -- 114

    return false

  elseif baby.name == "Yellow Princess Baby" and -- 375
         g.p:HasCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE) then -- 540

    return false

  elseif baby.name == "Dino Baby" and -- 376
         g.p:HasCollectible(CollectibleType.COLLECTIBLE_BOBS_BRAIN) then -- 273

    return false

  elseif baby.name == "Imp Baby" and -- 386
         g.p:HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) then -- 168

    -- Blender + flight + explosion immunity + blindfolded
    -- Epic Fetus overwrites Mom's Knife, which makes the baby not work properly
    return false

  elseif baby.name == "Dark Space Soldier Baby" and -- 398
         g.p:HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) then -- 149

    return false

  elseif baby.name == "Blurred Baby" and -- 407
         (g.p:HasCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE) or -- 540
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_INCUBUS)) then -- 360

    -- Flat Stone is manually given, so we have to explicitly code a restriction
    -- Incubus will not fire the Ludo tears, ruining the build
    return false

  elseif baby.name == "Rojen Whitefox Baby" and -- 446
         g.p:HasCollectible(CollectibleType.COLLECTIBLE_POLAROID) then -- 327

    return false

  elseif (baby.name == "Cursed Pillow Baby" or -- 487
          baby.name == "Abel") and -- 531
         (g.p:HasCollectible(CollectibleType.COLLECTIBLE_INNER_EYE) or -- 2
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_CUPIDS_ARROW) or -- 48
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_EYE) or -- 55
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_LOKIS_HORNS) or -- 87
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER) or -- 153
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_POLYPHEMUS) or -- 169
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) or -- 229
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_DEATHS_TOUCH) or -- 237
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_20_20) or -- 245
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_SAGITTARIUS) or -- 306
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_CURSED_EYE) or -- 316
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_DEAD_ONION) or -- 336
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_EYE_OF_BELIAL) or -- 462
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_LITTLE_HORN) or -- 503
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_TRISAGION) or -- 533
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE) or -- 540
          g.p:HasPlayerForm(PlayerForm.PLAYERFORM_BABY) or -- 7
          g.p:HasPlayerForm(PlayerForm.PLAYERFORM_BOOK_WORM)) then-- 10

    -- Missed tears cause damage & missed tears cause paralysis
    -- Piercing, multiple shots, and Flat Stone causes this to mess up
    return false
  end

  -- Check for conflicting trinkets
  if baby.name == "Spike Baby" and -- 166
     g.p:HasTrinket(TrinketType.TRINKET_LEFT_HAND) then -- 61

    return false
  end

  -- Check to see if there are level restrictions
  if baby.noEndFloors and stage >= 9 then
    return false
  end
  if (baby.item == CollectibleType.COLLECTIBLE_STEAM_SALE or -- 64
      baby.item2 == CollectibleType.COLLECTIBLE_STEAM_SALE) and -- 64
     stage >= 7 then

    -- Only valid for floors with shops
    return false

  elseif baby.item == CollectibleType.COLLECTIBLE_WE_NEED_GO_DEEPER and -- 84
     (stage <= 2 or stage >= 8) then

    -- Only valid for floors that the shovel will work on
    return false

  elseif (baby.item == CollectibleType.COLLECTIBLE_SCAPULAR or -- 142
          baby.item2 == CollectibleType.COLLECTIBLE_SCAPULAR) and -- 142
         stage >= 7 then

    return false

  elseif baby.item == CollectibleType.COLLECTIBLE_CRYSTAL_BALL and -- 158
         stage <= 2 then

    return false

  elseif baby.item == CollectibleType.COLLECTIBLE_UNDEFINED and -- 324
         stage <= 2 then

    return false

  elseif (baby.item == CollectibleType.COLLECTIBLE_GOAT_HEAD or -- 215
          baby.item2 == CollectibleType.COLLECTIBLE_GOAT_HEAD or -- 215
          baby.item == CollectibleType.COLLECTIBLE_DUALITY or -- 498
          baby.item2 == CollectibleType.COLLECTIBLE_DUALITY or -- 498
          baby.item == CollectibleType.COLLECTIBLE_EUCHARIST or -- 499
          baby.item2 == CollectibleType.COLLECTIBLE_EUCHARIST) and -- 499
         (stage == 1 or stage >= 9) then

    -- Only valid for floors with Devil Rooms
    return false

  elseif (baby.item == CollectibleType.COLLECTIBLE_THERES_OPTIONS or -- 249
          baby.item2 == CollectibleType.COLLECTIBLE_THERES_OPTIONS) and -- 249
         (stage == 6 or stage >= 8) then

    -- There won't be a boss item on floor 6 or floor 8 and beyond
    return false

  elseif (baby.item == CollectibleType.COLLECTIBLE_MORE_OPTIONS or -- 414
          baby.item2 == CollectibleType.COLLECTIBLE_MORE_OPTIONS) and -- 414
         (stage == 1 or stage >= 7) then

    -- We always have More Options on Basement 1
    -- There are no Treasure Rooms on floors 7 and beyond
    return false
  end
  if baby.name == "Shadow Baby" and -- 13
         (stage == 1 or stage >= 8) then

    -- Devil Rooms / Angel Rooms go to the Black Market instead
    -- Only valid for floors with Devil Rooms
    -- Not valid for floor 8 just in case the Black Market does not have a beam of light to the Cathedral
    return false

  elseif baby.name == "Goat Baby" and -- 62
         (stage <= 2 or stage >= 9) then

    -- Only valid for floors with Devil Rooms
    -- Also, we are guaranteed a Devil Room on Basement 2, so we don't want to have it there either
    return false

  elseif baby.name == "Bomb Baby" and -- 75
         stage == 10 then

    -- 50% chance for bombs to have the D6 effect
    return false

  elseif baby.name == "Earwig Baby" and -- 128
         stage == 1 then

    -- 3 rooms are already explored
    -- This can make resetting slower, so don't have this baby on Basement 1
    return false

  elseif baby.name == "Tears Baby" and -- 136
         stage == 2 then

    -- Starts with the Soul Jar
    -- Getting this on Basement 2 would cause a missed devil deal
    return false

  elseif baby.name == "Twin Baby" and -- 141
         stage == 8 then

    -- If they mess up and go past the Boss Room, then they can get the wrong path
    return false

  elseif baby.name == "Chompers Baby" and -- 143
         stage == 11 then

    -- Everything is Red Poop
    -- There is almost no grid entities on The Chest
    return false

  elseif baby.name == "Ate Poop Baby" and -- 173
         stage == 11 then

    -- Destroying poops spawns random pickups
    -- There are hardly any poops on The Chest
    return false

  elseif baby.name == "Shopkeeper Baby" and -- 215
         stage >= 7 then

    -- Free shop items
    return false

  elseif baby.name == "Gem Baby" and -- 237
         stage >= 7 and
         not g.p:HasCollectible(CollectibleType.COLLECTIBLE_MONEY_IS_POWER) then -- 109

    -- Pennies spawn as nickels
    -- Money is useless past Depths 2 (unless you have Money Equals Power)
    return false

  elseif baby.name == "Monk Baby" and -- 313
         stage == 6 then

    -- PAC1F1CM
    -- If a Devil Room or Angel Room spawns after the Mom fight,
    -- the Mom doors will cover up the Devil/Angel Room door
    return false

  elseif baby.name == "Puzzle Baby" and -- 315
         stage == 10 then

    -- The D6 effect on hit
    return false

  elseif baby.name == "Scary Baby" and -- 317
         stage == 6 then

    -- Items cost hearts
    -- The player may not be able to take The Polaroid (when playing a normal run)
    return false

  elseif baby.name == "Red Wrestler Baby" and -- 389
         stage == 11 then

    -- Everything is TNT
    -- There is almost no grid entities on The Chest
    return false

  elseif baby.name == "Rich Baby" and -- 424
         stage >= 7 then

    -- Starts with 99 cents
    -- Money is useless past Depths
    return false

  elseif baby.name == "Folder Baby" and -- 430
         (stage == 1 or stage == 10) then

    return false

  elseif baby.name == "Baggy Cap Baby" and -- 519
         stage == 11 then

    return false

  elseif baby.name == "Demon Baby" and -- 527
         (stage == 1 or stage >= 9) then

    -- Only valid for floors with Devil Rooms
    return false

  elseif baby.name == "Ghost Baby" and -- 528
         stage == 2 then

    -- All items from the Shop pool
    -- On stage 2, they will miss a Devil Deal, which is not fair
    return false

  elseif baby.name == "Fate's Reward" and -- 537
         (stage <= 2 or stage == 6 or stage >= 10) then

    -- Items cost money
    -- On stage 1, the player does not have 15 cents
    -- On stage 2, they will miss a Devil Deal, which is not fair
    -- On stage 6, they might not be able to buy the Polaroid (when playing on a normal run)
    -- On stage 10 and 11, there are no items
    return false
  end

  return true
end

return BabyCheckValid
