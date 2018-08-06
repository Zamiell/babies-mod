local SPCExecuteCmd = {}

--
-- Includes
--

local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_EXECUTE_CMD (22)
function SPCExecuteCmd:Main(cmd, params)
  Isaac.DebugString("MC_EXECUTE_CMD - " .. tostring(cmd) .. " " .. tostring(params))

  if cmd == "baby" then
    SPCGlobals.debug = tonumber(params)
    Isaac.DebugString("Set debug baby to: " .. params)
  end
end

return SPCExecuteCmd
