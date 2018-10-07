local SPCInputAction = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_INPUT_ACTION (13)
function SPCInputAction:Main(entity, inputHook, buttonAction)
  -- Local variables
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Red Wrestler Baby" and -- 389
     SPCGlobals.run.babyBool and
     inputHook == InputHook.IS_ACTION_TRIGGERED and -- 1
     buttonAction == ButtonAction.ACTION_PILLCARD then -- 10

    -- Automatically use pills
    SPCGlobals.run.babyBool = false
    return true
  end
end

return SPCInputAction
