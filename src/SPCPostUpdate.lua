local SPCPostUpdate = {}

-- Includes
local SPCGlobals          = require("src/spcglobals")
local SPCMisc             = require("src/spcmisc")
local SPCPostRender       = require("src/spcpostrender")
local SPCPostUpdateBabies = require("src/spcpostupdatebabies")
local SPCChangeCharacter  = require("src/spcchangecharacter")

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

  -- Reapply the co-op baby sprite after every pedestal item recieved
  -- (and keep track of our passive items over the course of the run)
  if player:IsItemQueueEmpty() == false and
     SPCGlobals.run.queuedItems == false then

    SPCGlobals.run.queuedItems = true
    if player.QueuedItem.Item.Type == ItemType.ITEM_PASSIVE then -- 1
      SPCGlobals.run.passiveItems[#SPCGlobals.run.passiveItems + 1] = player.QueuedItem.Item.ID
      Isaac.DebugString("Added passive item " .. tostring(player.QueuedItem.Item.ID) ..
                        " (total items: " .. #SPCGlobals.run.passiveItems .. ")")
    end

  elseif player:IsItemQueueEmpty() and
         SPCGlobals.run.queuedItems then

    SPCGlobals.run.queuedItems = false
    SPCPostRender:SetPlayerSprite()
  end

  -- Reapply teh co-op baby sprite if we have set to reload it on this frame
  if SPCGlobals.run.reloadSprite then
    SPCGlobals.run.reloadSprite = false
    SPCPostRender:SetPlayerSprite()
  end

  -- Check to see if this is a trinket baby and they dropped the trinket
  SPCPostUpdate:CheckTrinket()

  -- Certain babies do things if the room is cleared
  SPCPostUpdate:CheckRoomCleared()

  -- Do custom baby effects
  SPCPostUpdateBabies:Main()

  -- Check grid entities
  SPCPostUpdate:CheckGridEntities()

  -- Check if we need to change the character
  SPCChangeCharacter:PostUpdate()
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
  local entities = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TRINKET, -1, -- 5.350
                                    false, false)
  local droppedTrinket
  for i = 1, #entities do
    if entities[i].SubType == baby.trinket then
      droppedTrinket = entities[i]
      break
    end
  end
  if droppedTrinket ~= nil then
    -- Delete the dropped trinket
    droppedTrinket:Remove()

    -- Give it back
    local pos = room:FindFreePickupSpawnPosition(player.Position, 1, true)
    player:DropTrinket(pos, true) -- This will do nothing if the player does not currently have a trinket
    player:AddTrinket(baby.trinket)
    player:StopExtraAnimation()
    Isaac.DebugString("Dropped trinket detected; manually giving it back.")
    return
  end

  -- The trinket is gone but it was not found on the floor,
  -- so the trinket must have been destroyed (e.g. Walnut) or smelted
  SPCGlobals.run.trinketGone = true

  -- Handle special trinket deletion circumstances
  if baby.name == "Squirrel Baby" then -- 268
    -- The Walnut broke, so spawn additional items
    SPCGlobals.run.babyBool = true
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

  elseif baby.name == "Fishman Baby" then -- 384
    -- Random Bomb - 5.40.0
    game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_BOMB, player.Position, Vector(0, 0), player, 0, roomSeed)
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

return SPCPostUpdate
