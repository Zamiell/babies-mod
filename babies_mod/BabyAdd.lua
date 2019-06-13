local BabyAdd = {}

-- Includes
local g = require("babies_mod/globals")

function BabyAdd:Main()
  -- Local variables
  local stage = g.l:GetStage()
  local soulHearts = g.p:GetSoulHearts()
  local blackHearts = g.p:GetBlackHearts()
  local coins = g.p:GetNumCoins()
  local bombs = g.p:GetNumBombs()
  local keys = g.p:GetNumKeys()
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  -- Draw the kind of baby on the starting room
  g.run.drawIntro = true

  -- Put the baby description into the "save#.dat" file so that it can be shown on OBS
  Isaac.SaveModData(g.BM, baby.description)

  -- Check if this is an item baby
  local item = baby.item
  if item ~= nil then
    -- Check to see if it is an active item
    if g:GetItemConfig(item).Type == ItemType.ITEM_ACTIVE then -- 3
      -- Find out how many charges it should have
      local charges = g:GetItemMaxCharges(item)
      if baby.uncharged ~= nil then
        charges = 0
      end

      -- Find out where to put it
      if RacingPlusGlobals ~= nil and
         g.p:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM) and
         RacingPlusGlobals.run.schoolbag.item == 0 then

        -- There is room in the Racing+ Schoolbag for it, so put it there
        RacingPlusSchoolbag:Put(item, charges)

      elseif g.p:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG) and -- 534
             g.p.SecondaryActiveItem.Item == 0 then

        -- There is room in the vanilla Schoolbag for it, so put it there
        -- (getting new active items will automatically put the existing active item inside the Schoolbag)
        g.p:AddCollectible(item, charges, false)
        g.p:SwapActiveItems()

      else
        -- We don't have a Schoolbag, so just give the new active item
        g.p:AddCollectible(item, charges, false)
      end
    else
      -- Give the passive item
      g.p:AddCollectible(item, 0, false)
      Isaac.DebugString("Added the new baby passive item (" .. tostring(item) .. ").")
    end

    -- Hide it from the item tracker
    Isaac.DebugString("Removing collectible " .. tostring(item))

    -- Also remove this item from all pools
    g.itemPool:RemoveCollectible(item)
  end

  -- Check if this is a multiple item baby
  if baby.itemNum ~= nil then
    for i = 1, baby.itemNum - 1 do
      g.p:AddCollectible(baby.item, 0, false)
      Isaac.DebugString("Removing collectible " .. tostring(baby.item))
    end
  end

  -- Check if this is a baby that grants a second item
  -- (this should always be a passive item)
  local item2 = baby.item2
  if item2 ~= nil then
    g.p:AddCollectible(item2, g:GetItemMaxCharges(item2), false)

    -- Hide it from the item tracker
    Isaac.DebugString("Removing collectible " .. tostring(item2))

    -- Also remove this item from all pools
    g.itemPool:RemoveCollectible(item)
  end

  -- Reset the soul hearts and black hearts to the way it was before we added the items
  local newSoulHearts = g.p:GetSoulHearts()
  local newBlackHearts = g.p:GetBlackHearts()
  if newSoulHearts ~= soulHearts or
     newBlackHearts ~= blackHearts then

    g.p:AddSoulHearts(-24)
    for i = 1, soulHearts do
      local bitPosition = math.floor((i - 1) / 2)
      local bit = (blackHearts & (1 << bitPosition)) >> bitPosition
      if bit == 0 then -- Soul heart
        g.p:AddSoulHearts(1)
      else -- Black heart
        g.p:AddBlackHearts(1)
      end
    end
  end

  -- Reset the coin/bomb/key count to the way it was before we added the items
  g.p:AddCoins(-99)
  g.p:AddCoins(coins)
  g.p:AddBombs(-99)
  g.p:AddBombs(bombs)
  g.p:AddKeys(-99)
  g.p:AddKeys(keys)

  -- Check if this is a trinket baby
  local trinket = baby.trinket
  if trinket ~= nil then
    g.p:AddTrinket(trinket)
    g.itemPool:RemoveTrinket(trinket)
  end

 -- Some babies give Easter Eggs
  if baby.seed ~= nil then
    g.seeds:AddSeedEffect(baby.seed)
  end

  -- Don't grant extra pickups
  if baby.item == CollectibleType.COLLECTIBLE_PHD or -- 75
     baby.item2 == CollectibleType.COLLECTIBLE_PHD then -- 75

    -- Delete the starting pill
    local pills = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_PILL, -1, false, false) -- 5.70
    for _, pill in ipairs(pills) do
      pill:Remove()
    end
  end
  if baby.item == CollectibleType.COLLECTIBLE_STARTER_DECK or -- 251
     baby.item2 == CollectibleType.COLLECTIBLE_STARTER_DECK then -- 251

    -- Delete the starting card
    local cards = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TAROTCARD, -- 5.300
                                   -1, false, false)
    for _, card in ipairs(cards) do
      card:Remove()
    end
  end
  if baby.item == CollectibleType.COLLECTIBLE_LITTLE_BAGGY or -- 252
     baby.item2 == CollectibleType.COLLECTIBLE_LITTLE_BAGGY then -- 252

    -- Delete the starting pill
    local pills = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_PILL, -1, false, false) -- 5.70
    for _, pill in ipairs(pills) do
      pill:Remove()
    end
  end
  if (baby.item == CollectibleType.COLLECTIBLE_CHAOS or -- 402
      baby.item2 == CollectibleType.COLLECTIBLE_CHAOS) and -- 402
     stage ~= 11 then -- Don't delete the pickups on The Chest / Dark Room

    -- Delete the starting random pickups
    local pickups = Isaac.FindByType(EntityType.ENTITY_PICKUP, -1, -1, false, false) -- 5
    for _, pickup in ipairs(pickups) do
      if pickup.Variant ~= PickupVariant.PICKUP_COLLECTIBLE then -- 100
        pickup:Remove()
      end
    end
  end
  if baby.item == CollectibleType.COLLECTIBLE_SACK_HEAD or -- 424
     baby.item2 == CollectibleType.COLLECTIBLE_SACK_HEAD then -- 424

    -- Delete the starting sack
    local sacks = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_GRAB_BAG, -1, false, false) -- 5.69
    for _, sack in ipairs(sacks) do
      sack:Remove()
    end
  end
  if baby.item == CollectibleType.COLLECTIBLE_LIL_SPEWER or -- 537
     baby.item2 == CollectibleType.COLLECTIBLE_LIL_SPEWER then -- 537

    -- Delete the starting pill
    local pills = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_PILL, -1, false, false) -- 5.70
    for _, pill in ipairs(pills) do
      pill:Remove()
    end
  end

  -- Add miscellaneous other effects
  local babyFunc = BabyAdd.functions[type]
  if babyFunc ~= nil then
    babyFunc()
  end

  -- Some babies grant extra stats
  g.p:AddCacheFlags(CacheFlag.CACHE_ALL) -- 0xFFFFFFFF
  g.p:EvaluateItems()

  -- Reset the player's size
  g.p.SpriteScale = Vector(1, 1)

  -- We don't have to set the sprite now, because it will be set later on in the MC_POST_NEW_ROOM callback
  Isaac.DebugString("Applied baby: " .. tostring(type) .. " - " .. baby.name)
end

-- The collection of functions for each baby
BabyAdd.functions = {}

-- Gold Baby
BabyAdd.functions[15] = function()
  g.p:AddGoldenBomb()
  g.p:AddGoldenKey()
  g.p:AddGoldenHearts(12)
end

-- Rage Baby
BabyAdd.functions[31] = function()
  g.p:AddBombs(99)
end

-- Noose Baby
BabyAdd.functions[39] = function()
  -- Don't shoot when the timer reaches 0
  -- Set the timer so that we don't take damage immediately upon reaching the floor
  g.run.babyCounters = g.g:GetFrameCount() + g.babies[39].time
end

-- Hive Baby
BabyAdd.functions[40] = function()
  -- The game only allows a maximum of 64 Blue Flies and Blue Spiders at one time
  g.p:AddBlueFlies(64, g.p.Position, nil)
  for i = 1, 64 do
    g.p:AddBlueSpider(g.p.Position)
  end
end

-- Whore Baby
BabyAdd.functions[43] = function()
  -- We will use the counters variable to store explosions
  g.run.babyCounters = {}
end

-- Dark Baby
BabyAdd.functions[48] = function()
  -- Temporary blindness
  g.run.babySprites = Sprite()
  g.run.babySprites:Load("gfx/misc/black.anm2", true)
  g.run.babySprites:SetFrame("Default", 0)
end

-- Hopeless Baby
BabyAdd.functions[125] = function()
  -- Keys are hearts
  g.p:AddKeys(2)

  -- Initialize the sprites
  g.run.babySprites = Sprite()
  g.run.babySprites:Load("gfx/custom-health/key.anm2", true)
  g.run.babySprites:SetFrame("Default", 0)
end

-- Mohawk Baby
BabyAdd.functions[138] = function()
  -- Bombs are hearts
  g.p:AddBombs(2)

  -- Initialize the sprites
  g.run.babySprites = Sprite()
  g.run.babySprites:Load("gfx/custom-health/bomb.anm2", true)
  g.run.babySprites:SetFrame("Default", 0)
end

-- Aban Baby
BabyAdd.functions[177] = function()
  -- Coins are hearts
  g.p:AddCoins(2)
end

-- Fang Demon Baby
BabyAdd.functions[281] = function()
  -- These items will cause a softlock, so just remove them from all pools as a quick fix
  g.itemPool:RemoveCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) -- 168
  g.itemPool:RemoveCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) -- 229
  g.itemPool:RemoveCollectible(CollectibleType.COLLECTIBLE_TECH_X) -- 395
end

-- Vomit Baby
BabyAdd.functions[341] = function()
  g.run.babyCounters = g.g:GetFrameCount() + g.babies[341].time
end

-- Cyborg Baby
BabyAdd.functions[343] = function()
  Isaac.ExecuteCommand("debug 7")
end

-- Rabbit Baby
BabyAdd.functions[350] = function()
  g.run.babyFrame = g.g:GetFrameCount() + g.babies[350].num
end

-- Yellow Princess Baby
BabyAdd.functions[375] = function()
  -- This is the third item given, so we have to handle it manually
  g.p:AddCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE, 0, false) -- 540
  Isaac.DebugString("Removing collectible " .. tostring(CollectibleType.COLLECTIBLE_FLAT_STONE)) -- 540
end

-- Imp Baby
BabyAdd.functions[386] = function()
  -- Start the direction at left
  g.run.babyCounters = ButtonAction.ACTION_SHOOTLEFT -- 4
  g.run.babyFrame = g.g:GetFrameCount() + g.babies[386].num
end

-- Dream Knight Baby
BabyAdd.functions[393] = function()
  g.p:AddCollectible(CollectibleType.COLLECTIBLE_KEY_BUM, 0, false) -- 388
end

-- Blurred Baby
BabyAdd.functions[407] = function()
  -- This is the third item given, so we have to handle it manually
  g.p:AddCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE, 0, false) -- 540
  Isaac.DebugString("Removing collectible " .. tostring(CollectibleType.COLLECTIBLE_FLAT_STONE)) -- 540
end

-- Rich Baby
BabyAdd.functions[424] = function()
  g.p:AddCoins(99)
end

-- Twitchy Baby
BabyAdd.functions[511] = function()
  -- Start with the slowest tears and mark to update them on this frame
  g.run.babyCounters = g.babies[511].max
  g.run.babyFrame = g.g:GetFrameCount()
end

return BabyAdd
