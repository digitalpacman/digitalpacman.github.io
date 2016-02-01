(function() {
	AppViewModel.loadCompressedEncounter = function(compressedEncounter) {
		console.log(compressedEncounter)
		var encounterData = uncompressEncounter(compressedEncounter);
		console.log(encounterData);
		var npcs = parseEncounterData(encounterData);
		console.log(npcs)
		loadNpcs(npcs);
	};

	AppViewModel.uncompressEncounter = function(compressedEncounter) {
		var data = LZString.decompressFromBase64(compressedEncounter).split(',');

		for (var i = 0; i < data.length; i++) {
			if (!isNaN(data[i])) data[i] = parseInt(data[i]);
			if (data[i] == "true" || data[i] == "false") data[i] = data[i] == "true";
		}

		return data;
	};



	AppViewModel.parseEncounterData = function(data) {
		var npcs = [];
		for (var i = 0; i+10 < data.length; ) {
			var npc = {};
			npc.name = data[i++];

			npc.attributes = {};
			npc.attributes.body = data[i++];
			npc.attributes.agility = data[i++];
			npc.attributes.reaction = data[i++];
			npc.attributes.strength = data[i++];
			npc.attributes.willpower = data[i++];
			npc.attributes.logic = data[i++];
			npc.attributes.intuition = data[i++];
			npc.attributes.charisma = data[i++];
			npc.attributes.edge = data[i++];
			npc.attributes.magic = data[i++];
			npc.attributes.essence = data[i++];

			npc.armor = data[i++];

			npc.skills = {};
			npc.skills.pistols = data[i++];
			npc.skills.automatics = data[i++];
			npc.skills.longArms = data[i++];
			npc.skills.blades = data[i++];
			npc.skills.unarmed = data[i++];

			npc.initiative = {};
			npc.initiative.bonusDice = data[i++];
			npc.initiative.mode = data[i++];
			npc.initiative.rolledScore = data[i++];

			npc.dataProcessing = data[i++];
			npc.firewall = data[i++];

			npc.isActive = data[i++];
			npc.hasActed = data[i++];
			npc.isPC = data[i++];
			npc.edging = data[i++];
			npc.edgePoints = data[i++];
			npc.useStun = data[i++];
			npc.miscDefenseMod = data[i++];
			npc.previouslyDefendedAttacks = data[i++];
			npc.resistanceMiscModifier = data[i++];
			npc.resistanceMiscModifier = data[i++];
			npc.progressiveRecoil = data[i++];
			npc.miscMatrixDefense = data[i++];
			npc.sustains = data[i++];

			var c = data[i++];
			npc.guns = [];
			for (var x = 0; x < c; x++) {
				npc.guns[x] = {};
				npc.guns[x].name = data[i++];
				npc.guns[x].accuracy = data[i++];
				npc.guns[x].damage = data[i++];
				npc.guns[x].damageType = data[i++];
				npc.guns[x].armorPenetration = data[i++];
				npc.guns[x].fireModes = data[i++];
				npc.guns[x].recoilCompensation = data[i++];
				npc.guns[x].maxAmmo = data[i++];
				npc.guns[x].linkedSkill = data[i++];
				npc.guns[x].usedAmmo = data[i++];
				npc.guns[x].miscModifier = data[i++];
			}

			var c = data[i++];
			npc.meleeWeapons = [];
			for (var x = 0; x < c; x++) {
				npc.meleeWeapons[x] = {};
				npc.meleeWeapons[x].name = data[i++];
				npc.meleeWeapons[x].accuracy = data[i++];
				npc.meleeWeapons[x].reach = data[i++];
				npc.meleeWeapons[x].damage = data[i++];
				npc.meleeWeapons[x].damageType = data[i++];
				npc.meleeWeapons[x].armorPenetration = data[i++];
				npc.meleeWeapons[x].linkedSkill = data[i++];
				npc.meleeWeapons[x].miscModifier = data[i++];
			}
			npcs.push(npc);
		}
		return npcs;
	};

	AppViewModel.loadNpcs = function(npcs) {
		var npcsVM = [];
		for (var n in npcs) {
			var npc = npcs[n];

			var npcVM = new Npc(npc.name, npc.attributes, npc.armor, npc.skills, [], npc.initiative.bonusDice, npc.dataProcessing, npc.firewall, []);
			npcVM.isActive(npc.isActive);
			npcVM.hasActed(npc.hasActed);
			npcVM.isPC = npc.isPC;
			npcVM.edging(npc.edging);
			npcVM.edgePoints(npc.edgePoints);
			npcVM.useStun(npc.useStun);
			npcVM.miscDefenseMod(npc.miscDefenseMod);
			npcVM.previouslyDefendedAttacks(npc.previouslyDefendedAttacks);
			npcVM.resistanceMiscModifier(npc.resistanceMiscModifier);
			npcVM.resistanceMiscModifier(npc.resistanceMiscModifier);
			npcVM.progressiveRecoil(npc.progressiveRecoil);
			npcVM.miscMatrixDefense(npc.miscMatrixDefense);

			npcVM.initiative.mode(npc.initiative.mode);
			npcVM.initiative.rolledScore(npc.initiative.rolledScore);

			for (var g in npc.guns) {
				var gun = npc.guns[g];

				var gunVM = new Gun(gun.name, gun.accuracy, gun.damage, gun.damageType, gun.armorPenetration, gun.fireModes, gun.recoilCompensation, gun.maxAmmo, gun.linkedSkill);
				gunVM.usedAmmo(gun.usedAmmo);
				gunVM.miscModifier(gun.miscModifier);

				npcVM.addGun(gunVM);
			}

			for (var w in npc.meleeWeapons) {
				var weapon = npc.meleeWeapons[w];

				var weaponVM = new MeleeWeapon(weapon.name, weapon.accuracy, weapon.reach, weapon.damage, weapon.damageType, weapon.armorPenetration, weapon.linkedSkill);
				weaponVM.miscModifier(weapon.miscModifier);

				npcVM.addMeleeWeapon(weaponVM);
			}

			npcsVM.push(npcVM);
		}
		AppViewModel.npcs(npcsVM);
	};

	AppViewModel.loadEncounter = function() {
		if (!self.selectedEncounter()) return;

		var compressedEncounter = self.selectedEncounter().value;
		self.loadCompressedEncounter(compressedEncounter);
	};

	

	AppViewModel.saveEncounter = function(vm) {
		var o = ko.toJS(vm);
		var s = "";
		var p = function(d) {
			s+=d+',';
		}
		for (var n in o.npcs) {
			var x = o.npcs[n];
			p(x.name);

			p(x.attributes.body);
			p(x.attributes.agility);
			p(x.attributes.reaction);
			p(x.attributes.strength);
			p(x.attributes.willpower);
			p(x.attributes.logic);
			p(x.attributes.intuition);
			p(x.attributes.charisma);
			p(x.attributes.edge);
			p(x.attributes.magic);
			p(x.attributes.essence);

			p(x.armor);

			p(x.skills.pistols);
			p(x.skills.automatics);
			p(x.skills.longArms);
			p(x.skills.blades);
			p(x.skills.unarmed);

			p(x.initiative.bonusDice);
			p(x.initiative.mode);
			p(x.initiative.rolledScore);

			p(x.dataProcessing);
			p(x.firewall);

			p(x.isActive);
			p(x.hasActed);
			p(x.isPC)
			p(x.edging);
			p(x.edgePoints);
			p(x.useStun);
			p(x.miscDefenseMod);
			p(x.previouslyDefendedAttacks);
			p(x.resistanceMiscModifier);
			p(x.resistanceMiscModifier);
			p(x.progressiveRecoil);
			p(x.miscMatrixDefense);
			p(x.sustains);

			p(x.guns.length);
			for (var g in x.guns) {
				var y = x.guns[g];
				p(y.name);
				p(y.accuracy);
				p(y.damage);
				p(y.damageType);
				p(y.armorPenetration);
				p(y.fireModes);
				p(y.recoilCompensation);
				p(y.maxAmmo);
				p(y.linkedSkill);
				p(y.usedAmmo);
				p(y.miscModifier);

			}

			p(x.meleeWeapons.length);
			for (var g in x.meleeWeapons) {
				var y = x.meleeWeapons[g];
				p(y.name);
				p(y.accuracy);
				p(y.reach);
				p(y.damage);
				p(y.damageType);
				p(y.armorPenetration);
				p(y.linkedSkill);
				p(y.miscModifier);
			}
		}

		console.log(s);
		var cs = LZString.compressToBase64(s);
		console.log(cs);
		console.log(cs.length);

		var encounters = JSON.parse(localStorage.getItem('encounters'));
		if (!encounters) encounters = {};
		encounters[self.newEncounterName()] = cs;
		localStorage.setItem('encounters', JSON.stringify(encounters));
		self.savedEncounters.push({name: self.newEncounterName(), value: cs});
		location.href = '#' + cs;
	};
})();