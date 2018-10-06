local SPCPostNewLevel = {}

-- Includes
local SPCGlobals     = require("src/spcglobals")
local SPCPostRender  = require("src/spcpostrender")
local SPCPostNewRoom = require("src/spcpostnewroom")

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

  -- Set the new floor
  SPCGlobals.run.currentFloor = stage
  SPCGlobals.run.currentFloorType = stageType
  SPCGlobals.run.currentFloorFrame = gameFrameCount
  SPCGlobals.run.replacedPedestals = {}

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
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]

  -- We could be on the first floor
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

  -- Give the stored active item back, if any
  if SPCGlobals.run.storedItem ~= 0 then
    local activeItem = player:GetActiveItem() -- This has to be after the item removal above
    if activeItem == 0 then
      -- We don't have an active item, so just give it back
      player:AddCollectible(SPCGlobals.run.storedItem, SPCGlobals.run.storedItemCharge, false)
      SPCGlobals.run.storedItem = 0
      SPCGlobals.run.storedItemCharge = 0

    elseif RacingPlusGlobals ~= nil and
           player:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM) and
           RacingPlusGlobals.run.schoolbag.item == 0 then

      -- Put the item in the empty Schoolbag
      RacingPlusSchoolbag:Put(SPCGlobals.run.storedItem, "max")

    else
      -- We have both an active item and a full Schoolbag, so spawn the item on the ground
      local pos = SPCGlobals:GridToPos(3, 1) -- Up and left of where we spawn
      local entity = game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, pos,
                                Vector(0, 0), nil, SPCGlobals.run.storedItem, roomSeed)
      entity:ToPickup().Charge = SPCGlobals.run.storedItemCharge
      Isaac.DebugString("Spawned the old active item.")
    end
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

  -- Remove easter eggs
  if baby.seed ~= nil then
    seeds:RemoveSeedEffect(baby.seed)
  end

  -- Remove miscellaneous effects
  if baby.name == "Butterfly Baby 2" then -- 332
    player.GridCollisionClass = 5
  elseif baby.name == "Cyborg Baby" then -- 343
    Isaac.ExecuteCommand("debug 7")
  elseif baby.name == "Dino Baby" then -- 376
    -- Remove any leftover eggs
    for i, entity in pairs(Isaac.GetRoomEntities()) do
      if entity.Type == EntityType.ENTITY_FAMILIAR and -- 3
         entity.Variant == FamiliarVariant.BOBS_BRAIN then -- 59

        entity:Remove()
      end
    end
  elseif baby.name == "Pixie Baby" then -- 403
    for i = 1, 2 do
      player:RemoveCollectible(CollectibleType.COLLECTIBLE_YO_LISTEN) -- 492
    end
  end
end

function SPCPostNewLevel:GetNewBaby()
  -- Local variables
  local game = Game()
  local level = game:GetLevel()
  local seed = level:GetDungeonPlacementSeed()
  local stage = level:GetStage()
  local player = game:GetPlayer(0)

  -- Get a random co-op baby based on the seed of the floor
  -- (but reroll the baby if they have any overlapping items)
  local type
  while true do
    seed = SPCGlobals:IncrementRNG(seed)
    math.randomseed(seed)
    type = math.random(1, #SPCGlobals.babies)

    -- Don't randomly choose a co-op baby if we are choosing a specific one for debugging purposes
    if SPCGlobals.debug ~= 0 then
      type = SPCGlobals.debug
      break
    end

    -- Check for overlapping items or trinkets
    local newBaby = SPCGlobals.babies[type]
    local valid = true

    if newBaby.item ~= nil and
       player:HasCollectible(newBaby.item) then

      valid = false
    end

    if RacingPlusGlobals ~= nil and
       player:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM) and
       newBaby.item ~= nil and
       newBaby.item == RacingPlusGlobals.run.schoolbag.item then

      valid = false
    end

    if newBaby.item2 ~= nil and
       player:HasCollectible(newBaby.item2) then

      valid = false
    end

    if RacingPlusGlobals ~= nil and
       player:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM) and
       newBaby.item2 ~= nil and
       newBaby.item2 == RacingPlusGlobals.run.schoolbag.item then

      valid = false
    end

    if newBaby.trinket ~= nil and
       player:HasTrinket(newBaby.trinket) then

      valid = false
    end

    -- Check to see if we got this baby in the recent past
    for i = 1, #SPCGlobals.pastBabies do
      if SPCGlobals.pastBabies[i] == type then
        valid = false
        break
      end
    end

    -- Check to see if this baby is banned on the harder floors
    local baby = SPCGlobals.babies[type]
    if baby.noEndFloors and stage > 8 then
      valid = false
    end

    -- Check to see if the player has any items that will conflict with this baby
    if baby.name == "Dino Baby" and
       player:HasCollectible(CollectibleType.COLLECTIBLE_BOBS_BRAIN) then -- 273

      valid = false
    end

    -- Don't choose any babies that are not finished yet (temporary)
    if baby.description == "?" then
      valid = false
    end

    if valid then
      break
    end
  end

  SPCGlobals.run.babyType = type
  local baby = SPCGlobals.babies[type]
  Isaac.DebugString("Randomly chose co-op baby: " .. tostring(type) .. " - " .. baby.name)
end

function SPCPostNewLevel:ApplyNewBaby()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local seeds = game:GetSeeds()
  local player = game:GetPlayer(0)
  local activeItem = player:GetActiveItem()
  local activeCharge = player:GetActiveCharge()
  local itemConfig = Isaac.GetItemConfig()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]

  -- Draw the kind of baby on the starting room
  SPCGlobals.run.drawIntro = true

  -- Check if this is an item baby
  local item = baby.item
  if item ~= nil then
    -- Check to see if it is an active item
    if itemConfig:GetCollectible(item).Type == ItemType.ITEM_ACTIVE then
      if RacingPlusGlobals ~= nil and
         player:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM) and
         RacingPlusGlobals.run.schoolbag.item == 0 then

        -- There is room in the Schoolbag for it, so put it there
        RacingPlusSchoolbag:Put(item, SPCGlobals:GetItemMaxCharges(item))
        Isaac.DebugString("Added the new baby active item (" .. tostring(item) .. ") to the Schoolbag.")

      else
        if activeItem ~= 0 then
          -- Keep track of the existing active item so we can swap it back later
          SPCGlobals.run.storedItem = activeItem
          SPCGlobals.run.storedItemCharge = activeCharge
        end
        player:AddCollectible(item, SPCGlobals:GetItemMaxCharges(item), false)
        Isaac.DebugString("Added the new baby active item (" .. tostring(item) .. ") directly.")
      end
    else
      -- Give the passive item
      player:AddCollectible(item, SPCGlobals:GetItemMaxCharges(item), false)
      Isaac.DebugString("Added the new baby passive item (" .. tostring(item) .. ").")
    end

    -- Hide it from the item tracker
    Isaac.DebugString("Removing collectible " .. tostring(item))
  end

  -- Check if this is a baby that grants a second item
  local item2 = baby.item2
  if item2 ~= nil then
    player:AddCollectible(item2, SPCGlobals:GetItemMaxCharges(item2), false)

    -- Hide it from the item tracker
    Isaac.DebugString("Removing collectible " .. tostring(item2))
  end

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

  -- Some babies grant extra stats
  player:AddCacheFlags(CacheFlag.CACHE_ALL) -- 0xFFFFFFFF
  player:EvaluateItems()

 -- Some babies give Easter Eggs
 if baby.seed ~= nil then
   seeds:AddSeedEffect(baby.seed)
 end

  -- Miscellaneous other effects
  if baby.name == "Black Baby" then -- 27
    player:AddBlackHearts(2)
  elseif baby.name == "White Baby" then -- 29
    player:AddEternalHearts(1)
  elseif baby.name == "Blue Baby" then -- 30
    player:AddSoulHearts(2)
  elseif baby.name == "Bony Baby" then -- 284
    player:AddBoneHearts(1)
  elseif baby.name == "Vomit Baby" then -- 341
    SPCGlobals.run.vomitBabyTimer = gameFrameCount + baby.time
  elseif baby.name == "Cyborg Baby" then -- 343
    Isaac.ExecuteCommand("debug 7")
  elseif baby.name == "Orange Ghost Baby" then -- 373
    player:AddGoldenHearts(1)
  elseif baby.name == "Tomboy Baby" then -- 400
    -- If the player starts with a fully charged shovel (We Need to Go Deeper!),
    -- they will just immediately go to the next floor
    player:DischargeActiveItem()
  elseif baby.name == "Pixie Baby" then -- 403
    for i = 1, 2 do
      player:AddCollectible(CollectibleType.COLLECTIBLE_YO_LISTEN, 0, false) -- 492
    end
  elseif baby.name == "Cool Orange Baby" then -- 485
    player:AddGoldenKey()
  elseif baby.name == "Glittery Peach Baby" then -- 493
    player:AddGoldenBomb()
  elseif baby.name == "Robo-Baby 2.0" then -- 532
    -- If the player starts with a fully charged Undefined, they will just immediately teleport to the next floor
    player:DischargeActiveItem()
  end

  -- Reset the player's size
  player.SpriteScale = Vector(1, 1)

  -- Replace the player sprite with a co-op baby version
  SPCPostRender:SetPlayerSprite()
end

return SPCPostNewLevel
