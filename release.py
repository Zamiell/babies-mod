#! C:\Python34\python.exe

""" This script handles some miscellaneous tasks when releasing a new version of The Babies Mod. """

# Standard imports
import sys
import subprocess
import os
import re

# Configuration
MOD_DIR = 'C:\\Users\\james\\Documents\\My Games\\Binding of Isaac Afterbirth+ Mods\\babies_mod_dev'
os.chdir(MOD_DIR)

# Subroutines
def error(message, exception=None):
    if exception is None:
        print(message)
    else:
        print(message, exception)
    sys.exit(1)

# Increment the version in the "SPCGlobals.lua" file
# http://stackoverflow.com/questions/17140886/how-to-search-and-replace-text-in-a-file-using-python
LUA_FILE = os.path.join(MOD_DIR, 'src', 'SPCGlobals.lua')
with open(LUA_FILE, 'r') as file_handle:
    FILE_DATA = file_handle.read()

# Replace the target string
NEW_FILE = ''
VERSION_PREFIX = 'v0.1.'
NEW_VERSION = ''
for line in iter(FILE_DATA.splitlines()):
    match = re.search(r'SPCGlobals.version = "' + VERSION_PREFIX + '(\d+)"', line)
    if match:
        NEW_VERSION = str(int(match.group(1)) + 1)
        NEW_FILE += 'SPCGlobals.version = "' + VERSION_PREFIX + NEW_VERSION + '"\n'
    else:
        NEW_FILE += line + '\n'

# Write the file out again
if NEW_VERSION == '':
    print("Failed to parse the version.")
    sys.exit(1)
with open(LUA_FILE, 'w', newline='\n') as file:
    file.write(VERSION_PREFIX + NEW_VERSION)

# Also write out the version to the "version.txt" file
VERSION_FILE = os.path.join(MOD_DIR, 'version.txt')
with open(VERSION_FILE, 'w', newline='\n') as file:
    file.write(VERSION_FILE)

# Remove the "disable.it" file, if present
DISABLE_IT_PATH = os.path.join(MOD_DIR, 'disable.it')
try:
    if os.path.exists(DISABLE_IT_PATH):
        os.remove(DISABLE_IT_PATH)
except Exception as err:
    error('Failed to remove the "' + DISABLE_IT_PATH + '" file:', err)

# Commit to the client repository
RETURN_CODE = subprocess.call(['git', 'add', '-A'])
if RETURN_CODE != 0:
    error('Failed to git add.')
RETURN_CODE = subprocess.call(['git', 'commit', '-m', NEW_VERSION])
if RETURN_CODE != 0:
    error('Failed to git commit.')
RETURN_CODE = subprocess.call(['git', 'push'])
if RETURN_CODE != 0:
    error('Failed to git push.')

# Open the mod updater tool from Nicalis
UPLOADER_PATH = 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\The Binding of Isaac Rebirth\\tools\\ModUploader\\ModUploader.exe'
subprocess.Popen([UPLOADER_PATH], cwd=MOD_DIR) # Popen will run it in the background

# Done
print('Released version', NEW_VERSION, 'successfully.')
