local SPCExecuteCmd = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_EXECUTE_CMD (22)
function SPCExecuteCmd:Main(cmd, params)
  Isaac.DebugString("MC_EXECUTE_CMD - " .. tostring(cmd) .. " " .. tostring(params))

  if cmd == "baby" or
     cmd == "baby2" then

    -- Check to see if this is a valid baby number
    local babyNum = tonumber(params)
    if babyNum < 0 or babyNum > #SPCGlobals.babies then
      babyNum = 0
    end

    -- Manually set the next baby
    SPCGlobals.debug = babyNum

    -- Automatically restart the game
    if cmd ~= "baby2" and
       params ~= "0" then

      Isaac.ExecuteCommand("restart")
    end

  elseif cmd == "disable" then
    SPCGlobals.debug = "disable"
    Isaac.ExecuteCommand("restart")
  end
end

return SPCExecuteCmd
