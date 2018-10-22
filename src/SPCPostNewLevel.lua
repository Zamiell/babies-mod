local SPCPostNewLevel = {}

-- Includes
local SPCGlobals         = require("src/spcglobals")
local SPCPostRender      = require("src/spcpostrender")
local SPCPostNewRoom     = require("src/spcpostnewroom")
local SPCChangeCharacter = require("src/spcchangecharacter")

-- ModCallbacks.MC_POST_NEW_LEVEL (18)
function SPCPostNewLevel:Main()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()

  Isaac.DebugString("MC_POST_NEW_LEVEL (SPC)")

  -- Make sure the callbacks run in the right order
  -- (naturally, PostNewLevel gets called before the PostGameStarted callbacks)
  if gameFrameCount == 0 then
    return
  end

  SPCPostNewLevel:NewLevel()
end

function SPCPostNewLevel:NewLevel()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local level = game:GetLevel()
  local stage = level:GetStage()
  local stageType = level:GetStageType()

  Isaac.DebugString("MC_POST_NEW_LEVEL2 (SPC)")

  -- Racing+ has a feature to remove duplicate rooms, so it may reseed the floor immediately upon reach it
  -- If so, then we don't want to do anything, since this isn't really a new level
  if gameFrameCount ~= 0 and
     gameFrameCount == SPCGlobals.run.currentFloorFrame then

    return
  end

  -- Set the new floor
  SPCGlobals.run.currentFloor             = stage
  SPCGlobals.run.currentFloorType         = stageType
  SPCGlobals.run.currentFloorFrame        = gameFrameCount
  SPCGlobals.run.currentFloorRoomsEntered = 0
  SPCGlobals.run.trinketGone              = false
  SPCGlobals.run.blindfoldedApplied       = false
  SPCGlobals.run.babyBool                 = false
  SPCGlobals.run.babyCounters             = 0
  -- babyCountersRoom are reset in the MC_POST_NEW_ROOM callback
  SPCGlobals.run.babyFrame                = 0
  -- babyTears are reset in the MC_POST_NEW_ROOM callback
  SPCGlobals.run.babyNPC = {
    type    = 0,
    variant = 0,
    subType = 0,
  }
  SPCGlobals.run.babySprites = nil
  SPCGlobals.run.blackSprite = nil
  SPCGlobals.run.killedPoops = {}

  -- Not all curses are disabled, so make sure that there are no curses to start off with on the floor
  level:RemoveCurse(LevelCurse.CURSE_OF_THE_UNKNOWN, false) -- 1 << 3

  -- Store what our current health is at
  SPCChangeCharacter:StoreHealth()

  -- Set the new baby
  SPCPostNewLevel:RemoveOldBaby()
  SPCPostNewLevel:GetNewBaby()
  SPCPostNewLevel:ApplyNewBaby()

  -- Call PostNewRoom manually (they get naturally called out of order)
  SPCPostNewRoom:NewRoom()
end

function SPCPostNewLevel:RemoveOldBaby()
  -- Local variables
  local game = Game()
  local seeds = game:GetSeeds()
  local room = game:GetRoom()
  local roomSeed = room:GetSpawnSeed()
  local player = game:GetPlayer(0)
  local activeCharge = player:GetActiveCharge()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  -- If we are on an item baby, remove the item
  if baby.item ~= nil then
    player:RemoveCollectible(baby.item)
    if RacingPlusGlobals ~= nil and
       player:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM) and
       RacingPlusGlobals.run.schoolbag.item == baby.item then

      RacingPlusSchoolbag:Remove()
    end
  end
  if baby.item2 ~= nil then
    player:RemoveCollectible(baby.item2)
    if RacingPlusGlobals ~= nil and
       player:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM) and
       RacingPlusGlobals.run.schoolbag.item == baby.item2 then

      RacingPlusSchoolbag:Remove()
    end
  end

  -- If we are on a multiple item baby, remove the extra items
  if baby.itemNum ~= nil then
    for i = 1, baby.itemNum - 1 do
      player:RemoveCollectible(baby.item)
    end
  end

  -- Give the stored active item back, if any
  if SPCGlobals.run.storedItem ~= 0 then
    local activeItem = player:GetActiveItem() -- This has to be after the item removal above
    if activeItem == 0 then
      -- We don't have an active item, so just give it back
      player:AddCollectible(SPCGlobals.run.storedItem, SPCGlobals.run.storedItemCharge, false)

    elseif RacingPlusGlobals ~= nil and
           player:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM) and
           RacingPlusGlobals.run.schoolbag.item == 0 then

      -- Put the item in the empty Schoolbag
      RacingPlusSchoolbag:Put(SPCGlobals.run.storedItem, "max")

    else
      -- We have both an active item and a full Schoolbag, so spawn the item on the ground
      local position = SPCGlobals:GridToPos(3, 1) -- Up and left of where we spawn
      local entity = game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE,
                     position, Vector(0, 0), nil, SPCGlobals.run.storedItem, roomSeed)
      entity:ToPickup().Charge = SPCGlobals.run.storedItemCharge
    end

    -- Clear the variable so that we don't get the item again on the next floor
    SPCGlobals.run.storedItem = 0
    SPCGlobals.run.storedItemCharge = 0
  end

  -- If we are on a trinket baby, remove the trinket
  local trinket = baby.trinket
  if trinket ~= nil then
    player:TryRemoveTrinket(trinket)
  end

  -- Give the stored trinket back, if any
  if SPCGlobals.run.storedTrinket ~= 0 then
    player:AddTrinket(SPCGlobals.run.storedTrinket)
    SPCGlobals.run.storedTrinket = 0
  end

  -- Remove the Dead Eye multiplier
  if baby.item == CollectibleType.COLLECTIBLE_DEAD_EYE then -- 373
    for i = 1, 100 do
      -- Each time this function is called, it only has a chance of working,
      -- so just call it 100 times to be safe
      player:ClearDeadEyeCharge()
    end
  end

  -- Remove easter eggs
  if baby.seed ~= nil then
    seeds:RemoveSeedEffect(baby.seed)
  end

  -- Remove miscellaneous effects
  if baby.name == "Hive Baby" then -- 40
    -- Remove all of the Blue Flies and Blue Spiders
    for i, entity in pairs(Isaac.GetRoomEntities()) do
      if entity.Type == EntityType.ENTITY_FAMILIAR and -- 3
         (entity.Variant == FamiliarVariant.BLUE_FLY or -- 43
          entity.Variant == FamiliarVariant.BLUE_SPIDER) then -- 73

        entity:Remove()
      end
    end

  elseif baby.name == "Zombie Baby" then -- 61
    -- Remove all of the friendly enemies
    for i, entity in pairs(Isaac.GetRoomEntities()) do
      if entity:HasEntityFlags(EntityFlag.FLAG_FRIENDLY) then -- 1 << 29
        entity:Remove()
      end
    end

  elseif baby.name == "Goat Baby" then -- 62
    player:RemoveCollectible(CollectibleType.COLLECTIBLE_GOAT_HEAD) -- 215
    player:RemoveCollectible(CollectibleType.COLLECTIBLE_DUALITY) -- 498

  elseif baby.name == "Ghoul Baby" then -- 83
    SPCChangeCharacter:Return()

  elseif baby.name == "Digital Baby" then -- 162
    -- B00B T00B
    seeds:RemoveSeedEffect(SeedEffect.SEED_OLD_TV) -- 8

  elseif baby.name == "Isaac Baby" then -- 219
    -- Starts with The Battery
    -- We need to remove any additional charge that has accumulated
    local activeItem = player:GetActiveItem() -- This has to be after the item removal above
    if activeItem ~= 0 and
       activeCharge > SPCGlobals:GetItemMaxCharges(activeItem) then

      player:SetActiveCharge(SPCGlobals:GetItemMaxCharges(activeItem))
    end
    if RacingPlusGlobals ~= nil and
       player:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM) and
       RacingPlusGlobals.run.schoolbag.item ~= 0 and
       RacingPlusGlobals.run.schoolbag.chargeBattery ~= 0 then

      RacingPlusGlobals.run.schoolbag.chargeBattery = 0
    end

  elseif baby.name == "Butterfly Baby 2" then -- 332
    player.GridCollisionClass = GridCollisionClass.COLLISION_WALL_EXCEPT_PLAYER -- 5

  elseif baby.name == "Cyborg Baby" then -- 343
    Isaac.ExecuteCommand("debug 7")

  elseif baby.name == "Yellow Princess Baby" then -- 375
    -- This is the third item given, so we have to handle it manually
    player:RemoveCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE) -- 540

  elseif baby.name == "Dino Baby" then -- 376
    -- Remove any leftover eggs
    for i, entity in pairs(Isaac.GetRoomEntities()) do
      if entity.Type == EntityType.ENTITY_FAMILIAR and -- 3
         entity.Variant == FamiliarVariant.BOBS_BRAIN then -- 59

        entity:Remove()
      end
    end

  elseif baby.name == "Dream Knight Baby" then -- 393
    player:RemoveCollectible(CollectibleType.COLLECTIBLE_KEY_BUM) -- 388

  elseif baby.name == "Blurred Baby" then -- 407
    -- This is the third item given, so we have to handle it manually
    player:RemoveCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE) -- 540

  elseif baby.name == "Half Spider Baby" then -- 515
    -- Only one Pretty Fly is removed after removing a Halo of Flies
    -- Thus, after removing 2x Halo of Flies, one fly remains
    player:RemoveCollectible(CollectibleType.COLLECTIBLE_HALO_OF_FLIES) -- 10
  end
end

function SPCPostNewLevel:GetNewBaby()
  -- Local variables
  local game = Game()
  local level = game:GetLevel()
  local seed = level:GetDungeonPlacementSeed()

  -- Don't do anything if getting new babies is disabled
  if SPCGlobals.debug == "disable" then
    return
  end

  -- It will become impossible to find a new baby if the list of past babies grows too large
  -- (when experimenting, it crashed upon reaching a size of 538, so reset it when it gets over 500 just in case)
  if #SPCGlobals.pastBabies > 500 then
    SPCGlobals.pastBabies = {}
  end

  -- Get a random co-op baby based on the seed of the floor
  -- (but reroll the baby if they have any overlapping items)
  local type
  local i = 0
  while true do
    i = i + 1
    seed = SPCGlobals:IncrementRNG(seed)
    math.randomseed(seed)
    type = math.random(1, #SPCGlobals.babies)

    -- Don't randomly choose a co-op baby if we are choosing a specific one for debugging purposes
    if SPCGlobals.debug ~= 0 then
      type = SPCGlobals.debug
      break
    end

    if SPCPostNewLevel:IsBabyValid(type) then
      break
    end
  end

  -- Set the newly chosen baby type
  SPCGlobals.run.babyType = type

  -- Keep track of the babies that we choose so that we can avoid giving duplicates
  -- on the same run / multi-character custom challenge
  SPCGlobals.pastBabies[#SPCGlobals.pastBabies + 1] = type

  Isaac.DebugString("Randomly chose co-op baby: " .. tostring(type) .. " - " ..
                    SPCGlobals.babies[type].name .. " - " .. SPCGlobals.babies[type].description)
  Isaac.DebugString("Tries: " .. tostring(i) .. ", total past babies: " .. tostring(#SPCGlobals.pastBabies))
end

function SPCPostNewLevel:IsBabyValid(type)
  -- Local variables
  local game = Game()
  local level = game:GetLevel()
  local stage = level:GetStage()
  local player = game:GetPlayer(0)
  local activeItem = player:GetActiveItem()
  local maxHearts = player:GetMaxHearts()
  local soulHearts = player:GetSoulHearts()
  local boneHearts = player:GetBoneHearts()
  local coins = player:GetNumCoins()
  local bombs = player:GetNumBombs()
  local keys = player:GetNumKeys()
  local baby = SPCGlobals.babies[type]

  -- Check to see if we already got this baby in this run / multi-character custom challenge
  for i = 1, #SPCGlobals.pastBabies do
    if SPCGlobals.pastBabies[i] == type then
      return false
    end
  end

  -- Check for overlapping items
  if baby.item ~= nil and
     player:HasCollectible(baby.item) then

    return false
  end
  if RacingPlusGlobals ~= nil and
     player:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM) and
     baby.item == RacingPlusGlobals.run.schoolbag.item then

    return false
  end
  if baby.item2 ~= nil and
     player:HasCollectible(baby.item2) then

    return false
  end
  if RacingPlusGlobals ~= nil and
     player:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM) and
     baby.item2 == RacingPlusGlobals.run.schoolbag.item then

    return false
  end

  -- If the player already has a trinket, do not give them a trinket baby
  if baby.trinket ~= nil and
     player:GetTrinket(0) ~= 0 then

    return false
  end

  -- Check to see if they have a slot for the active item
  if baby.hasActive then
    if activeItem ~= 0 and
       RacingPlusGlobals ~= nil and
       player:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM) and
      RacingPlusGlobals.run.schoolbag.item ~= 0 then

      -- The player has an active item and an item inside of the Schoolbag
      return false
    end
    if activeItem ~= 0 and
       (RacingPlusGlobals == nil or
        player:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM) == false) then

      -- The player has an active item and does not have the Schoolbag
      return false
    end
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
  if (baby.item == Isaac.GetItemIdByName("Soul Jar") or
      baby.item2 == Isaac.GetItemIdByName("Soul Jar")) and
     maxHearts == 0 then

    return false
  end

  -- Check for inventory restrictions
  if baby.requireCoins and
     coins == 0 then

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
  if baby.name == "Fancy Baby" and -- 216
     coins < 10 then

    return false
  end

  -- Check for conflicting items
  if (baby.mustHaveTears or
      baby.item == CollectibleType.COLLECTIBLE_SOY_MILK or -- 330
      baby.item2 == CollectibleType.COLLECTIBLE_SOY_MILK) and -- 330
     (player:HasCollectible(CollectibleType.COLLECTIBLE_DR_FETUS) or -- 52
      player:HasCollectible(CollectibleType.COLLECTIBLE_TECHNOLOGY) or -- 68
      player:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) or -- 114
      player:HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE) or -- 118
      player:HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) or -- 168
      player:HasCollectible(CollectibleType.COLLECTIBLE_TECH_X)) then -- 395

    return false
  end
  if (baby.item == CollectibleType.COLLECTIBLE_COMPASS or -- 21
      baby.item2 == CollectibleType.COLLECTIBLE_COMPASS or -- 21
      baby.item == CollectibleType.COLLECTIBLE_TREASURE_MAP or -- 54
      baby.item2 == CollectibleType.COLLECTIBLE_TREASURE_MAP or -- 54
      baby.item == CollectibleType.COLLECTIBLE_BLUE_MAP or -- 246
      baby.item2 == CollectibleType.COLLECTIBLE_BLUE_MAP) and -- 246
     player:HasCollectible(CollectibleType.COLLECTIBLE_MIND) then -- 333

    return false
  end
  if baby.item == Isaac.GetItemIdByName("Charging Station") and
     (RacingPlusGlobals == nil or
      player:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM) == false or
      activeItem == 0) then

    return false
  end
  if baby.name == "Belial Baby" and -- 62
         player:HasCollectible(CollectibleType.COLLECTIBLE_TECH_X) then -- 395

    return false

  elseif baby.name == "Goat Baby" and -- 62
         (player:HasCollectible(CollectibleType.COLLECTIBLE_GOAT_HEAD) or -- 215
          player:HasCollectible(CollectibleType.COLLECTIBLE_DUALITY)) then -- 498

    return false

  elseif baby.name == "Masked Baby" and -- 115
         (player:HasCollectible(CollectibleType.COLLECTIBLE_CHOCOLATE_MILK) or -- 69
          player:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) or -- 114
          player:HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE) or -- 118
          player:HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) or -- 229
          player:HasCollectible(CollectibleType.COLLECTIBLE_CURSED_EYE) or -- 316
          player:HasCollectible(CollectibleType.COLLECTIBLE_TECH_X) or -- 395
          player:HasCollectible(CollectibleType.COLLECTIBLE_MAW_OF_VOID)) then -- 399

    return false

  elseif baby.name == "Earwig Baby" and -- 128
         (player:HasCollectible(CollectibleType.COLLECTIBLE_COMPASS) or -- 21
          player:HasCollectible(CollectibleType.COLLECTIBLE_TREASURE_MAP) or -- 54
          player:HasCollectible(CollectibleType.COLLECTIBLE_MIND)) then -- 333

    -- 3 rooms are already explored
    -- If the player has mapping, this effect is largely useless
    -- (but having the Blue Map is okay)
    return false

  elseif baby.name == "Blindfold Baby" and -- 202
         player:HasCollectible(CollectibleType.COLLECTIBLE_TECHNOLOGY_2) then -- 152

    return false

  elseif baby.name == "Bawl Baby" and -- 231
         player:HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) then -- 149

    return false

  elseif baby.name == "Tabby Baby" and -- 269
         player:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) then -- 114

    return false

  elseif baby.name == "Red Demon Baby" and -- 278
         (player:HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) or -- 168
          player:HasCollectible(CollectibleType.COLLECTIBLE_TECH_X)) then -- 395

    return false

  elseif baby.name == "Cupcake Baby" and -- 321
         player:HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) then -- 168

    -- High shot speed
    return false

  elseif baby.name == "Slicer Baby" and -- 331
         player:HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) then -- 149

    -- Slice tears
    -- Ipecac causes the tears to explode instantly, which causes unavoidable damage
    return false

  elseif baby.name == "Mushroom Girl Baby" and -- 361
         player:HasCollectible(CollectibleType.COLLECTIBLE_DR_FETUS) then -- 52

    return false

  elseif baby.name == "Yellow Princess Baby" and -- 375
         player:HasCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE) then -- 540

    return false

  elseif baby.name == "Dino Baby" and -- 376
         player:HasCollectible(CollectibleType.COLLECTIBLE_BOBS_BRAIN) then -- 273

    return false

  elseif baby.name == "Blurred Baby" and -- 407
         player:HasCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE) then -- 540

    return false

  elseif baby.name == "Rojen Whitefox Baby" and -- 446
         player:HasCollectible(CollectibleType.COLLECTIBLE_POLAROID) then -- 327

    return false

  elseif baby.name == "Cursed Pillow Baby" and -- 487
         (player:HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) or -- 229
          player:HasCollectible(CollectibleType.COLLECTIBLE_CURSED_EYE)) then -- 316

    return false

  elseif baby.name == "Abel" and -- 531
         player:HasCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE) then -- 540

    return false
  end

  -- Check to see if there are level restrictions
  if baby.noEndFloors and stage >= 9 then
    return false
  end
  if baby.item == CollectibleType.COLLECTIBLE_WE_NEED_GO_DEEPER and -- 84
     (stage <= 2 or stage >= 8) then

    -- Only valid for floors that the shovel will work on
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

  elseif baby.name == "Ghoul Baby" and -- 83
         stage == 1 then

    -- Starts with a bone club
    -- We don't want to lag the player if they are resetting for a Treasure Room
    return false

  elseif baby.name == "Earwig Baby" and -- 128
         stage == 1 then

    -- 3 rooms are already explored
    -- This can make resetting slower, so don't have this baby on Basement 1
    return false

  elseif baby.name == "Chompers Baby" and -- 143
         stage == 11 then

    -- Everything is Red Poop
    -- There is almost no grid entities on The Chest
    return false

  elseif baby.name == "Shopkeeper Baby" and -- 215
         stage >= 7 then

    -- Free shop items
    return false

  elseif baby.name == "Gem Baby" and -- 237
         stage >= 7 and
         player:HasCollectible(CollectibleType.COLLECTIBLE_MONEY_IS_POWER) == false then -- 109

    -- Pennies spawn as nickels
    -- Money is useless past Depths 2 (unless you have Money Equals Power)
    return false

  elseif baby.name == "Puzzle Baby" and -- 315
         stage == 10 then

    -- The D6 effect on hit
    return false

  elseif baby.name == "Red Wrestler Baby" and -- 389
         stage == 11 then

    -- Everything is TNT
    -- There is almost no grid entities on The Chest
    return false

  elseif baby.name == "Demon Baby" and -- 527
         (stage == 1 or stage >= 9) then

    -- Only valid for floors with Devil Rooms
    return false
  end

  -- Check to see if there are mod restrictions
  if baby.name == "Tears Baby" and
     RacingPlusGlobals ~= nil then

    return false
  end

  return true
end

function SPCPostNewLevel:ApplyNewBaby()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local seeds = game:GetSeeds()
  local itemPool = game:GetItemPool()
  local player = game:GetPlayer(0)
  local activeItem = player:GetActiveItem()
  local activeCharge = player:GetActiveCharge()
  local soulHearts = player:GetSoulHearts()
  local blackHearts = player:GetBlackHearts()
  local coins = player:GetNumCoins()
  local bombs = player:GetNumBombs()
  local keys = player:GetNumKeys()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  -- Draw the kind of baby on the starting room
  SPCGlobals.run.drawIntro = true

  -- Check if this is an item baby
  local item = baby.item
  if item ~= nil then
    -- Check to see if it is an active item
    if SPCGlobals:GetItemConfig(item).Type == ItemType.ITEM_ACTIVE then
      -- Find out how many charges it should have
      local charges = SPCGlobals:GetItemMaxCharges(item)
      if baby.uncharged ~= nil then
        charges = 0
      end

      -- Find out where to put it
      if RacingPlusGlobals ~= nil and
         player:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM) and
         RacingPlusGlobals.run.schoolbag.item == 0 then

        -- There is room in the Schoolbag for it, so put it there
        RacingPlusSchoolbag:Put(item, charges)
        Isaac.DebugString("Added the new baby active item (" .. tostring(item) .. ") to the Schoolbag. " ..
                          "(The Schoolbag was empty.)")

      elseif RacingPlusGlobals ~= nil and
             player:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM) and
             RacingPlusGlobals.run.schoolbag.item ~= 0 and
             activeItem ~= 0 then

        -- We have both an active item and a Schoolbag item, so we need to take one of them away
        -- By default, take the Schoolbag item away first
        SPCGlobals.run.storedItem = RacingPlusGlobals.run.schoolbag.item
        SPCGlobals.run.storedItemCharge = RacingPlusGlobals.run.schoolbag.charge
        RacingPlusSchoolbag:Put(item, charges)
        Isaac.DebugString("Added the new baby active item (" .. tostring(item) .. ") to the Schoolbag. " ..
                          "(The Schoolbag item of " .. tostring(SPCGlobals.run.storedItem) .. " was swapped out).")

      else
        -- We don't have a Schoolbag, so just give the new active item
        if activeItem ~= 0 then
          -- Keep track of the existing active item so we can swap it back later
          SPCGlobals.run.storedItem = activeItem
          SPCGlobals.run.storedItemCharge = activeCharge
        end
        player:AddCollectible(item, charges, false)
        Isaac.DebugString("Added the new baby active item (" .. tostring(item) .. ") directly.")
      end
    else
      -- Give the passive item
      player:AddCollectible(item, 0, false)
      Isaac.DebugString("Added the new baby passive item (" .. tostring(item) .. ").")
    end

    -- Hide it from the item tracker
    Isaac.DebugString("Removing collectible " .. tostring(item))

    -- Also remove this item from all pools
    itemPool:RemoveCollectible(item)
  end

  -- Check if this is a multiple item baby
  if baby.itemNum ~= nil then
    for i = 1, baby.itemNum - 1 do
      player:AddCollectible(baby.item, 0, false)
      Isaac.DebugString("Removing collectible " .. tostring(baby.item))
    end
  end

  -- Check if this is a baby that grants a second item
  -- (this should always be a passive item)
  local item2 = baby.item2
  if item2 ~= nil then
    player:AddCollectible(item2, SPCGlobals:GetItemMaxCharges(item2), false)

    -- Hide it from the item tracker
    Isaac.DebugString("Removing collectible " .. tostring(item2))

    -- Also remove this item from all pools
    itemPool:RemoveCollectible(item)
  end

  -- Reset the soul hearts and black hearts to the way it was before we added the items
  local newSoulHearts = player:GetSoulHearts()
  local newBlackHearts = player:GetBlackHearts()
  if newSoulHearts ~= soulHearts or
     newBlackHearts ~= blackHearts then

    player:AddSoulHearts(-24)
    for i = 1, soulHearts do
      local bitPosition = math.floor((i - 1) / 2)
      local bit = (blackHearts & (1 << bitPosition)) >> bitPosition
      if bit == 0 then -- Soul heart
        player:AddSoulHearts(1)
      else -- Black heart
        player:AddBlackHearts(1)
      end
    end
  end

  -- Reset the coin/bomb/key count to the way it was before we added the items
  player:AddCoins(-99)
  player:AddCoins(coins)
  player:AddBombs(-99)
  player:AddBombs(bombs)
  player:AddKeys(-99)
  player:AddKeys(keys)

  -- Check if this is a trinket baby
  local trinket = baby.trinket
  if trinket ~= nil then
    -- First, check to see if they have an open trinket slot
    local trinket1 = player:GetTrinket(0) -- This is 0-indexed
    local trinket2 = player:GetTrinket(1) -- This is 0-indexed
    if player:GetMaxTrinkets() == 1 and
       trinket1 ~= 0 then

      -- We have to remove the existing trinket (and save it for the next floor)
      SPCGlobals.run.storedTrinket = trinket1
      player:TryRemoveTrinket(trinket1)

    elseif player:GetMaxTrinkets() == 2 and
           trinket2 ~= 0 then

      -- We have to remove the existing trinket (and save it for the next floor)
      -- (we default to removing the trinket in the back row)
      SPCGlobals.run.storedTrinket = trinket2
      player:TryRemoveTrinket(trinket2)
    end

    player:AddTrinket(trinket)
  end

 -- Some babies give Easter Eggs
  if baby.seed ~= nil then
    seeds:AddSeedEffect(baby.seed)
  end

  -- Don't grant extra pickups
  if baby.item == CollectibleType.COLLECTIBLE_PHD or -- 75
     baby.item2 == CollectibleType.COLLECTIBLE_PHD then -- 75

    -- Delete the starting pill
    local entities = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_PILL, -1, false, false) -- 5.70
    for i = 1, #entities do
      entities[i]:Remove()
    end
  end
  if baby.item == CollectibleType.COLLECTIBLE_STARTER_DECK or -- 251
     baby.item2 == CollectibleType.COLLECTIBLE_STARTER_DECK then -- 251

    -- Delete the starting card
    local entities = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TAROTCARD, -1, -- 5.300
                                      false, false)
    for i = 1, #entities do
      entities[i]:Remove()
    end
  end
  if baby.item == CollectibleType.COLLECTIBLE_LITTLE_BAGGY or -- 252
     baby.item2 == CollectibleType.COLLECTIBLE_LITTLE_BAGGY then -- 252

    -- Delete the starting pill
    local entities = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_PILL, -1, false, false) -- 5.70
    for i = 1, #entities do
      entities[i]:Remove()
    end
  end
  if baby.item == CollectibleType.COLLECTIBLE_CHAOS or -- 402
     baby.item2 == CollectibleType.COLLECTIBLE_CHAOS then -- 402

    -- Delete the starting random pickups
    local entities = Isaac.FindByType(EntityType.ENTITY_PICKUP, -1, -1, false, false) -- 5
    for i = 1, #entities do
      if entities[i].Variant ~= PickupVariant.PICKUP_COLLECTIBLE then -- 100
        entities[i]:Remove()
      end
    end
  end
  if baby.item == CollectibleType.COLLECTIBLE_SACK_HEAD or -- 424
     baby.item2 == CollectibleType.COLLECTIBLE_SACK_HEAD then -- 424

    -- Delete the starting sack
    local entities = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_GRAB_BAG, -1, false, false) -- 5.69
    for i = 1, #entities do
      entities[i]:Remove()
    end
  end
  if baby.item == CollectibleType.COLLECTIBLE_LIL_SPEWER or -- 537
     baby.item2 == CollectibleType.COLLECTIBLE_LIL_SPEWER then -- 537

    -- Delete the starting pill
    local entities = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_PILL, -1, false, false) -- 5.70
    for i = 1, #entities do
      entities[i]:Remove()
    end
  end

  -- Miscellaneous other effects
  if baby.name == "Gold Baby" then -- 15
    player:AddGoldenBomb()
    player:AddGoldenKey()
    player:AddGoldenHearts(12)

  elseif baby.name == "Rage Baby" then -- 31
    player:AddBombs(99)

  elseif baby.name == "Noose Baby" then -- 39
    -- Don't shoot when the timer reaches 0
    -- Set the timer so that we don't take damage immediately upon reaching the floor
    SPCGlobals.run.babyCounters = gameFrameCount + SPCGlobals.babies[341].time

  elseif baby.name == "Hive Baby" then -- 40
    -- The game only allows a maximum of 64 Blue Flies and Blue Spiders at one time
    player:AddBlueFlies(64, player.Position, nil)
    for i = 1, 64 do
      player:AddBlueSpider(player.Position)
    end

  elseif baby.name == "Ghoul Baby" then -- 83
    SPCChangeCharacter:Change(PlayerType.PLAYER_THEFORGOTTEN) -- 16

  elseif baby.name == "Hopeless Baby" then -- 125
    -- Keys are hearts
    player:AddKeys(2)

    -- Initialize the sprites
    SPCGlobals.run.babySprites = Sprite()
    SPCGlobals.run.babySprites:Load("gfx/custom-health/key.anm2", true)
    SPCGlobals.run.babySprites:SetFrame("Default", 0)

  elseif baby.name == "Mohawk Baby" then -- 138
    -- Bombs are hearts
    player:AddBombs(2)

    -- Initialize the sprites
    SPCGlobals.run.babySprites = Sprite()
    SPCGlobals.run.babySprites:Load("gfx/custom-health/bomb.anm2", true)
    SPCGlobals.run.babySprites:SetFrame("Default", 0)

  elseif baby.name == "Aban Baby" then -- 177
    -- Coins are hearts
    player:AddCoins(2)

  elseif baby.name == "Vomit Baby" then -- 341
    SPCGlobals.run.babyCounters = gameFrameCount + baby.time

  elseif baby.name == "Cyborg Baby" then -- 343
    Isaac.ExecuteCommand("debug 7")

  elseif baby.name == "Rabbit Baby" then -- 350
    SPCGlobals.run.babyFrame = gameFrameCount + baby.num

  elseif baby.name == "Yellow Princess Baby" then -- 375
    -- This is the third item given, so we have to handle it manually
    player:AddCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE, 0, false) -- 540
    Isaac.DebugString("Removing collectible " .. tostring(CollectibleType.COLLECTIBLE_FLAT_STONE)) -- 540

  elseif baby.name == "Imp Baby" then -- 386
    -- Start the direction at left
    SPCGlobals.run.babyCounters = ButtonAction.ACTION_SHOOTLEFT -- 4
    SPCGlobals.run.babyFrame = gameFrameCount + baby.num

  elseif baby.name == "Dream Knight Baby" then -- 393
    player:AddCollectible(CollectibleType.COLLECTIBLE_KEY_BUM, 0, false) -- 388

  elseif baby.name == "Blurred Baby" then -- 407
    -- This is the third item given, so we have to handle it manually
    player:AddCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE, 0, false) -- 540
    Isaac.DebugString("Removing collectible " .. tostring(CollectibleType.COLLECTIBLE_FLAT_STONE)) -- 540

  elseif baby.name == "Twitchy Baby" then -- 511
    -- Start with the slowest tears and mark to update them on this frame
    SPCGlobals.run.babyCounters = baby.max
    SPCGlobals.run.babyFrame = gameFrameCount
  end

  -- Some babies grant extra stats
  player:AddCacheFlags(CacheFlag.CACHE_ALL) -- 0xFFFFFFFF
  player:EvaluateItems()

  -- Reset the player's size
  player.SpriteScale = Vector(1, 1)

  -- Replace the player sprite with a co-op baby version
  SPCPostRender:SetPlayerSprite()

  Isaac.DebugString("Applied baby: " .. tostring(type) .. " - " .. baby.name)
end

return SPCPostNewLevel
