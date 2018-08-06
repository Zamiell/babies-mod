local SPCPostUpdate  = {}

--
-- Includes
--

local SPCGlobals    = require("src/spcglobals")
local SPCPostRender = require("src/spcpostrender")

-- ModCallbacks.MC_POST_UPDATE (1)
function SPCPostUpdate:Main()
  -- Do nothing if we have not initialized the co-op baby yet
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)

  -- Reapply the co-op baby sprite after every pedestal item recieved
  if player:IsItemQueueEmpty() == false then
    SPCGlobals.run.queuedItems = true
  elseif player:IsItemQueueEmpty() and SPCGlobals.run.queuedItems then
    SPCGlobals.run.queuedItems = false
    SPCPostRender:SetPlayerSprite()
  end

  -- Check to see if this is a trinket baby and they dropped the trinket
  SPCPostUpdate:CheckTrinket()

  -- Certain babies do things if the room is cleared
  SPCPostUpdate:CheckRoomCleared()
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
  local pos = room:FindFreePickupSpawnPosition(player.Position, 0, true)
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

return SPCPostUpdate
