<script setup>
import { ref } from 'vue';
import { GenerateSeed, NeedsConfig, SaveConfig, Start } from '../wailsjs/go/main/App.js';
import { EventsOn } from '../wailsjs/runtime/runtime.js';

const config = ref({
		dataDir: '',
		recoveryPhrase: '',
		http: {
			address: 'localhost:9980',
			password: ''
		},
		consensus: {
			bootstrap: true,
			gatewayAddress: ':9981'
		},
		rhp2: {
			address: ':9982'
		},
		rhp3: {
			tcp: ':9983',
			websocket: ':9984'
		},
		log: {
			level: 'info'
		}
	}),
	configured = ref(false),
	errorMsg = ref(''),
	logLines = ref([]);

(async function() {
	configured.value = !(await NeedsConfig());
	console.log(configured);
})()

async function save() {
	try {
		console.log(config.value);
		await SaveConfig(config.value);
		await Start();
		configured.value = true;
	} catch (ex) {
		errorMsg.value = ex;
	}
}

async function generateSeed() {
	console.log('Generating seed...');
	config.value.recoveryPhrase = await GenerateSeed();
}

(() => {
	EventsOn('process', (e) => {
		console.log(e);
	});
	console.log('registed process event');
})()
</script>

<template>
	<div v-if="!configured" class="container">
		<input type="text" v-model="config.dataDir" placeholder="Data directory" />
		<input type="text" v-model="config.recoveryPhrase" placeholder="Recovery phrase" />
		<button @click="generateSeed">Generate Seed</button>
		<input type="text" v-model="config.http.address" placeholder="HTTP address" v-if="advanced" />
		<input type="text" v-model="config.http.password" placeholder="HTTP password" />
		<input type="text" v-model="config.consensus.gatewayAddress" placeholder="Gateway address" />
		<input type="text" v-model="config.rhp2.address" placeholder="RHP2 address" />
		<input type="text" v-model="config.rhp3.tcp" placeholder="RHP3 TCP address" />
		<input type="text" v-model="config.rhp3.websocket" placeholder="RHP3 WebSocket address" />
		<label>Log Level</label>
		<select v-model="config.log.level">
			<option value="debug">Debug</option>
			<option value="info">Info</option>
			<option value="warn">Warn</option>
			<option value="error">Error</option>
		</select>
		
		<button @click="save">Save</button>
	</div>
	<div v-else>
		<label>{{ error }}</label>
	</div>
	
</template>

<style scoped>
input[type="text"], select {
	display: block;
	margin: 0.5rem;
	padding: 0.5rem;
	width: 100%;
}
</style>
