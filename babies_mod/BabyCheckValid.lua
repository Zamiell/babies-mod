local BabyCheckValid = {}

-- Includes
local g = require("babies_mod/globals")

function BabyCheckValid:Main(babyType)
  -- Local variables
  local stage = g.l:GetStage()
  local stageType = g.l:GetStageType()
  local activeItem = g.p:GetActiveItem()
  local maxHearts = g.p:GetMaxHearts()
  local soulHearts = g.p:GetSoulHearts()
  local boneHearts = g.p:GetBoneHearts()
  local coins = g.p:GetNumCoins()
  local bombs = g.p:GetNumBombs()
  local keys = g.p:GetNumKeys()
  local baby = g.babies[babyType]
  local schoolbagItem = RacingPlusGlobals.run.schoolbag.item

  -- Check to see if we already got this baby in this run / multi-character custom challenge
  for i = 1, #g.pastBabies do
    if g.pastBabies[i] == babyType then
      return false
    end
  end

  -- Check to see if this baby requires a separate mod
  if (
    baby.requiresRacingPlus ~= nil
    and RacingPlusGlobals == nil
  ) then
    -- We don't have Racing+ enabled
    return false
  end

  -- Check for overlapping items
  if (
    baby.item ~= nil
    and g.p:HasCollectible(baby.item)
  )then
    return false
  end
  if (
    baby.item2 ~= nil
    and g.p:HasCollectible(baby.item2)
  ) then
    return false
  end

  -- If the player does not have a slot for an active item, do not give them an active item baby
  if (
    baby.item ~= nil
    and g:GetItemConfig(baby.item).Type == ItemType.ITEM_ACTIVE -- 3
  ) then
    if (
      activeItem ~= 0
      and (
        (
          RacingPlusGlobals ~= nil
          and g.p:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM)
          and schoolbagItem ~= 0
        )
        or (
          g.p:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG) -- 534
          and g.p.SecondaryActiveItem.Item ~= 0
        )
      )
    ) then
      -- The player has an active item and an item inside of the Schoolbag
      return false
    end

    if (
      activeItem ~= 0
      and (
        RacingPlusGlobals == nil
        or not g.p:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM)
      )
      and not g.p:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG) -- 534
    ) then
      -- The player has an active item and does not have the Schoolbag
      return false
    end
  end

  -- If the player already has a trinket, do not give them a trinket baby
  if (
    baby.trinket ~= nil
    and g.p:GetTrinket(0) ~= 0
  ) then
    return false
  end

  -- Check for conflicting health values
  local totalHealth = maxHearts + soulHearts + boneHearts
  if (
    baby.numHits ~= nil
    and totalHealth < baby.numHits
  ) then
    return false
  end
  if (
    baby.item == CollectibleType.COLLECTIBLE_POTATO_PEELER -- 487
    and maxHearts == 0
  ) then
    return false
  end
  if (
    (
      baby.item == CollectibleType.COLLECTIBLE_SOUL_JAR
      or baby.item2 == CollectibleType.COLLECTIBLE_SOUL_JAR
    )
    and maxHearts == 0
  ) then
    return false
  end
  if (
    baby.name == "MeatBoy Baby" -- 210
    and maxHearts == 0
  ) then
    -- Potato Peeler effect on hit
    return false
  end

  -- Check for inventory restrictions
  if (
    baby.requireCoins
    and coins == 0
  ) then
    return false
  end

  if (
    baby.name == "Fancy Baby" -- 216
    and coins < 10
  ) then
    return false
  end

  if (
    baby.name == "Fate's Reward" -- 537
    and coins < 15
  ) then
    return false
  end

  if (
    (
      baby.item == CollectibleType.COLLECTIBLE_DOLLAR -- 18
      or baby.item2 == CollectibleType.COLLECTIBLE_DOLLAR -- 18
    )
    and coins >= 50
  ) then
    return false
  end

  if (
    baby.requireBombs
    and bombs == 0
  ) then
    return false
  end

  if (
    baby.name == "Rage Baby"
    and bombs >= 50
  ) then
    return false
  end

  if (
    baby.requireKeys
    and keys == 0
  ) then
    return false
  end

  -- Check for conflicting items
  if (
    baby.blindfolded
    and (
      g.p:HasCollectible(CollectibleType.COLLECTIBLE_CHOCOLATE_MILK) -- 69
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_TECH_5) -- 244
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_LIBRA) -- 304
    )
  ) then
    -- Even with very high tear delay, you can still spam tears with Chocolate Milk
    -- With Libra, the extra tear delay from the blindfold is redistributed,
    -- so the player will be able to shoot after saving and quitting
    -- With Tech.5, the player is still able to shoot while blindfolded
    return false
  end

  if (
    (
      baby.mustHaveTears
      or baby.item == CollectibleType.COLLECTIBLE_SOY_MILK -- 330
      or baby.item2 == CollectibleType.COLLECTIBLE_SOY_MILK -- 330
    )
    and (
      g.p:HasCollectible(CollectibleType.COLLECTIBLE_DR_FETUS) -- 52
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_TECHNOLOGY) -- 68
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) -- 114
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE) -- 118
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) -- 168
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_TECH_X) -- 395
    )
  ) then
    return false
  end

  if (
    baby.item == CollectibleType.COLLECTIBLE_ISAACS_TEARS -- 323
    and g.p:HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) -- 149
  ) then
    return false
  end

  if (
    (
      baby.item == CollectibleType.COLLECTIBLE_COMPASS -- 21
      or baby.item2 == CollectibleType.COLLECTIBLE_COMPASS -- 21
      or baby.item == CollectibleType.COLLECTIBLE_TREASURE_MAP -- 54
      or baby.item2 == CollectibleType.COLLECTIBLE_TREASURE_MAP -- 54
      or baby.item == CollectibleType.COLLECTIBLE_BLUE_MAP -- 246
      or baby.item2 == CollectibleType.COLLECTIBLE_BLUE_MAP -- 246
    )
    and g.p:HasCollectible(CollectibleType.COLLECTIBLE_MIND) -- 333
  ) then
    return false
  end

  if (
    (
      baby.item == CollectibleType.COLLECTIBLE_TECH_X -- 395
      or baby.item2 == CollectibleType.COLLECTIBLE_TECH_X -- 395
    )
    and g.p:HasCollectible(CollectibleType.COLLECTIBLE_DEAD_EYE) -- 373
  ) then
    return false
  end

  if (
    (
      baby.item == CollectibleType.COLLECTIBLE_DEAD_EYE -- 373
      or baby.item2 == CollectibleType.COLLECTIBLE_DEAD_EYE -- 373
    )
    and g.p:HasCollectible(CollectibleType.COLLECTIBLE_TECH_X) -- 395
  ) then
    return false
  end

  if (
    baby.name == "Whore Baby" -- 43
    and g.p:HasCollectible(CollectibleType.COLLECTIBLE_SACRIFICIAL_DAGGER) -- 172
  ) then
    return false
  elseif (
    baby.name == "Belial Baby" -- 51
    and (
      g.p:HasCollectible(CollectibleType.COLLECTIBLE_TECH_X) -- 395
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_MEGA_SATANS_BREATH) -- 441
      or schoolbagItem == CollectibleType.COLLECTIBLE_MEGA_SATANS_BREATH -- 441
    )
  ) then
    return false
  elseif (
    baby.name == "Goat Baby" -- 62
    and (
      g.p:HasCollectible(CollectibleType.COLLECTIBLE_GOAT_HEAD) -- 215
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_DUALITY) -- 498
    )
  ) then
    return false
  elseif (
    baby.name == "Aether Baby" -- 106
    and g.p:HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) -- 149
  ) then
    return false
  elseif (
    baby.name == "Masked Baby" and -- 115
    (
      g.p:HasCollectible(CollectibleType.COLLECTIBLE_CHOCOLATE_MILK) -- 69
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE) -- 118
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) -- 229
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_CURSED_EYE) -- 316
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_MAW_OF_VOID) -- 399
    )
  ) then
    -- Can't shoot while moving
    -- This messes up with charge items
    return false
  elseif (
    baby.name == "Earwig Baby" -- 128
    and (
      g.p:HasCollectible(CollectibleType.COLLECTIBLE_COMPASS) -- 21
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_TREASURE_MAP) -- 54
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_MIND) -- 333
    )
  ) then
    -- 3 rooms are already explored
    -- If the player has mapping, this effect is largely useless
    -- (but having the Blue Map is okay)
    return false
  elseif (
    baby.name == "Sloppy Baby" -- 146
    and (
      g.p:HasCollectible(CollectibleType.COLLECTIBLE_INNER_EYE) -- 2
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER) -- 153
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_20_20) -- 245
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_THE_WIZ) -- 358
      or g.p:HasPlayerForm(PlayerForm.PLAYERFORM_BABY) -- 7
      or g.p:HasPlayerForm(PlayerForm.PLAYERFORM_BOOK_WORM) -- 10
    )
  ) then
    return false
  elseif (
    baby.name == "Blindfold Baby" -- 202
    and (
      g.p:HasCollectible(CollectibleType.COLLECTIBLE_TECHNOLOGY_2) -- 152
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) -- 229
    )
  ) then
    return false
  elseif (
    baby.name == "Bawl Baby" -- 231
    and g.p:HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) -- 149
  ) then
    return false
  elseif (
    baby.name == "Tabby Baby" -- 269
    and g.p:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) -- 114
  ) then
    return false
  elseif (
    baby.name == "Red Demon Baby" -- 278
    and (
      g.p:HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) -- 168
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_TECH_X) -- 395
    )
  ) then
    return false
  elseif (
    baby.name == "Fang Demon Baby" -- 281
    and (
      g.p:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) -- 114
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) -- 168
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) -- 229
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_TECH_X) -- 395
    )
  ) then
    return false
  elseif (
    baby.name == "Lantern Baby" -- 292
    and g.p:HasCollectible(CollectibleType.COLLECTIBLE_TRISAGION) -- 533
  ) then
    return false
  elseif (
    baby.name == "Cupcake Baby" -- 321
    and g.p:HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) -- 168
  ) then
    -- High shot speed
    return false
  elseif (
    baby.name == "Slicer Baby" -- 331
    and g.p:HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) -- 149
  ) then
    -- Slice tears
    -- Ipecac causes the tears to explode instantly, which causes unavoidable damage
    return false
  elseif (
    baby.name == "Mushroom Girl Baby" -- 361
    and g.p:HasCollectible(CollectibleType.COLLECTIBLE_DR_FETUS) -- 52
  ) then
    return false
  elseif (
    baby.name == "Blue Ghost Baby" -- 370
    and g.p:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) -- 114
  ) then
    return false
  elseif (
    baby.name == "Yellow Princess Baby" -- 375
    and g.p:HasCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE) -- 540
  ) then
    return false
  elseif (
    baby.name == "Dino Baby" -- 376
    and g.p:HasCollectible(CollectibleType.COLLECTIBLE_BOBS_BRAIN) -- 273
  ) then
    return false
  elseif (
    baby.name == "Imp Baby" -- 386
    and g.p:HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) -- 168
  ) then
    -- Blender + flight + explosion immunity + blindfolded
    -- Epic Fetus overwrites Mom's Knife, which makes the baby not work properly
    return false
  elseif (
    baby.name == "Dark Space Soldier Baby" -- 398
    and g.p:HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) -- 149
  ) then
    return false
  elseif (
    baby.name == "Blurred Baby" -- 407
    and (
      g.p:HasCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE) -- 540
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_INCUBUS) -- 360
    )
  ) then
    -- Flat Stone is manually given, so we have to explicitly code a restriction
    -- Incubus will not fire the Ludo tears, ruining the build
    return false
  elseif (
    baby.name == "Rojen Whitefox Baby" -- 446
    and g.p:HasCollectible(CollectibleType.COLLECTIBLE_POLAROID) -- 327
  ) then
    return false
  elseif (
    (
      baby.name == "Cursed Pillow Baby" -- 487
      or baby.name == "Abel" -- 531
    )
    and (
      g.p:HasCollectible(CollectibleType.COLLECTIBLE_INNER_EYE) -- 2
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_CUPIDS_ARROW) -- 48
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_EYE) -- 55
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_LOKIS_HORNS) -- 87
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER) -- 153
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_POLYPHEMUS) -- 169
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) -- 229
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_DEATHS_TOUCH) -- 237
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_20_20) -- 245
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_SAGITTARIUS) -- 306
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_CURSED_EYE) -- 316
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_DEAD_ONION) -- 336
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_EYE_OF_BELIAL) -- 462
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_LITTLE_HORN) -- 503
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_TRISAGION) -- 533
      or g.p:HasCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE) -- 540
      or g.p:HasPlayerForm(PlayerForm.PLAYERFORM_BABY) -- 7
      or g.p:HasPlayerForm(PlayerForm.PLAYERFORM_BOOK_WORM) -- 10
    )
  ) then
    -- Missed tears cause damage & missed tears cause paralysis
    -- Piercing, multiple shots, and Flat Stone causes this to mess up
    return false
  end

  -- Check for conflicting trinkets
  if (
    baby.name == "Spike Baby" -- 166
    and g.p:HasTrinket(TrinketType.TRINKET_LEFT_HAND) -- 61
  ) then
    return false
  end

  -- Check to see if there are level restrictions
  if baby.noEndFloors and stage >= 9 then
    return false
  end
  if (
    (
      baby.item == CollectibleType.COLLECTIBLE_STEAM_SALE -- 64
      or baby.item2 == CollectibleType.COLLECTIBLE_STEAM_SALE -- 64
    )
    and stage >= 7
  ) then
    -- Only valid for floors with shops
    return false
  elseif (
    baby.item == CollectibleType.COLLECTIBLE_WE_NEED_GO_DEEPER -- 84
    and (stage <= 2 or stage >= 8)
  ) then
    -- Only valid for floors that the shovel will work on
    return false
  elseif (
    (
      baby.item == CollectibleType.COLLECTIBLE_SCAPULAR -- 142
      or baby.item2 == CollectibleType.COLLECTIBLE_SCAPULAR -- 142
    )
    and stage >= 7
  ) then
    return false
  elseif (
    baby.item == CollectibleType.COLLECTIBLE_CRYSTAL_BALL -- 158
    and stage <= 2
  ) then
    return false
  elseif (
    baby.item == CollectibleType.COLLECTIBLE_UNDEFINED -- 324
    and stage <= 2
  ) then
    return false
  elseif (
    (
      baby.item == CollectibleType.COLLECTIBLE_GOAT_HEAD -- 215
      or baby.item2 == CollectibleType.COLLECTIBLE_GOAT_HEAD -- 215
      or baby.item == CollectibleType.COLLECTIBLE_DUALITY -- 498
      or baby.item2 == CollectibleType.COLLECTIBLE_DUALITY -- 498
      or baby.item == CollectibleType.COLLECTIBLE_EUCHARIST -- 499
      or baby.item2 == CollectibleType.COLLECTIBLE_EUCHARIST -- 499
    )
    and (stage == 1 or stage >= 9)
  ) then
    -- Only valid for floors with Devil Rooms
    return false
  elseif (
    (
      baby.item == CollectibleType.COLLECTIBLE_THERES_OPTIONS -- 249
      or baby.item2 == CollectibleType.COLLECTIBLE_THERES_OPTIONS -- 249
    )
    and (stage == 6 or stage >= 8)
  ) then
    -- There won't be a boss item on floor 6 or floor 8 and beyond
    return false
  elseif (
    (
      baby.item == CollectibleType.COLLECTIBLE_MORE_OPTIONS -- 414
      or baby.item2 == CollectibleType.COLLECTIBLE_MORE_OPTIONS -- 414
    )
    and (stage == 1 or stage >= 7)
  ) then
    -- We always have More Options on Basement 1
    -- There are no Treasure Rooms on floors 7 and beyond
    return false
  end

  if (
    baby.name == "Shadow Baby" -- 13
    and (stage == 1 or stage >= 8)
  ) then
    -- Devil Rooms / Angel Rooms go to the Black Market instead
    -- Only valid for floors with Devil Rooms
    -- Not valid for floor 8 just in case the Black Market does not have a beam of light to the
    -- Cathedral
    return false
  elseif (
    baby.name == "Goat Baby" -- 62
    and (stage <= 2 or stage >= 9)
  ) then
    -- Only valid for floors with Devil Rooms
    -- Also, we are guaranteed a Devil Room on Basement 2, so we don't want to have it there either
    return false
  elseif (
    baby.name == "Bomb Baby" -- 75
    and stage == 10
  ) then
    -- 50% chance for bombs to have the D6 effect
    return false
  elseif (
    baby.name == "Earwig Baby" -- 128
    and stage == 1
  ) then
    -- 3 rooms are already explored
    -- This can make resetting slower, so don't have this baby on Basement 1
    return false
  elseif (
    baby.name == "Tears Baby" -- 136
    and stage == 2
  ) then
    -- Starts with the Soul Jar
    -- Getting this on Basement 2 would cause a missed devil deal
    return false
  elseif (
    baby.name == "Twin Baby" -- 141
    and stage == 8
  ) then
    -- If they mess up and go past the Boss Room, then they can get the wrong path
    return false
  elseif (
    baby.name == "Chompers Baby" -- 143
    and stage == 11
  ) then
    -- Everything is Red Poop
    -- There is almost no grid entities on The Chest
    return false
  elseif (
    baby.name == "Ate Poop Baby" -- 173
    and stage == 11
  ) then
    -- Destroying poops spawns random pickups
    -- There are hardly any poops on The Chest
    return false
  elseif (
    baby.name == "Shopkeeper Baby" -- 215
    and stage >= 7
  ) then
    -- Free shop items
    return false
  elseif (
    baby.name == "Gem Baby" -- 237
    and stage >= 7
    and not g.p:HasCollectible(CollectibleType.COLLECTIBLE_MONEY_IS_POWER) -- 109
  ) then
    -- Pennies spawn as nickels
    -- Money is useless past Depths 2 (unless you have Money Equals Power)
    return false
  elseif (
    baby.name == "Monk Baby" -- 313
    and (stage == 6 or stage == 8)
  ) then
    -- PAC1F1CM
    -- If a Devil Room or Angel Room spawns after the Mom fight,
    -- the Mom doors will cover up the Devil/Angel Room door
    -- On floor 8, The exits will not spawn correctly
    -- (On floor 11, the end of the run seems to spawn correctly)
    return false
  elseif (
    baby.name == "Puzzle Baby" -- 315
    and stage == 10
  ) then
    -- The D6 effect on hit
    return false
  elseif (
    baby.name == "Scary Baby" -- 317
    and stage == 6
  ) then
    -- Items cost hearts
    -- The player may not be able to take The Polaroid (when playing a normal run)
    return false
  elseif (
    baby.name == "Red Wrestler Baby" -- 389
    and stage == 11
  ) then
    -- Everything is TNT
    -- There are almost no grid entities on The Chest / Dark Room
    return false
  elseif (
    baby.name == "Rich Baby" -- 424
    and stage >= 7
  ) then
    -- Starts with 99 cents
    -- Money is useless past Depths
    return false
  elseif (
    baby.name == "Folder Baby" -- 430
    and (stage == 1 or stage == 10)
  ) then
    return false
  elseif (
    baby.name == "Hooligan Baby" -- 514
    and (stage == 10 and stageType == 0) -- Sheol
  ) then
    return false
  elseif (
    baby.name == "Baggy Cap Baby" -- 519
    and stage == 11
  ) then
    return false
  elseif (
    baby.name == "Demon Baby" -- 527
    and (stage == 1 or stage >= 9)
  ) then
    -- Only valid for floors with Devil Rooms
    return false
  elseif (
    baby.name == "Ghost Baby" -- 528
    and stage == 2
  ) then
    -- All items from the Shop pool
    -- On stage 2, they will miss a Devil Deal, which is not fair
    return false
  elseif (
    baby.name == "Fate's Reward" -- 537
    and (stage <= 2 or stage == 6 or stage >= 10)
  ) then
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
