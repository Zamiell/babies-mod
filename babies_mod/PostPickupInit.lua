local PostPickupInit = {}

-- Note: Position, SpawnerType, SpawnerVariant, and Price are not initialized yet in this callback

-- Includes
local g = require("babies_mod/globals")
local Misc = require("babies_mod/misc")

-- ModCallbacks.MC_POST_PICKUP_INIT (34)
function PostPickupInit:Main(pickup)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  -- All baby effects should ignore the Checkpoint
  if (
    pickup.Variant == PickupVariant.PICKUP_COLLECTIBLE -- 100
    and pickup.SubType == CollectibleType.COLLECTIBLE_CHECKPOINT
  ) then
    return
  end

  local babyFunc = PostPickupInit.functions[babyType]
  if babyFunc ~= nil then
    return babyFunc(pickup)
  end
end

-- The collection of functions for each baby
PostPickupInit.functions = {}

-- Lil' Baby
PostPickupInit.functions[36] = function(pickup)
  -- Everything is tiny
  pickup.SpriteScale = Vector(0.5, 0.5)
end

-- Big Baby
PostPickupInit.functions[37] = function(pickup)
  -- Everything is giant
  -- Make an exception for the 4 Golden Chests,
  -- as those will be made giant before the babies effect is removed
  if (
    g.l:GetStage() ~= 11
    or g.l:GetCurrentRoomIndex() ~= g.l:GetStartingRoomIndex()
  ) then
    pickup.SpriteScale = Vector(2, 2)
  end
end

-- Shopkeeper Baby
PostPickupInit.functions[215] = function(pickup)
  -- Free items in shops
  if pickup.Variant == PickupVariant.PICKUP_COLLECTIBLE then
    local roomType = g.r:GetType()
    if (
      roomType == RoomType.ROOM_SHOP -- 2
      or roomType == RoomType.ROOM_ERROR -- 3
    ) then
      pickup.Price = 0
    end
  end
end

-- Wizard Baby
PostPickupInit.functions[253] = function(pickup)
  -- Make all cards and runes face-up
  if pickup.Variant ~= PickupVariant.PICKUP_TAROTCARD then -- 300
    return
  end

  if (
    (
      pickup.SubType >= Card.CARD_FOOL -- 1
      and pickup.SubType <= Card.RUNE_ALGIZ -- 39
    )
    -- Blank Rune (40) and Black Rune (41) are handled in Racing+
    or pickup.SubType == Card.CARD_CHAOS -- 42
    -- Credit Card (43) has a unique card back in vanilla
    or pickup.SubType == Card.CARD_RULES -- 44
    -- A Card Against Humanity (45) has a unique card back in vanilla
    or pickup.SubType == Card.CARD_SUICIDE_KING -- 46
    or pickup.SubType == Card.CARD_GET_OUT_OF_JAIL -- 47
    -- (Get out of Jail Free Card has a unique card back in vanilla, but this one looks better)
    or pickup.SubType == Card.CARD_QUESTIONMARK -- 48
    -- Dice Shard (49) has a unique card back in vanilla
    -- Emergency Contact (50) has a unique card back in vanilla
    -- Holy Card (51) has a unique card back in vanilla
    or (
      pickup.SubType >= Card.CARD_HUGE_GROWTH -- 52
      and pickup.SubType <= Card.CARD_ERA_WALK -- 54
    )
  ) then
    local sprite = pickup:GetSprite()
    sprite:ReplaceSpritesheet(0, "gfx/cards/" .. tostring(pickup.SubType) .. ".png")
    sprite:LoadGraphics()
  end
end

-- Scary Baby
PostPickupInit.functions[317] = function(pickup)
  -- Items cost hearts
  if pickup.Variant == PickupVariant.PICKUP_COLLECTIBLE then
    pickup.AutoUpdatePrice = false
    pickup.Price = Misc:GetItemHeartPrice(pickup.SubType)
  end
end

-- 404 Baby
PostPickupInit.functions[463] = function(pickup)
  Misc:SetRandomColor(pickup)
end

-- Demon Baby
PostPickupInit.functions[527] = function(pickup)
  -- Free devil deals
  if pickup.Variant == PickupVariant.PICKUP_COLLECTIBLE then
    local roomType = g.r:GetType()
    if (
      roomType == RoomType.ROOM_DEVIL -- 14
      or roomType == RoomType.ROOM_BLACK_MARKET -- 22
    ) then
      pickup.Price = 0
    end
  end
end

-- Fate's Reward
PostPickupInit.functions[537] = function(pickup)
  -- Items cost money
  if pickup.Variant == PickupVariant.PICKUP_COLLECTIBLE then -- 100
    local roomType = g.r:GetType()
    if (
      roomType == RoomType.ROOM_DEVIL -- 14
      or roomType == RoomType.ROOM_BLACK_MARKET -- 22
    ) then
      pickup.AutoUpdatePrice = false
    end
    if pickup.Price <= 0 then
      pickup.Price = 15
    end
  end
end

return PostPickupInit
