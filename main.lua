--
-- The Single Player Co-op Babies Mod
-- by Zamiel
--

--[[

You can read more about this mod at:
https://bindingofisaacrebirth.gamepedia.com/index.php?title=User:Zamie/Co-op&profile=no

TODO:
- spawn item on ground if you pick up a different active during floor and item is returned
- X tears that split after frame Y
- fix bomb extra damage bug on blindfolded chars that have damage increased
- mute sound effect from getting pretty fly
- bug with polaroid shield not appearing
- give doorstop to a baby
- bug where dropping active item on ground is multiple
- make fairies move really fast, give multiple fairies - Pixie Baby
--]]

-- Register the mod (the second argument is the API version)
local SPC = RegisterMod("Single Player Co-op Babies", 1)

-- The Lua code is split up into separate files for organizational purposes
local SPCGlobals             = require("src/spcglobals") -- Global variables
local SPCPostUpdate          = require("src/spcpostupdate") -- The PostUpdate callback (1)
local SPCPostRender          = require("src/spcpostrender") -- The PostRender callback (2)
local SPCUseItem             = require("src/spcuseitem") -- The UseItem callback (3)
local SPCEvaluateCache       = require("src/spcevaluatecache") -- The EvaluateCache callback (8)
local SPCEntityTakeDmg       = require("src/spcentitytakedmg") -- The EntityTakeDmg callback (11)
local SPCPostGameStarted     = require("src/spcpostgamestarted") -- The PostGameStarted callback (15)
local SPCPostNewLevel        = require("src/spcpostnewlevel") -- The PostNewLevel callback (18)
local SPCPostNewRoom         = require("src/spcpostnewroom") -- The PostNewRoom callback (19)
local SPCExecuteCmd          = require("src/spcexecutecmd") -- The ExecuteCmd callback (22)
local SPCPreUseItem          = require("src/spcpreuseitem") -- The PreUseItem callback (23)
local SPCPreEntitySpawn      = require("src/spcpreentityspawn") -- The PreEntitySpawn callback (24)
local SPCPostNPCInit         = require("src/spcpostnpcinit") -- The NPCPostInit callback (27)
local SPCPostPickupSelection = require("src/spcpostpickupselection") -- The PostPickupSelection callback (37)
local SPCPostTearUpdate      = require("src/spcposttearupdate") -- The PostTearUpdate callback (40)
local SPCPostFireTear        = require("src/spcpostfiretear") -- The PostFireTear callback (61)
local SPCPostEntityKill      = require("src/spcpostentitykill") -- The PostEntityKill callback (68)

-- Initiailize the "RPGlobals.run" table
SPCGlobals:InitRun()

-- Set a global variable so that other mods can access our scoped global variables
SinglePlayerCoopBabies = SPCGlobals

-- Define miscellaneous callbacks
SPC:AddCallback(ModCallbacks.MC_POST_UPDATE,           SPCPostUpdate.Main) -- 1
SPC:AddCallback(ModCallbacks.MC_POST_RENDER,           SPCPostRender.Main) -- 2
SPC:AddCallback(ModCallbacks.MC_USE_ITEM,              SPCUseItem.ClockworkAssembly, -- 3
                                                       Isaac.GetItemIdByName("Clockwork Assembly"))
SPC:AddCallback(ModCallbacks.MC_EVALUATE_CACHE,        SPCEvaluateCache.Main) -- 8
SPC:AddCallback(ModCallbacks.MC_ENTITY_TAKE_DMG,       SPCEntityTakeDmg.Main) -- 11
SPC:AddCallback(ModCallbacks.MC_POST_GAME_STARTED,     SPCPostGameStarted.Main) -- 15
SPC:AddCallback(ModCallbacks.MC_POST_NEW_LEVEL,        SPCPostNewLevel.Main) -- 18
SPC:AddCallback(ModCallbacks.MC_POST_NEW_ROOM,         SPCPostNewRoom.Main) -- 19
SPC:AddCallback(ModCallbacks.MC_EXECUTE_CMD,           SPCExecuteCmd.Main) -- 22
SPC:AddCallback(ModCallbacks.MC_PRE_USE_ITEM,          SPCPreUseItem.Item323, -- 23
                                                       CollectibleType.COLLECTIBLE_ISAACS_TEARS) -- 323
SPC:AddCallback(ModCallbacks.MC_PRE_ENTITY_SPAWN,      SPCPreEntitySpawn.Main) -- 24
SPC:AddCallback(ModCallbacks.MC_POST_NPC_INIT,         SPCPostNPCInit.Main) -- 27
SPC:AddCallback(ModCallbacks.MC_POST_PICKUP_SELECTION, SPCPostPickupSelection.Main) -- 37
SPC:AddCallback(ModCallbacks.MC_POST_TEAR_UPDATE,      SPCPostTearUpdate.Main) -- 40
SPC:AddCallback(ModCallbacks.MC_POST_FIRE_TEAR,        SPCPostFireTear.Main) -- 61
SPC:AddCallback(ModCallbacks.MC_POST_ENTITY_KILL,      SPCPostEntityKill.Main) -- 68

-- Welcome banner
Isaac.DebugString("+---------------------------------------------+")
Isaac.DebugString("| Single Player Co-op Babies Mod initialized. |")
Isaac.DebugString("+---------------------------------------------+")

-- Set a global variable so that other mods know that this mod is running
SinglePlayerCoopBabies = true -- luacheck: ignore

-- Check to see if any of the babies have a duplciate item
local itemTable = {}
local trinketTable = {}
local itemExceptions = {
  CollectibleType.COLLECTIBLE_TRANSCENDENCE, -- 20
  CollectibleType.COLLECTIBLE_PONY, -- 130
  CollectibleType.COLLECTIBLE_CANDLE, -- 164
  CollectibleType.COLLECTIBLE_RUBBER_CEMENT, -- 221
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
