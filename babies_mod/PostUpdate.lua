local PostUpdate = {}

-- Includes
local g = require("babies_mod/globals")
local Misc = require("babies_mod/misc")
local PostRender = require("babies_mod/postrender")
local PostUpdateBabies = require("babies_mod/postupdatebabies")
local RoomCleared = require("babies_mod/roomcleared")

-- ModCallbacks.MC_POST_UPDATE (1)
function PostUpdate:Main()
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  -- Racing+ will disable the controls while the player is jumping out of the hole,
  -- so for the FireDelay modification to work properly, we have to wait until this is over
  -- (the "blindfoldedApplied" is reset in the MC_POST_NEW_LEVEL callback)
  if not g.run.blindfoldedApplied and g.p.ControlsEnabled then
    g.run.blindfoldedApplied = true
    if baby.blindfolded then
      -- Make sure the player doesn't have a tear in the queue
      -- (otherwise, if the player had the tear fire button held down while transitioning between
      -- floors, they will get one more shot)
      -- (this will not work in the MC_EVALUATE_CACHE callback because it gets reset to 0 at the end
      -- of the frame)
      g.p.FireDelay = 1000000 -- 1 million, equal to roughly 9 hours
    else
      -- If we don't check for a large fire delay, then we will get a double tear during the start
      -- If we are going from a blindfolded baby to a non-blindfolded baby,
      -- we must restore the fire delay to a normal value
      if g.p.FireDelay > 900 then -- 30 seconds
        g.p.FireDelay = 0
      end

      -- We also have to restore the fire delay on Incubus, if any
      local incubi = Isaac.FindByType(
        EntityType.ENTITY_FAMILIAR, -- 3
        FamiliarVariant.INCUBUS, -- 80
        -1,
        false,
        false
      )
      for _, entity in ipairs(incubi) do
        local incubus = entity:ToFamiliar()
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
  if g.run.reloadSprite then
    g.run.reloadSprite = false
    PostRender:SetPlayerSprite()
  end

  -- Reapply the co-op baby sprite after every pedestal item recieved
  -- (and keep track of our passive items over the course of the run)
  if (
    not g.p:IsItemQueueEmpty()
    and not g.run.queuedItems
  ) then
    g.run.queuedItems = true
    if g.p.QueuedItem.Item.Type == ItemType.ITEM_PASSIVE then -- 1
      g.run.passiveItems[#g.run.passiveItems + 1] = g.p.QueuedItem.Item.ID
    end
  elseif (
    g.p:IsItemQueueEmpty()
    and g.run.queuedItems
  ) then
    g.run.queuedItems = false
    g.run.reloadSprite = true
    -- (if we reload the sprite right now, it won't work with Empty Vessel)
  end

  -- Check to see if this is a trinket baby and they dropped the trinket
  PostUpdate:CheckTrinket()

  -- Certain babies do things if the room is cleared
  PostUpdate:CheckRoomCleared()

  -- Do custom baby effects
  PostUpdateBabies:Main()

  -- Check for softlocks
  PostUpdate:CheckSoftlock()
  PostUpdate:CheckSoftlock2()

  -- Check grid entities
  PostUpdate:CheckGridEntities()

  -- Check to see if we are going to the next floor
  PostUpdate:CheckTrapdoor()
end

-- Check to see if this is a trinket baby and they dropped the trinket
function PostUpdate:CheckTrinket()
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]

  -- Check to see if we are on baby that is supposed to have a permanent trinket
  if baby.trinket == nil then
    return
  end

  -- Check to see if we still have the trinket
  if g.p:HasTrinket(baby.trinket) then
    return
  end

  -- Check to see if we smelted / destroyed the trinket
  if g.run.trinketGone then
    return
  end

  -- Search the room for the dropped trinket
  local trinkets = Isaac.FindByType(
    EntityType.ENTITY_PICKUP, -- 5
    PickupVariant.PICKUP_TRINKET, -- 350
    baby.trinket,
    false,
    false
  )
  if #trinkets > 0 then
    -- Delete the dropped trinket
    trinkets[1]:Remove()

    -- Give it back
    local position = g.r:FindFreePickupSpawnPosition(g.p.Position, 1, true)
    -- This will do nothing if the player does not currently have a trinket
    g.p:DropTrinket(position, true)
    g.p:AddTrinket(baby.trinket)
    -- (we can't cancel the animation or it will cause the bug where the player cannot pick up
    -- pedestal items)
    Isaac.DebugString("Dropped trinket detected; manually giving it back.")
    return
  end

  -- The trinket is gone but it was not found on the floor,
  -- so the trinket must have been destroyed (e.g. Walnut)
  g.run.trinketGone = true
  Isaac.DebugString("Trinket has been destroyed!")

  -- Handle special trinket deletion circumstances
  if baby.name == "Squirrel Baby" then -- 268
    -- The Walnut broke, so spawn additional items
    for i = 1, 5 do
      local position = g.r:FindFreePickupSpawnPosition(g.p.Position, 1, true)
      g.run.randomSeed = g:IncrementRNG(g.run.randomSeed)
      g.g:Spawn(
        EntityType.ENTITY_PICKUP, -- 5
        PickupVariant.PICKUP_COLLECTIBLE, -- 100
        position,
        g.zeroVector,
        nil,
        0,
        g.run.randomSeed
      )
    end
  end
end

-- Certain babies do things if the room is cleared
function PostUpdate:CheckRoomCleared()
  -- Local variables
  local roomClear = g.r:IsClear()

  -- Check the clear status of the room and compare it to what it was a frame ago
  if roomClear == g.run.roomClear then
    return
  end

  g.run.roomClear = roomClear

  if not roomClear then
    return
  end

  Isaac.DebugString("Room cleared.")
  RoomCleared:Main()
end

-- On certain babies, destroy all poops and TNT barrels after a certain amount of time
function PostUpdate:CheckSoftlock()
  -- Local variables
  local roomFrameCount = g.r:GetFrameCount()
  local gridSize = g.r:GetGridSize()
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  -- Check to see if this baby needs the softlock prevention
  if baby.softlockPrevention == nil then
    return
  end

  -- Check to see if we already destroyed the grid entities in the room
  if g.run.roomSoftlock then
    return
  end

  -- Check to see if they have been in the room long enough
  if roomFrameCount < 450 then -- 15 seconds
    return
  end

  -- Prevent softlocks with poops and TNT barrels on certain babies that are blindfolded
  g.run.roomSoftlock = true

  -- Kill all poops in the room to prevent softlocks in specific rooms
  -- (Fireplaces will not cause softlocks since they are killable with The Candle)
  for i = 1, gridSize do
    local gridEntity = g.r:GetGridEntity(i)
    if gridEntity ~= nil then
      local saveState = gridEntity:GetSaveState()
      if (
        saveState.Type == GridEntityType.GRID_TNT -- 12
        or saveState.Type == GridEntityType.GRID_POOP -- 14
      ) then
        gridEntity:Destroy(true) -- Immediate
      end
    end
  end
  Isaac.DebugString("Destroyed all poops & TNT barrels to prevent a softlock.")
end

-- On certain babies,
-- open the doors after 30 seconds to prevent softlocks with Hosts and island enemies
function PostUpdate:CheckSoftlock2()
  -- Local variables
  local roomFrameCount = g.r:GetFrameCount()
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  -- Check to see if this baby needs the softlock prevention
  if baby.softlockPrevention2 == nil then
    return
  end

  -- Check to see if we already opened the doors in the room
  if g.run.roomSoftlock then
    return
  end

  -- Check to see if they have been in the room long enough
  if roomFrameCount < 900 then -- 30 seconds
    return
  end

  g.run.roomSoftlock = true
  g.r:SetClear(true)

  -- Open the doors
  for i = 0, 7 do
    local door = g.r:GetDoor(i)
    if door ~= nil then
      door:Open()
    end
  end
end

function PostUpdate:CheckGridEntities()
  -- Local variables
  local roomIndex = g:GetRoomIndex()
  local gameFrameCount = g.g:GetFrameCount()
  local gridSize = g.r:GetGridSize()
  local babyType = g.run.babyType
  local baby = g.babies[babyType]

  for i = 1, gridSize do
    local gridEntity = g.r:GetGridEntity(i)
    if gridEntity ~= nil then
      local saveState = gridEntity:GetSaveState()
      if (
        baby.name == "Gold Baby" -- 15
        and saveState.Type == GridEntityType.GRID_POOP -- 14
        and saveState.Variant ~= g.PoopVariant.POOP_GOLDEN -- 3
      ) then
        gridEntity:SetVariant(g.PoopVariant.POOP_GOLDEN) -- 3
      elseif (
        baby.name == "Ate Poop Baby" -- 173
        and saveState.Type == GridEntityType.GRID_POOP -- 14
        and gridEntity.State == 4 -- Destroyed
      ) then
        -- First, check to make sure that we have not already destroyed this poop
        local found = false
        for j = 1, #g.run.killedPoops do
          local poop = g.run.killedPoops[j]
          if poop.roomIndex == roomIndex and
             poop.gridIndex == i then

            found = true
            break
          end
        end
        if not found then
          -- Second, check to make sure that there is not any existing pickups already on the poop
          -- (the size of a grid square is 40x40)
          local entities = Isaac.FindInRadius(
            gridEntity.Position,
            25,
            EntityPartition.PICKUP -- 1 << 4
          )
          if #entities == 0 then
            Misc:SpawnRandomPickup(gridEntity.Position)

            -- Keep track of it so that we don't spawn another pickup on the next frame
            g.run.killedPoops[#g.run.killedPoops + 1] = {
              roomIndex = roomIndex,
              gridIndex = i,
            }
          end
        end
      elseif (
        baby.name == "Exploding Baby" -- 320
        and g.run.babyFrame == 0
        and (
          (saveState.Type == GridEntityType.GRID_ROCK and saveState.State == 1) -- 2
          or (saveState.Type == GridEntityType.GRID_ROCKT and saveState.State == 1)-- 4
          or (saveState.Type == GridEntityType.GRID_ROCK_BOMB and saveState.State == 1) -- 5
          or (saveState.Type == GridEntityType.GRID_ROCK_ALT and saveState.State == 1) -- 6
          or (saveState.Type == GridEntityType.GRID_SPIDERWEB and saveState.State == 0) -- 10
          or (saveState.Type == GridEntityType.GRID_TNT and saveState.State ~= 4) -- 12
          or (saveState.Type == GridEntityType.GRID_POOP and saveState.State ~= 4) -- 14
          or (saveState.Type == GridEntityType.GRID_ROCK_SS and saveState.State ~= 3) -- 22
        )
        and g.p.Position:Distance(gridEntity.Position) <= 36
      ) then
        g.run.invulnerable = true
        g.p:UseActiveItem(CollectibleType.COLLECTIBLE_KAMIKAZE, false, false, false, false) -- 40
        g.run.invulnerable = false
        g.run.babyFrame = gameFrameCount + 10
      end
    end
  end
end

function PostUpdate:CheckTrapdoor()
  -- Local variables
  local playerSprite = g.p:GetSprite()
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  -- If this baby gives a mapping item, We can't wait until the next floor to remove because
  -- its effect will have already been applied
  -- So, we need to monitor for the trapdoor animation
  if (
    not playerSprite:IsPlaying("Trapdoor")
    and not playerSprite:IsPlaying("Trapdoor2")
    and not playerSprite:IsPlaying("LightTravel")
  ) then
    return
  end

  -- Remove mapping
  if (
    baby.item == CollectibleType.COLLECTIBLE_COMPASS -- 21
    or baby.item2 == CollectibleType.COLLECTIBLE_COMPASS -- 21
  ) then
    g.p:RemoveCollectible(CollectibleType.COLLECTIBLE_COMPASS) -- 21
  end
  if (
    baby.item == CollectibleType.COLLECTIBLE_TREASURE_MAP -- 54
    or baby.item2 == CollectibleType.COLLECTIBLE_TREASURE_MAP -- 54
  ) then
    g.p:RemoveCollectible(CollectibleType.COLLECTIBLE_TREASURE_MAP) -- 54
  end
  if (
    baby.item == CollectibleType.COLLECTIBLE_BLUE_MAP -- 246
    or baby.item2 == CollectibleType.COLLECTIBLE_BLUE_MAP -- 246
  ) then
    g.p:RemoveCollectible(CollectibleType.COLLECTIBLE_BLUE_MAP) -- 246
  end
  if (
    baby.item == CollectibleType.COLLECTIBLE_MIND -- 333
    or baby.item2 == CollectibleType.COLLECTIBLE_MIND -- 333
  ) then
    g.p:RemoveCollectible(CollectibleType.COLLECTIBLE_MIND) -- 333
  end
end

return PostUpdate
