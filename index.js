module.exports = function InspectDGClears(mod) {
	const command = mod.command;
	const opn = require('opn');
	const config = require('./config.json');
	const dungeons = require('./dungeons');
	
	let	enabled = true,
		notice = true,
		lfg = true,
		mg = false;
		
	let	configError1 = false,
		configError2 = false;
		
	let	myPlayerId = null,
		targetName = null;
		
	command.add('inspect', {
		$none() {
			enabled = !enabled;
			command.message(`Inspect DG Clears Module is now: ${enabled ? "enabled" : "disabled"}.`);
		},
		$default() {
			command.message("Invalid command! See README for the list of valid commands.")
		},
		lfg() {
			lfg = !lfg;
			command.message(`LFG inspecting is now: ${lfg ? "enabled" : "disabled"}.`);
		},
		mg() {
			mg = !mg;
			command.message(`Moongourd inspecting is now: ${mg ? "enabled" : "disabled"}.`);
		}
	});
	
	mod.hook('S_LOGIN', 13, (event) => {
		loadConfig();
		myPlayerId = event.playerId;
		targetName = null;
	});
	
	mod.hook('S_LOAD_CLIENT_USER_SETTING', 'raw', () => {
		if (!enabled) return;
		
		process.nextTick(() => {
			if (configError1) {
				command.message('<font color="#FF0000">Error</font>: Detected corrupted/outdated config file - Please update');
			}
			else if (configError2) {
				command.message('<font color="#FF0000">Error</font>: Unable to load the config file - Using default values for now');
			}
		});
	});
	
	mod.hook('S_USER_PAPERDOLL_INFO', 8, (event) => {
		if (!enabled) return;
		
		targetName = event.name;
	});
	
	mod.hook('S_DUNGEON_CLEAR_COUNT_LIST', 1, (event) => {
		if (!enabled || myPlayerId === event.pid) return;
		
		if (mg) {
			let url = 'https://moongourd.com/results?player=' + targetName + '&area=1&boss=1&sort=timedesc';
			opn(url);
		}
		
		if (notice) {
			command.message('Inspected <font color="#00FFFF">' + targetName + '</font> (see console)');
		}
        console.log('[Inspect DG Clears] ' + targetName + '\'s Dungeon Clears:');
		for (let i = 0; i < event.dungeons.length; i++) {
			if (dungeons[event.dungeons[i].id]) {
				console.log('\t' + dungeons[event.dungeons[i].id] + '\t' + event.dungeons[i].clears);
			}
		}
	});
	
	mod.hook('S_OTHER_USER_APPLY_PARTY', 1, (event) => {
		if (!enabled || !lfg) return;
		
		setTimeout(()=>{ mod.toServer('C_REQUEST_USER_PAPERDOLL_INFO', 1, { name: event.name }); }, 250);
	});
	
	function loadConfig() {
		if (config) {
			({enabled, notice, mg} = config);
			if (typeof enabled === 'undefined') {
				enabled = true;
				configError1 = true;
			}
			if (typeof notice === 'undefined') {
				notice = true;
				configError1 = true;
			}
			if (typeof lfg === 'undefined') {
				lfg = true;
				configError1 = true;
			}
			if (typeof mg === 'undefined') {
				mg = false;
				configError1 = true;
			}
		}
		else {
			configError2 = true;
		}
	}
}