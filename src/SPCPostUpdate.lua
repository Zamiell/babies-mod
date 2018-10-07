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

  -- Check to see if this is a trinket baby and they dropped the trinket
  SPCPostUpdate:CheckTrinket()

  -- Certain babies do things if the room is cleared
  SPCPostUpdate:CheckRoomCleared()

  -- Do custom baby effects
  SPCPostUpdateBabies:Main()

  -- Check grid entities
  SPCPostUpdate:CheckGridEntities()
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
  local trinket = baby.trinket
  if trinket == nil then
    return
  end

  -- Check to see if we dropped the trinket
  if player:HasTrinket(trinket) then
    return
  end

  -- Give it back
  local pos = room:FindFreePickupSpawnPosition(player.Position, 1, true)
  player:DropTrinket(pos, true)
  player:AddTrinket(trinket)
  Isaac.DebugString("Dropped trinket detected; manually giving it back.")

  -- Delete the dropped trinket
  for i, entity in pairs(Isaac.GetRoomEntities()) do
    if entity.Type == EntityType.ENTITY_PICKUP and -- 5
       entity.Variant == PickupVariant.PICKUP_TRINKET and -- 350
       entity.SubType == trinket then

      entity:Remove()
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
  local roomSeed = room:GetSpawnSeed() -- Gets a reproducible seed based on the room, something like "2496979501"
  local player = game:GetPlayer(0)
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  local zeroVelocity = Vector(0, 0)

  Isaac.DebugString("Room cleared.")

  if baby.name == "Love Baby" then
    -- Random Heart - 5.10.0
    game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_HEART, player.Position, zeroVelocity, player, 0, roomSeed)
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
  local sfx = SFXManager()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]

  for i = 1, gridSize do
    local gridEntity = room:GetGridEntity(i)
    if gridEntity ~= nil then
      local saveState = gridEntity:GetSaveState()
      if baby.name == "Blockhead Baby" and -- 71
         saveState.Type == GridEntityType.GRID_ROCKB and -- 3
         SPCGlobals:InsideSquare(player.Position, gridEntity.Position, 36) then

        gridEntity.Sprite = Sprite() -- If we don't do this, it will still show for a frame
        room:RemoveGridEntity(i, 0, false) -- gridEntity:Destroy() does not work
        sfx:Play(SoundEffect.SOUND_POT_BREAK, 1, 0, false, 1) -- 138

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
