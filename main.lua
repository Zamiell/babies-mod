--
-- The Single Player Co-op Babies Mod
-- by Zamiel
--

--[[

You can read more about this mod at:
https://bindingofisaacrebirth.gamepedia.com/index.php?title=User:Zamie/Co-op&profile=no

TODO:
- trapdoor animation
- lighttravel animation
- do 8 tears thing and then remove the luck code

--]]

-- Register the mod (the second argument is the API version)
local SPC = RegisterMod("Single Player Co-op Babies", 1)

-- The Lua code is split up into separate files for organizational purposes
local SPCGlobals         = require("src/spcglobals") -- Global variables
local SPCPostUpdate      = require("src/spcpostupdate") -- The PostUpdate callback (1)
local SPCPostRender      = require("src/spcpostrender") -- The PostRender callback (2)
--local SPCUseItem         = require("src/spcuseitem") -- The UseItem callback (3)
local SPCEvaluateCache   = require("src/spcevaluatecache") -- The EvaluateCache callback (8)
local SPCEntityTakeDmg   = require("src/spcentitytakedmg") -- The EntityTakeDmg callback (11)
local SPCPostGameStarted = require("src/spcpostgamestarted") -- The PostGameStarted callback (15)
local SPCPostNewLevel    = require("src/spcpostnewlevel") -- The PostNewLevel callback (18)
local SPCPostNewRoom     = require("src/spcpostnewroom") -- The PostNewRoom callback (19)
local SPCExecuteCmd      = require("src/spcexecutecmd") -- The ExecuteCmd callback (22)
local SPCPreUseItem      = require("src/spcpreuseitem") -- The PreUseItem callback (23)
local SPCPostFireTear    = require("src/spcpostfiretear") -- The PostFireTear callback (61)

-- Initiailize the "RPGlobals.run" table
SPCGlobals:InitRun()

-- Define miscellaneous callbacks
SPC:AddCallback(ModCallbacks.MC_POST_UPDATE,       SPCPostUpdate.Main) -- 1
SPC:AddCallback(ModCallbacks.MC_POST_RENDER,       SPCPostRender.Main) -- 2
--[[
SPC:AddCallback(ModCallbacks.MC_USE_ITEM,          SPCUseItem.Item323, -- 3
                                                   CollectibleType.COLLECTIBLE_ISAACS_TEARS) -- 323
--]]
SPC:AddCallback(ModCallbacks.MC_EVALUATE_CACHE,    SPCEvaluateCache.Main) -- 8
SPC:AddCallback(ModCallbacks.MC_ENTITY_TAKE_DMG,   SPCEntityTakeDmg.Main) -- 11
SPC:AddCallback(ModCallbacks.MC_POST_GAME_STARTED, SPCPostGameStarted.Main) -- 15
SPC:AddCallback(ModCallbacks.MC_POST_NEW_LEVEL,    SPCPostNewLevel.Main) -- 18
SPC:AddCallback(ModCallbacks.MC_POST_NEW_ROOM,     SPCPostNewRoom.Main) -- 19
SPC:AddCallback(ModCallbacks.MC_EXECUTE_CMD,       SPCExecuteCmd.Main) -- 22
SPC:AddCallback(ModCallbacks.MC_PRE_USE_ITEM,      SPCPreUseItem.Item323, -- 23
                                                   CollectibleType.COLLECTIBLE_ISAACS_TEARS) -- 323
SPC:AddCallback(ModCallbacks.MC_POST_FIRE_TEAR,    SPCPostFireTear.Main) -- 61

-- Welcome banner
Isaac.DebugString("+---------------------------------------------+")
Isaac.DebugString("| Single Player Co-op Babies Mod initialized. |")
Isaac.DebugString("+---------------------------------------------+")

-- Check to see if any of the babies have a duplciate item
local itemTable = {}
local trinketTable = {}
local itemExceptions = {
  CollectibleType.COLLECTIBLE_TRANSCENDENCE, -- 20
  CollectibleType.COLLECTIBLE_RUBBER_CEMENT, -- 221
  CollectibleType.COLLECTIBLE_FIRE_MIND, -- 257
  CollectibleType.COLLECTIBLE_GODHEAD, -- 331
  CollectibleType.COLLECTIBLE_INCUBUS, -- 360
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
