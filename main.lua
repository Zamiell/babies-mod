--
-- The Single Player Co-op Babies Mod
-- by Zamiel
--

--[[

You can read more about this mod at:
https://bindingofisaacrebirth.gamepedia.com/index.php?title=User:Zamie/Co-op&profile=no

TODO:
- n/a

Boring babies:
- *84 - Goatee Baby - Starts with Black Candle
- *375 - Yellow Princess Baby - Starts with Cracked Crown
- *444 - Steroids Baby - Starts with Growth Hormones
- 48 - Dark Baby - Starts with Dark Matter
- 51 - Belial Baby - Starts with passive The Book of Belial effect
- 62 - Goat Baby - Starts with Pentagram
- 83 - Ghoul Baby - Starts with The Mark
- 109 - Nosferatu Baby - Starts with The Pact
- 152 - Cape Baby - Starts with The Halo
- 153 - Sorrow Baby - Starts with Razor Blade
- 179 - Piece A Baby - Starts with The Gamekid
- 204 - Dented Baby - Starts with The Small Rock
- 227 - Hanger Baby - Starts with Wire Coat Hanger
- 250 - Medusa Baby - Starts with Mom's Wig
- 258 - Rocker Baby - Starts with Cancer (trinket)
- 260 - Coat Baby - Starts with The Soul
- 280 - Eye Demon Baby - Starts with Evil Eye
- 281 - Fang Demon Baby - Starts with Synthoil
- 327 - Long Beard Baby - Starts with Coupon
- 346 - Twotone Baby - Starts with Blank Card
- 350 - Rabbit Baby - Starts with Guppy's Paw
- 386 - Imp Baby - Starts with Compost
- 388 - Blue Wrestler Baby - Starts with Capricorn
- 402 - Unicorn Baby - Starts with My Little Unicorn
- 407 - Blurred Baby - Starts with Virgo
- 441 - TV Baby - Starts with Doctor's Remote

--]]

-- Register the mod (the second argument is the API version)
local SPC = RegisterMod("Single Player Co-op Babies", 1)

-- The Lua code is split up into separate files for organizational purposes
local SPCGlobals              = require("src/spcglobals") -- Global variables
local SPCPostUpdate           = require("src/spcpostupdate") -- The PostUpdate callback (1)
local SPCPostRender           = require("src/spcpostrender") -- The PostRender callback (2)
local SPCUseItem              = require("src/spcuseitem") -- The UseItem callback (3)
local SPCUseCard              = require("src/spcusecard") -- The UseCard callback (5)
local SPCFamiliarUpdate       = require("src/spcfamiliarupdate") -- The FamiliarUpdate callback (6)
local SPCFamiliarInit         = require("src/spcfamiliarinit") -- The FamiliarInit callback (7)
local SPCEvaluateCache        = require("src/spcevaluatecache") -- The EvaluateCache callback (8)
local SPCUsePill              = require("src/spcusepill") -- The UsePill callback (10)
local SPCEntityTakeDmg        = require("src/spcentitytakedmg") -- The EntityTakeDmg callback (11)
local SPCInputAction          = require("src/spcinputaction") -- The InputAction callback (13)
local SPCPostGameStarted      = require("src/spcpostgamestarted") -- The PostGameStarted callback (15)
local SPCPostNewLevel         = require("src/spcpostnewlevel") -- The PostNewLevel callback (18)
local SPCPostNewRoom          = require("src/spcpostnewroom") -- The PostNewRoom callback (19)
local SPCExecuteCmd           = require("src/spcexecutecmd") -- The ExecuteCmd callback (22)
local SPCPreUseItem           = require("src/spcpreuseitem") -- The PreUseItem callback (23)
local SPCPreEntitySpawn       = require("src/spcpreentityspawn") -- The PreEntitySpawn callback (24)
local SPCPostNPCInit          = require("src/spcpostnpcinit") -- The NPCPostInit callback (27)
local SPCPostPickupInit       = require("src/spcpostpickupinit") -- The PostPickupInit callback (34)
local SPCPostPickupSelection  = require("src/spcpostpickupselection") -- The PostPickupSelection callback (37)
local SPCPostPickupUpdate     = require("src/spcpostpickupupdate") -- The PostPickupUpdate callback (38)
local SPCPostTearUpdate       = require("src/spcposttearupdate") -- The PostTearUpdate callback (40)
local SPCPreTearCollision     = require("src/spcpretearcollision") -- The PreTearCollision callback (42)
local SPCPostProjectileUpdate = require("src/spcpostprojectileupdate") -- The PostProjectileUpdate callback (42)
local SPCPostLaserUpdate      = require("src/spcpostlaserupdate") -- The PostLaserUpdate callback (48)
local SPCPostKnifeInit        = require("src/spcpostknifeinit") -- The PostKnifeInit callback (50)
local SPCPostEffectInit       = require("src/spcposteffectinit") -- The PostEffectInit callback (54)
local SPCPostEffectUpdate     = require("src/spcposteffectupdate") -- The PostEffectUpdate callback (55)
local SPCPostBombInit         = require("src/spcpostbombinit") -- The PostBombInit callback (57)
local SPCPostBombUpdate       = require("src/spcpostbombupdate") -- The PostBombUpdate callback (58)
local SPCPostFireTear         = require("src/spcpostfiretear") -- The PostFireTear callback (61)
local SPCPostEntityKill       = require("src/spcpostentitykill") -- The PostEntityKill callback (68)
local SPCPreRoomEntitySpawn   = require("src/spcpreroomentityspawn") -- The PreRoomEntitySpawn callback (71)

-- Initiailize the "RPGlobals.run" table
SPCGlobals:InitRun()

-- Set a global variable so that other mods can access our scoped global variables
SinglePlayerCoopBabies = SPCGlobals

-- Define miscellaneous callbacks
SPC:AddCallback(ModCallbacks.MC_POST_UPDATE,            SPCPostUpdate.Main) -- 1
SPC:AddCallback(ModCallbacks.MC_POST_RENDER,            SPCPostRender.Main) -- 2
SPC:AddCallback(ModCallbacks.MC_USE_ITEM,               SPCUseItem.ClockworkAssembly, -- 3
                                                        Isaac.GetItemIdByName("Clockwork Assembly"))
SPC:AddCallback(ModCallbacks.MC_USE_ITEM,               SPCUseItem.FlockOfSuccubi, -- 3
                                                        Isaac.GetItemIdByName("Flock of Succubi"))
SPC:AddCallback(ModCallbacks.MC_USE_CARD,               SPCUseCard.Card4, -- 5
                                                        Card.CARD_EMPRESS) -- 4
SPC:AddCallback(ModCallbacks.MC_FAMILIAR_UPDATE,        SPCFamiliarUpdate.Main) -- 6
SPC:AddCallback(ModCallbacks.MC_FAMILIAR_INIT,          SPCFamiliarInit.Main) -- 7
SPC:AddCallback(ModCallbacks.MC_EVALUATE_CACHE,         SPCEvaluateCache.Main) -- 8
SPC:AddCallback(ModCallbacks.MC_USE_PILL,               SPCUsePill.Main) -- 10
SPC:AddCallback(ModCallbacks.MC_ENTITY_TAKE_DMG,        SPCEntityTakeDmg.Main) -- 11
SPC:AddCallback(ModCallbacks.MC_INPUT_ACTION,           SPCInputAction.Main) -- 13
SPC:AddCallback(ModCallbacks.MC_POST_GAME_STARTED,      SPCPostGameStarted.Main) -- 15
SPC:AddCallback(ModCallbacks.MC_POST_NEW_LEVEL,         SPCPostNewLevel.Main) -- 18
SPC:AddCallback(ModCallbacks.MC_POST_NEW_ROOM,          SPCPostNewRoom.Main) -- 19
SPC:AddCallback(ModCallbacks.MC_EXECUTE_CMD,            SPCExecuteCmd.Main) -- 22
SPC:AddCallback(ModCallbacks.MC_PRE_USE_ITEM,           SPCPreUseItem.Item36, -- 3
                                                        CollectibleType.COLLECTIBLE_POOP) -- 36
SPC:AddCallback(ModCallbacks.MC_PRE_USE_ITEM,           SPCPreUseItem.Item56, -- 3
                                                        CollectibleType.COLLECTIBLE_LEMON_MISHAP) -- 56
SPC:AddCallback(ModCallbacks.MC_PRE_USE_ITEM,           SPCPreUseItem.Item323, -- 23
                                                        CollectibleType.COLLECTIBLE_ISAACS_TEARS) -- 323
SPC:AddCallback(ModCallbacks.MC_PRE_USE_ITEM,           SPCPreUseItem.Item504, -- 23
                                                        CollectibleType.COLLECTIBLE_BROWN_NUGGET) -- 504
SPC:AddCallback(ModCallbacks.MC_PRE_ENTITY_SPAWN,       SPCPreEntitySpawn.Main) -- 24
SPC:AddCallback(ModCallbacks.MC_POST_NPC_INIT,          SPCPostNPCInit.Main) -- 27
SPC:AddCallback(ModCallbacks.MC_POST_PICKUP_INIT,       SPCPostPickupInit.Main) -- 34
SPC:AddCallback(ModCallbacks.MC_POST_PICKUP_SELECTION,  SPCPostPickupSelection.Main) -- 37
SPC:AddCallback(ModCallbacks.MC_POST_PICKUP_UPDATE,     SPCPostPickupUpdate.Main) -- 38
SPC:AddCallback(ModCallbacks.MC_POST_TEAR_UPDATE,       SPCPostTearUpdate.Main) -- 40
SPC:AddCallback(ModCallbacks.MC_PRE_TEAR_COLLISION,     SPCPreTearCollision.Main) -- 42
SPC:AddCallback(ModCallbacks.MC_POST_PROJECTILE_UPDATE, SPCPostProjectileUpdate.Main) -- 44
SPC:AddCallback(ModCallbacks.MC_POST_LASER_UPDATE,      SPCPostLaserUpdate.Main) -- 48
SPC:AddCallback(ModCallbacks.MC_POST_KNIFE_INIT,        SPCPostKnifeInit.Main) -- 50
SPC:AddCallback(ModCallbacks.MC_POST_EFFECT_INIT,       SPCPostEffectInit.Main) -- 54
SPC:AddCallback(ModCallbacks.MC_POST_EFFECT_UPDATE,     SPCPostEffectUpdate.Main) -- 55
SPC:AddCallback(ModCallbacks.MC_POST_BOMB_INIT,         SPCPostBombInit.Main) -- 57
SPC:AddCallback(ModCallbacks.MC_POST_BOMB_UPDATE,       SPCPostBombUpdate.Main) -- 58
SPC:AddCallback(ModCallbacks.MC_POST_FIRE_TEAR,         SPCPostFireTear.Main) -- 61
SPC:AddCallback(ModCallbacks.MC_POST_ENTITY_KILL,       SPCPostEntityKill.Main) -- 68
SPC:AddCallback(ModCallbacks.MC_PRE_ROOM_ENTITY_SPAWN,  SPCPreRoomEntitySpawn.Main) -- 71

-- Welcome banner
Isaac.DebugString("+---------------------------------------------+")
Isaac.DebugString("| Single Player Co-op Babies Mod initialized. |")
Isaac.DebugString("+---------------------------------------------+")
Isaac.DebugString("Total babies: " .. tostring(#SPCGlobals.babies))

-- Set a global variable so that other mods know that this mod is running
SinglePlayerCoopBabies = true -- luacheck: ignore

-- Check to see if any of the babies have a duplciate name
local nameTable = {}
for i = 1, #SPCGlobals.babies do
  local baby = SPCGlobals.babies[i]
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
  CollectibleType.COLLECTIBLE_TRANSCENDENCE, -- 20
  CollectibleType.COLLECTIBLE_POOP, -- 36
  CollectibleType.COLLECTIBLE_MOMS_KNIFE, -- 114
  CollectibleType.COLLECTIBLE_PONY, -- 130
  CollectibleType.COLLECTIBLE_CANDLE, -- 164
  CollectibleType.COLLECTIBLE_EPIC_FETUS, -- 168
  CollectibleType.COLLECTIBLE_FIRE_MIND, -- 257
  CollectibleType.COLLECTIBLE_GODHEAD, -- 331
  CollectibleType.COLLECTIBLE_INCUBUS, -- 360
  CollectibleType.COLLECTIBLE_SPEAR_OF_DESTINY, -- 400
}
for i = 1, #SPCGlobals.babies do
  local baby = SPCGlobals.babies[i]
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
      if exception == false then
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
end
