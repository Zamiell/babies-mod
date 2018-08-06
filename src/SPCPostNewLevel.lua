local SPCPostNewLevel  = {}

--
-- Includes
--

local SPCGlobals    = require("src/spcglobals")
local SPCPostRender = require("src/spcpostrender")

-- ModCallbacks.MC_POST_NEW_LEVEL (18)
function SPCPostNewLevel:Main()
  Isaac.DebugString("MC_POST_NEW_LEVEL")

  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()

  -- Make sure the callbacks run in the right order
  -- (naturally, PostNewLevel gets called before the PostGameStarted callbacks)
  if gameFrameCount == 0 then
    return
  end

  SPCPostNewLevel:NewLevel()
end

function SPCPostNewLevel:NewLevel()
  Isaac.DebugString("MC_POST_NEW_LEVEL2")

  -- Local variables
  local game = Game()
  local level = game:GetLevel()
  local player = game:GetPlayer(0)
  local itemConfig = Isaac.GetItemConfig()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]

  -- If we are on an active item baby, remove the active item
  if baby ~= nil then -- (we could be on the first floor)
    local item = baby.item
    if item ~= nil and itemConfig:GetCollectible(item).Type == ItemType.ITEM_ACTIVE then
      player:RemoveCollectible(item)
    end
  end

  -- Give the stored active item back, if any
  if SPCGlobals.run.storedItem ~= 0 then
    player:AddCollectible(SPCGlobals.run.storedItem, SPCGlobals.run.storedItemCharge, false)
    SPCGlobals.run.storedItem = 0
    SPCGlobals.run.storedItemCharge = 0
  end

  -- If we are on a trinket baby, remove the trinket
  if baby ~= nil then -- (we could be on the first floor)
    local trinket = baby.trinket
    if trinket ~= nil then
      player:TryRemoveTrinket(trinket)
    end
  end

  -- Give the stored trinket back, if any
  if SPCGlobals.run.storedTrinket ~= 0 then
    player:AddTrinket(SPCGlobals.run.storedTrinket)
    SPCGlobals.run.storedTrinket = 0
  end

  -- Get a random co-op baby based on the seed of the floor
  -- (but reroll the baby if they have any overlapping items)
  local seed = level:GetDungeonPlacementSeed()
  local newType
  while true do
    seed = SPCGlobals:IncrementRNG(seed)
    math.randomseed(seed)
    newType = math.random(1, 521)

    -- Don't randomly choose a co-op baby if we are choosing a specific one for debugging purposes
    if SPCGlobals.debug ~= 0 then
      newType = SPCGlobals.debug
      break
    end

    -- Check for overlapping items or trinkets
    local newBaby = SPCGlobals.babies[newType]
    local valid = false
    if newBaby.item ~= nil then
      if player:HasCollectible(newBaby.item) == false then
        if newBaby.item2 == nil or player:HasCollectible(newBaby.item2) == false then
          valid = true
        end
      end
    elseif newBaby.trinket ~= nil then
      if player:HasTrinket(newBaby.trinket) == false then
        valid = true
      end
    else
      -- This baby gives a custom effect that is unique from any items that they have already, so nothing will interfere
      valid = true
    end

    -- Check to see if we got this baby in the recent past
    for i = 1, #SPCGlobals.pastBabies do
      if SPCGlobals.pastBabies[i] == newType then
        valid = false
        break
      end
    end

    if valid then
      break
    end
  end

  SPCPostNewLevel:NewBaby(newType)
end

function SPCPostNewLevel:NewBaby(type)
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local activeItem = player:GetActiveItem()
  local activeCharge = player:GetActiveCharge()
  local itemConfig = Isaac.GetItemConfig()
  local baby = SPCGlobals.babies[type]

  SPCGlobals.run.babyType = type
  Isaac.DebugString("Randomly chose co-op baby: " .. tostring(type) .. " - " .. baby.name)

  -- Draw the kind of baby on the starting room
  SPCGlobals.run.drawIntro = true

  -- Check if this is an item baby
  local item = baby.item
  if item ~= nil then
    -- Check to see if it is an active item and we have an active item
    if itemConfig:GetCollectible(item).Type == ItemType.ITEM_ACTIVE and
       activeItem ~= 0 then

      SPCGlobals.run.storedItem = activeItem
      SPCGlobals.run.storedItemCharge = activeCharge
    end

    player:AddCollectible(item, SPCGlobals:GetItemMaxCharges(item), false)

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
  player:AddCacheFlags(CacheFlag.CACHE_LUCK) -- 1024
  player:EvaluateItems()

  -- Miscellaneous other effects
  if baby.name == "Bloat Baby" then
    player:UsePill(PillEffect.PILLEFFECT_PRETTY_FLY, 0) -- 10
  end

  -- Reset the player's size
  player.SpriteScale = Vector(1, 1)

  -- Replace the player sprite with a co-op baby version
  SPCPostRender:SetPlayerSprite()
end

return SPCPostNewLevel
