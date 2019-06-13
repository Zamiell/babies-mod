--
-- The Babies Mod
-- by Zamiel
--

--[[

You can read more about this mod at:
https://bindingofisaacrebirth.gamepedia.com/index.php?title=User:Zamie/Co-op&profile=no

Boring Babies:
- 515 - Half Spider Baby - Starts with 3x Pretty Fly

--]]

-- Register the mod (the second argument is the API version)
local BM = RegisterMod("The Babies Mod", 1)

-- The Lua code is split up into separate files for organizational purposes
-- (file names must be in a uniquely named directory because no two mods can have the same require path)
-- (in the code, file names must be in lowercase for Linux compatibility purposes;
-- the actual files themselves can have capital letters)
local g                    = require("babies_mod/globals") -- Global variables
local NPCUpdate            = require("babies_mod/npcupdate") -- 0
local PostUpdate           = require("babies_mod/postupdate") -- 1
local PostRender           = require("babies_mod/postrender") -- 2
local UseItem              = require("babies_mod/useitem") -- 3
local UseCard              = require("babies_mod/usecard") -- 5
local FamiliarUpdate       = require("babies_mod/familiarupdate") -- 6
local FamiliarInit         = require("babies_mod/familiarinit") -- 7
local EvaluateCache        = require("babies_mod/evaluatecache") -- 8
local PostPlayerInit       = require("babies_mod/postplayerinit") -- 9
local UsePill              = require("babies_mod/usepill") -- 10
local EntityTakeDmg        = require("babies_mod/entitytakedmg") -- 11
local InputAction          = require("babies_mod/inputaction") -- 13
local PostGameStarted      = require("babies_mod/postgamestarted") -- 15
local PostNewLevel         = require("babies_mod/postnewlevel") -- 18
local PostNewRoom          = require("babies_mod/postnewroom") -- 19
local ExecuteCmd           = require("babies_mod/executecmd") -- 22
local PreUseItem           = require("babies_mod/preuseitem") -- 23
local PreEntitySpawn       = require("babies_mod/preentityspawn") -- 24
local PostNPCInit          = require("babies_mod/postnpcinit") -- 27
local PostPickupInit       = require("babies_mod/postpickupinit") -- 34
local PostPickupSelection  = require("babies_mod/postpickupselection") -- 37
local PostPickupUpdate     = require("babies_mod/postpickupupdate") -- 38
local PostTearInit         = require("babies_mod/posttearinit") -- 39
local PostTearUpdate       = require("babies_mod/posttearupdate") -- 40
local PreTearCollision     = require("babies_mod/pretearcollision") -- 42
local PostProjectileUpdate = require("babies_mod/postprojectileupdate") -- 42
local PostLaserInit        = require("babies_mod/postlaserinit") -- 47
local PostLaserUpdate      = require("babies_mod/postlaserupdate") -- 48
local PostKnifeInit        = require("babies_mod/postknifeinit") -- 50
local PostEffectInit       = require("babies_mod/posteffectinit") -- 54
local PostEffectUpdate     = require("babies_mod/posteffectupdate") -- 55
local PostBombInit         = require("babies_mod/postbombinit") -- 57
local PostBombUpdate       = require("babies_mod/postbombupdate") -- 58
local PostFireTear         = require("babies_mod/postfiretear") -- 61
local PreGetCollectible    = require("babies_mod/pregetcollectible") -- 62
local PostEntityKill       = require("babies_mod/postentitykill") -- 68
local PreRoomEntitySpawn   = require("babies_mod/preroomentityspawn") -- 71
local Debug                = require("babies_mod/debug") -- Debugging functions

-- Initiailize the "RPGlobals.run" table
g:InitRun()

-- Set a global variable so that other mods can access our scoped global variables
SinglePlayerCoopBabies = g

-- Make a copy of this object so that we can use it elsewhere
g.BM = BM -- (this is needed for saving and loading the "save.dat" file)

-- Define miscellaneous callbacks
BM:AddCallback(ModCallbacks.MC_NPC_UPDATE,             NPCUpdate.Main) -- 0
BM:AddCallback(ModCallbacks.MC_POST_UPDATE,            PostUpdate.Main) -- 1
BM:AddCallback(ModCallbacks.MC_POST_RENDER,            PostRender.Main) -- 2
BM:AddCallback(ModCallbacks.MC_FAMILIAR_UPDATE,        FamiliarUpdate.Main) -- 6
BM:AddCallback(ModCallbacks.MC_FAMILIAR_INIT,          FamiliarInit.Main) -- 7
BM:AddCallback(ModCallbacks.MC_EVALUATE_CACHE,         EvaluateCache.Main) -- 8
BM:AddCallback(ModCallbacks.MC_POST_PLAYER_INIT,       PostPlayerInit.Main) -- 9
BM:AddCallback(ModCallbacks.MC_USE_PILL,               UsePill.Main) -- 10
BM:AddCallback(ModCallbacks.MC_ENTITY_TAKE_DMG,        EntityTakeDmg.Main) -- 11
BM:AddCallback(ModCallbacks.MC_INPUT_ACTION,           InputAction.Main) -- 13
BM:AddCallback(ModCallbacks.MC_POST_GAME_STARTED,      PostGameStarted.Main) -- 15
BM:AddCallback(ModCallbacks.MC_POST_NEW_LEVEL,         PostNewLevel.Main) -- 18
BM:AddCallback(ModCallbacks.MC_POST_NEW_ROOM,          PostNewRoom.Main) -- 19
BM:AddCallback(ModCallbacks.MC_EXECUTE_CMD,            ExecuteCmd.Main) -- 22
BM:AddCallback(ModCallbacks.MC_PRE_ENTITY_SPAWN,       PreEntitySpawn.Main) -- 24
BM:AddCallback(ModCallbacks.MC_POST_NPC_INIT,          PostNPCInit.Main) -- 27
BM:AddCallback(ModCallbacks.MC_POST_PICKUP_INIT,       PostPickupInit.Main) -- 34
BM:AddCallback(ModCallbacks.MC_POST_PICKUP_SELECTION,  PostPickupSelection.Main) -- 37
BM:AddCallback(ModCallbacks.MC_POST_PICKUP_UPDATE,     PostPickupUpdate.Main) -- 38
BM:AddCallback(ModCallbacks.MC_POST_TEAR_INIT,         PostTearInit.Main) -- 39
BM:AddCallback(ModCallbacks.MC_POST_TEAR_UPDATE,       PostTearUpdate.Main) -- 40
BM:AddCallback(ModCallbacks.MC_PRE_TEAR_COLLISION,     PreTearCollision.Main) -- 42
BM:AddCallback(ModCallbacks.MC_POST_PROJECTILE_UPDATE, PostProjectileUpdate.Main) -- 44
BM:AddCallback(ModCallbacks.MC_POST_LASER_INIT,        PostLaserInit.Main) -- 47
BM:AddCallback(ModCallbacks.MC_POST_LASER_UPDATE,      PostLaserUpdate.Main) -- 48
BM:AddCallback(ModCallbacks.MC_POST_KNIFE_INIT,        PostKnifeInit.Main) -- 50
BM:AddCallback(ModCallbacks.MC_POST_EFFECT_INIT,       PostEffectInit.Main) -- 54
BM:AddCallback(ModCallbacks.MC_POST_EFFECT_UPDATE,     PostEffectUpdate.Main) -- 55
BM:AddCallback(ModCallbacks.MC_POST_BOMB_INIT,         PostBombInit.Main) -- 57
BM:AddCallback(ModCallbacks.MC_POST_BOMB_UPDATE,       PostBombUpdate.Main) -- 58
BM:AddCallback(ModCallbacks.MC_POST_FIRE_TEAR,         PostFireTear.Main) -- 61
BM:AddCallback(ModCallbacks.MC_PRE_GET_COLLECTIBLE,    PreGetCollectible.Main) -- 62
BM:AddCallback(ModCallbacks.MC_POST_ENTITY_KILL,       PostEntityKill.Main) -- 68
BM:AddCallback(ModCallbacks.MC_PRE_ROOM_ENTITY_SPAWN,  PreRoomEntitySpawn.Main) -- 71

-- Define post-use item callbacks (3)
BM:AddCallback(ModCallbacks.MC_USE_ITEM, UseItem.Main) -- 3
BM:AddCallback(ModCallbacks.MC_USE_ITEM, UseItem.Item49, -- 3
               CollectibleType.COLLECTIBLE_SHOOP_DA_WHOOP) -- 49
BM:AddCallback(ModCallbacks.MC_USE_ITEM, UseItem.Item86, -- 3
               CollectibleType.COLLECTIBLE_MONSTROS_TOOTH) -- 86
BM:AddCallback(ModCallbacks.MC_USE_ITEM, UseItem.Item282, -- 3
               CollectibleType.COLLECTIBLE_HOW_TO_JUMP) -- 282
BM:AddCallback(ModCallbacks.MC_USE_ITEM, UseItem.ClockworkAssembly, -- 3
               CollectibleType.COLLECTIBLE_CLOCKWORK_ASSEMBLY)
BM:AddCallback(ModCallbacks.MC_USE_ITEM, UseItem.FlockOfSuccubi, -- 3
               CollectibleType.COLLECTIBLE_FLOCK_OF_SUCCUBI)
BM:AddCallback(ModCallbacks.MC_USE_ITEM, UseItem.ChargingStation, -- 3
               CollectibleType.COLLECTIBLE_CHARGING_STATION)
if CollectibleType.COLLECTIBLE_DEBUG ~= nil then -- This is in the Racing+ mod
  BM:AddCallback(ModCallbacks.MC_USE_ITEM, Debug.Main, -- 3
                 CollectibleType.COLLECTIBLE_DEBUG)
end

-- Define card callbacks (5)
BM:AddCallback(ModCallbacks.MC_USE_CARD, UseCard.Card4,  Card.CARD_EMPRESS) -- 5
BM:AddCallback(ModCallbacks.MC_USE_CARD, UseCard.Card13, Card.CARD_HANGED_MAN) -- 5

-- Define pre-use item callbacks (23)
BM:AddCallback(ModCallbacks.MC_PRE_USE_ITEM, PreUseItem.Item36, -- 23
               CollectibleType.COLLECTIBLE_POOP) -- 36
BM:AddCallback(ModCallbacks.MC_PRE_USE_ITEM, PreUseItem.Item56, -- 23
               CollectibleType.COLLECTIBLE_LEMON_MISHAP) -- 56
BM:AddCallback(ModCallbacks.MC_PRE_USE_ITEM, PreUseItem.Item323, -- 23
               CollectibleType.COLLECTIBLE_ISAACS_TEARS) -- 323
BM:AddCallback(ModCallbacks.MC_PRE_USE_ITEM, PreUseItem.Item479, -- 23
               CollectibleType.COLLECTIBLE_SMELTER) -- 479
BM:AddCallback(ModCallbacks.MC_PRE_USE_ITEM, PreUseItem.Item504, -- 23
               CollectibleType.COLLECTIBLE_BROWN_NUGGET) -- 504

-- Welcome banner
local hyphens = ''
for i = 1, 31 + string.len(g.version) do
  hyphens = hyphens .. "-"
end
Isaac.DebugString("+" .. hyphens .. "+")
Isaac.DebugString("| The Babies Mod " .. tostring(g.version) .. " initialized. |")
Isaac.DebugString("+" .. hyphens .. "+")
Isaac.DebugString("Total babies: " .. tostring(#g.babies))

-- Check to see if any of the babies have a duplciate name
local nameTable = {}
for i = 1, #g.babies do
  local baby = g.babies[i]
  if nameTable[baby.name] == nil then
    nameTable[baby.name] = true
  else
    Isaac.DebugString("ERROR: Baby #" .. tostring(i) .. " has a duplicate name: " .. tostring(baby.name))
  end
end

-- Check to see if any of the babies have a duplciate item
local itemTable = {}
local trinketTable = {}
local itemExceptions = {
  CollectibleType.COLLECTIBLE_POOP, -- 36
  CollectibleType.COLLECTIBLE_MOMS_KNIFE, -- 114
  CollectibleType.COLLECTIBLE_BRIMSTONE, -- 118
  CollectibleType.COLLECTIBLE_PONY, -- 130
  CollectibleType.COLLECTIBLE_CANDLE, -- 164
  CollectibleType.COLLECTIBLE_EPIC_FETUS, -- 168
  CollectibleType.COLLECTIBLE_SACRIFICIAL_DAGGER, -- 172
  CollectibleType.COLLECTIBLE_ABEL, -- 188
  CollectibleType.COLLECTIBLE_SAD_BOMBS, -- 220
  CollectibleType.COLLECTIBLE_FIRE_MIND, -- 257
  CollectibleType.COLLECTIBLE_HOW_TO_JUMP, -- 282
  CollectibleType.COLLECTIBLE_GODHEAD, -- 331
  CollectibleType.COLLECTIBLE_THE_WIZ, -- 358
  CollectibleType.COLLECTIBLE_INCUBUS, -- 360
  CollectibleType.COLLECTIBLE_MARKED, -- 394
}
for i = 1, #g.babies do
  local baby = g.babies[i]
  if baby.item ~= nil and baby.item2 == nil then
    if itemTable[baby.item] == nil then
      itemTable[baby.item] = true
    else
      -- Make exceptions for items that are deliberately used multiple times
      local exception = false
      for j = 1, #itemExceptions do
        if baby.item == itemExceptions[j] then
          exception = true
          break
        end
      end
      if not exception then
        Isaac.DebugString("ERROR: Baby #" .. tostring(i) .. " has a duplicate item: " .. tostring(baby.item))
      end
    end
  end
  if baby.trinket ~= nil then
    if trinketTable[baby.trinket] == nil then
      trinketTable[baby.trinket] = true
    else
      Isaac.DebugString("ERROR: Baby #" .. tostring(i) .. " has a duplicate trinket.")
    end
  end
  if baby.item2 ~= nil then
    if g:GetItemConfig(baby.item2).Type == ItemType.ITEM_ACTIVE then
      Isaac.DebugString("ERROR: Baby #" .. tostring(i) .. " has an active item in the second slot.")
    end
  end
end
