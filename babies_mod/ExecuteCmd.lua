local ExecuteCmd = {}

-- Includes
local g = require("babies_mod/globals")

-- ModCallbacks.MC_EXECUTE_CMD (22)
function ExecuteCmd:Main(cmd, params)
  Isaac.DebugString("MC_EXECUTE_CMD - " .. tostring(cmd) .. " " .. tostring(params))

  if cmd == "baby" or
     cmd == "baby2" then

    -- Check to see if this is a valid baby number
    local babyNum = tonumber(params)
    if babyNum < 0 or babyNum > #g.babies then
      babyNum = 0
    end

    -- Manually set the next baby
    g.debug = babyNum

    -- Automatically restart the game
    if cmd ~= "baby2" and
       params ~= "0" then

      Isaac.ExecuteCommand("restart")
    end

  elseif cmd == "disable" then
    g.debug = "disable"
    Isaac.ExecuteCommand("restart")
  end
end

return ExecuteCmd
