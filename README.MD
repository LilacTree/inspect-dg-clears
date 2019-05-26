# inspect-dg-clears
TERA-proxy module for TERA Online that prints out a list of how many dungeon clears a player has when you inspect them or when they apply to your LFG group.

## Commands
List of in-game commands (use in /proxy or /8 channel):  
- `inspect` - Toggles module (default: true)
- `inspect notice` - Toggles notice (default: true)
- `inspect lfg` - Toggles auto-inspecting when someone applies to your LFG group (default: true)
- `inspect mg` - Toggles auto-opening Moongourd history in your default browser along with the list of dungeon clears (default: false)

## Installation
- Type `npm install open` in the command prompt for auto-opening Moongourd history to work properly

## Notes
- Modify the config file to customize settings
- Modify the dungeons file to customize which dungeons to show in the list of dungeon clears