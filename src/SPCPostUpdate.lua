local SPCPostUpdate = {}

-- Includes
local SPCGlobals          = require("src/spcglobals")
local SPCMisc             = require("src/spcmisc")
local SPCPostRender       = require("src/spcpostrender")
local SPCPostUpdateBabies = require("src/spcpostupdatebabies")

-- ModCallbacks.MC_POST_UPDATE (1)
function SPCPostUpdate:Main()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  -- Racing+ will disable the controls while the player is jumping out of the hole,
  -- so for the FireDelay modification to work properly, we have to wait until this is over
  -- (the "blindfoldedApplied" is reset in the MC_POST_NEW_LEVEL callback)
  if SPCGlobals.run.blindfoldedApplied == false and
     player.ControlsEnabled then

    SPCGlobals.run.blindfoldedApplied = true
    if baby.blindfolded then
      -- Make sure the player doesn't have a tear in the queue
      -- (otherwise, if the player had the tear fire button held down while transitioning between floors,
      -- they will get one more shot)
      -- (this will not work in the MC_EVALUATE_CACHE callback because it gets reset to 0 at the end of the frame)
      player.FireDelay = 1000000 -- 1 million, equal to roughly 9 hours
    else
      -- If we don't check for a large fire delay, then we will get a double tear during the start
      -- If we are going from a blindfolded baby to a non-blindfolded baby,
      -- we must restore the fire delay to a normal value
      if player.FireDelay > 900 then -- 30 seconds
        player.FireDelay = 0
      end

      -- We also have to restore the fire delay on Incubus(es), if any
      local incubi = Isaac.FindByType(EntityType.ENTITY_FAMILIAR, FamiliarVariant.INCUBUS, -1, false, false) -- 7.80
      for i = 1, #incubi do
        local incubus = incubi[i]:ToFamiliar()
        if incubus.FireCooldown > 900 then -- 30 seconds
          incubus.FireCooldown = 0
        end
      end
    end
  end

  --
  -- Handle the player's sprite
  --

  -- Reapply the co-op baby sprite if we have set to reload it on this frame
  -- (this has to be above the below code so that sprites get reloaded on the next frame)
  if SPCGlobals.run.reloadSprite then
    SPCGlobals.run.reloadSprite = false
    SPCPostRender:SetPlayerSprite()
  end

  -- Reapply the co-op baby sprite after every pedestal item recieved
  -- (and keep track of our passive items over the course of the run)
  if player:IsItemQueueEmpty() == false and
     SPCGlobals.run.queuedItems == false then

    SPCGlobals.run.queuedItems = true
    if player.QueuedItem.Item.Type == ItemType.ITEM_PASSIVE then -- 1
      SPCGlobals.run.passiveItems[#SPCGlobals.run.passiveItems + 1] = player.QueuedItem.Item.ID
    end

  elseif player:IsItemQueueEmpty() and
         SPCGlobals.run.queuedItems then

    SPCGlobals.run.queuedItems = false
    SPCGlobals.run.reloadSprite = true
    -- (if we reload the sprite right now, it won't work with Empty Vessel)
  end

  -- Check to see if this is a trinket baby and they dropped the trinket
  SPCPostUpdate:CheckTrinket()

  -- Certain babies do things if the room is cleared
  SPCPostUpdate:CheckRoomCleared()

  -- Do custom baby effects
  SPCPostUpdateBabies:Main()

  -- Check for softlocks
  SPCPostUpdate:CheckSoftlock()
  SPCPostUpdate:CheckSoftlock2()

  -- Check grid entities
  SPCPostUpdate:CheckGridEntities()

  -- Check to see if we are going to the next floor
  SPCPostUpdate:CheckTrapdoor()
end

-- Check to see if this is a trinket baby and they dropped the trinket
function SPCPostUpdate:CheckTrinket()
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local player = game:GetPlayer(0)
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]

  -- Check to see if we are on baby that is supposed to have a permanent trinket
  if baby.trinket == nil then
    return
  end

  -- Check to see if we still have the trinket
  if player:HasTrinket(baby.trinket) then
    return
  end

  -- Check to see if we smelted / destroyed the trinket
  if SPCGlobals.run.trinketGone then
    return
  end

  -- Search the room for the dropped trinket
  local entities = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TRINKET, -- 5.350
                                    baby.trinket, false, false)
  if #entities > 0 then
    -- Delete the dropped trinket
    entities[1]:Remove()

    -- Give it back
    local position = room:FindFreePickupSpawnPosition(player.Position, 1, true)
    player:DropTrinket(position, true) -- This will do nothing if the player does not currently have a trinket
    player:AddTrinket(baby.trinket)
    -- (we can't cancel the animation or it will cause the bug where the player cannot pick up pedestal items)
    Isaac.DebugString("Dropped trinket detected; manually giving it back.")
    return
  end

  -- The trinket is gone but it was not found on the floor,
  -- so the trinket must have been destroyed (e.g. Walnut)
  SPCGlobals.run.trinketGone = true
  Isaac.DebugString("Trinket has been destroyed!")

  -- Handle special trinket deletion circumstances
  if baby.name == "Squirrel Baby" then -- 268
    -- The Walnut broke, so spawn additional items
    for i = 1, 5 do
      local position = room:FindFreePickupSpawnPosition(player.Position, 1, true)
      SPCGlobals.run.randomSeed = SPCGlobals:IncrementRNG(SPCGlobals.run.randomSeed)
      game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, -- 5.100
                 position, Vector(0, 0), nil, 0, SPCGlobals.run.randomSeed)
    end
  end
end

-- Certain babies do things if the room is cleared
function SPCPostUpdate:CheckRoomCleared()
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local roomClear = room:IsClear()

  -- Check the clear status of the room and compare it to what it was a frame ago
  if roomClear == SPCGlobals.run.roomClear then
    return
  end

  SPCGlobals.run.roomClear = roomClear

  if roomClear == false then
    return
  end

  SPCPostUpdate:RoomCleared()
end

function SPCPostUpdate:RoomCleared()
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local roomType = room:GetType()
  local roomSeed = room:GetSpawnSeed() -- Gets a reproducible seed based on the room, something like "2496979501"
  local player = game:GetPlayer(0)
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]

  Isaac.DebugString("Room cleared.")

  if baby.name == "Love Baby" then -- 1
    -- Random Heart - 5.10.0
    game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_HEART, player.Position, Vector(0, 0), player, 0, roomSeed)

  elseif baby.name == "Bandaid Baby" and -- 88
         roomType ~= RoomType.ROOM_BOSS then -- 5

    -- Random collectible - 5.100.0
    local position = room:FindFreePickupSpawnPosition(player.Position, 1, true)
    game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, position, Vector(0, 0), player, 0, roomSeed)

  elseif baby.name == "Jammies Baby" then -- 192
    -- Extra charge per room cleared
    SPCMisc:AddCharge()
    if RacingPlusSchoolbag ~= nil then
      RacingPlusSchoolbag:AddCharge()
    end

  elseif baby.name == "Fishman Baby" then -- 384
    -- Random Bomb - 5.40.0
    game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_BOMB, player.Position, Vector(0, 0), player, 0, roomSeed)
  end
end

-- On certain babies, destroy all poops and TNT barrels after a certain amount of time
function SPCPostUpdate:CheckSoftlock()
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local roomFrameCount = room:GetFrameCount()
  local gridSize = room:GetGridSize()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  -- Check to see if this baby needs the softlock prevention
  if baby.softlockPrevention == nil then
    return
  end

  -- Check to see if we already destroyed the grid entities in the room
  if SPCGlobals.run.roomSoftlock then
    return
  end

  -- Check to see if they have been in the room long enough
  if roomFrameCount < 450 then -- 15 seconds
    return
  end

  -- Prevent softlocks with poops and TNT barrels on certain babies that are blindfolded
  SPCGlobals.run.roomSoftlock = true

  -- Kill all poops in the room to prevent softlocks in specific rooms
  -- (Fireplaces will not cause softlocks since they are killable with The Candle)
  for i = 1, gridSize do
    local gridEntity = room:GetGridEntity(i)
    if gridEntity ~= nil then
      local saveState = gridEntity:GetSaveState()
      if saveState.Type == GridEntityType.GRID_TNT or -- 12
         saveState.Type == GridEntityType.GRID_POOP then -- 14

        gridEntity:Destroy(true) -- Immediate
      end
    end
  end
  Isaac.DebugString("Destroyed all poops & TNT barrels to prevent a softlock.")
end

-- On certain babies, open the doors after 30 seconds to prevent softlocks with Hosts and island enemies
function SPCPostUpdate:CheckSoftlock2()
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local roomFrameCount = room:GetFrameCount()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  -- Check to see if this baby needs the softlock prevention
  if baby.softlockPrevention2 == nil then
    return
  end

  -- Check to see if we already opened the doors in the room
  if SPCGlobals.run.roomSoftlock then
    return
  end

  -- Check to see if they have been in the room long enough
  if roomFrameCount < 900 then -- 30 seconds
    return
  end

  SPCGlobals.run.roomSoftlock = true
  room:SetClear(true)

  -- Open the doors
  for i = 0, 7 do
    local door = room:GetDoor(i)
    if door ~= nil then
      door:Open()
    end
  end
end

function SPCPostUpdate:CheckGridEntities()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local level = game:GetLevel()
  local roomIndex = level:GetCurrentRoomDesc().SafeGridIndex
  if roomIndex < 0 then -- SafeGridIndex is always -1 for rooms outside the grid
    roomIndex = level:GetCurrentRoomIndex()
  end
  local room = game:GetRoom()
  local gridSize = room:GetGridSize()
  local player = game:GetPlayer(0)
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]

  for i = 1, gridSize do
    local gridEntity = room:GetGridEntity(i)
    if gridEntity ~= nil then
      local saveState = gridEntity:GetSaveState()
      if baby.name == "Gold Baby" and -- 15
         saveState.Type == GridEntityType.GRID_POOP and -- 14
         saveState.Variant ~= PoopVariant.POOP_GOLDEN then -- 3

        gridEntity:SetVariant(PoopVariant.POOP_GOLDEN) -- 3

      elseif baby.name == "Ate Poop Baby" and -- 173
             saveState.Type == GridEntityType.GRID_POOP and -- 14
             gridEntity.State == 4 then -- Destroyed

        -- First, check to make sure that we have not already destroyed this poop
        local found = false
        for j = 1, #SPCGlobals.run.killedPoops do
          local poop = SPCGlobals.run.killedPoops[j]
          if poop.roomIndex == roomIndex and
             poop.gridIndex == i then

            found = true
            break
          end
        end
        if found == false then
          -- Second, check to make sure that there is not any existing pickups already on the poop
          -- (the size of a grid square is 40x40)
          local entities = Isaac.FindInRadius(gridEntity.Position, 25, EntityPartition.PICKUP) -- 1 << 4
          if #entities == 0 then
            SPCMisc:SpawnRandomPickup(gridEntity.Position)

            -- Keep track of it so that we don't spawn another pickup on the next frame
            SPCGlobals.run.killedPoops[#SPCGlobals.run.killedPoops + 1] = {
              roomIndex = roomIndex,
              gridIndex = i,
            }
          end
        end

      elseif baby.name == "Exploding Baby" and -- 320
             SPCGlobals.run.babyFrame == 0 and
             ((saveState.Type == GridEntityType.GRID_ROCK and saveState.State == 1) or -- 2
              (saveState.Type == GridEntityType.GRID_ROCKT and saveState.State == 1) or-- 4
              (saveState.Type == GridEntityType.GRID_ROCK_BOMB and saveState.State == 1) or -- 5
              (saveState.Type == GridEntityType.GRID_ROCK_ALT and saveState.State == 1) or -- 6
              (saveState.Type == GridEntityType.GRID_SPIDERWEB and saveState.State == 0) or -- 10
              (saveState.Type == GridEntityType.GRID_TNT and saveState.State ~= 4) or -- 12
              (saveState.Type == GridEntityType.GRID_POOP and saveState.State ~= 4) or -- 14
              (saveState.Type == GridEntityType.GRID_ROCK_SS and saveState.State ~= 3)) and -- 22
             SPCGlobals:InsideSquare(player.Position, gridEntity.Position, 36) then

        SPCGlobals.run.invulnerable = true
        player:UseActiveItem(CollectibleType.COLLECTIBLE_KAMIKAZE, false, false, false, false) -- 40
        SPCGlobals.run.invulnerable = false
        SPCGlobals.run.babyFrame = gameFrameCount + 10
      end
    end
  end
end

function SPCPostUpdate:CheckTrapdoor()
  -- Local variables
  local game = Game()
  local seeds = game:GetSeeds()
  local player = game:GetPlayer(0)
  local playerSprite = player:GetSprite()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  -- If this baby gives a mapping item, We can't wait until the next floor to remove because
  -- its effect will have already been applied
  -- So, we need to monitor for the trapdoor animation
  if playerSprite:IsPlaying("Trapdoor") == false and
     playerSprite:IsPlaying("Trapdoor2") == false and
     playerSprite:IsPlaying("LightTravel") == false then

    return
  end

  -- Remove mapping
  if baby.item == CollectibleType.COLLECTIBLE_COMPASS or -- 21
     baby.item2 == CollectibleType.COLLECTIBLE_COMPASS then -- 21

    player:RemoveCollectible(CollectibleType.COLLECTIBLE_COMPASS) -- 21
  end
  if baby.item == CollectibleType.COLLECTIBLE_TREASURE_MAP or -- 54
     baby.item2 == CollectibleType.COLLECTIBLE_TREASURE_MAP then -- 54

    player:RemoveCollectible(CollectibleType.COLLECTIBLE_TREASURE_MAP) -- 54
  end
  if baby.item == CollectibleType.COLLECTIBLE_BLUE_MAP or -- 246
     baby.item2 == CollectibleType.COLLECTIBLE_BLUE_MAP then -- 246

    player:RemoveCollectible(CollectibleType.COLLECTIBLE_BLUE_MAP) -- 246
  end
  if baby.item == CollectibleType.COLLECTIBLE_MIND or -- 333
     baby.item2 == CollectibleType.COLLECTIBLE_MIND then -- 333

    player:RemoveCollectible(CollectibleType.COLLECTIBLE_MIND) -- 333
  end

  -- Racing+ uses the "Total Curse Immunity" easter egg to remove all curses from the game
  -- We may have temporarily disabled the Easter Egg,
  -- so make sure that it is re-enabled before we head to the next floor
  if RacingPlusGlobals ~= nil and
     seeds:HasSeedEffect(SeedEffect.SEED_PREVENT_ALL_CURSES) == false then -- 70

    seeds:AddSeedEffect(SeedEffect.SEED_PREVENT_ALL_CURSES) -- 70
  end
end

return SPCPostUpdate
