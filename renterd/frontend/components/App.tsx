import { useEffect, useState } from 'react'
import {
  GenerateSeed,
  LoadConfig,
  SaveConfig,
  Start,
} from '../wailsjs/go/main/App.js'
import { EventsOn } from '../wailsjs/runtime/runtime.js'

// const config = ref({
// 		dataDir: '',
// 		recoveryPhrase: '',
// 		http: {
// 			address: 'localhost:9980',
// 			password: ''
// 		},
// 		consensus: {
// 			bootstrap: true,
// 			gatewayAddress: ':9981'
// 		},
// 		rhp2: {
// 			address: ':9982'
// 		},
// 		rhp3: {
// 			tcp: ':9983',
// 			websocket: ':9984'
// 		},
// 		log: {
// 			level: 'info'
// 		}
// 	}),
// 	configured = ref(false),
// 	errorMsg = ref(''),
// 	logLines = ref([]);

// async function save() {
// 	try {
// 		console.log(config.value);
// 		await SaveConfig(config.value);
// 		await Start();
// 		configured.value = true;
// 	} catch (ex) {
// 		errorMsg.value = ex;
// 	}
// }

// async function generateSeed() {
// 	console.log('Generating seed...');
// 	config.value.recoveryPhrase = await GenerateSeed();
// }

// (() => {
// 	EventsOn('process', (e) => {
// 		console.log(e);
// 	});
// 	console.log('registed process event');
// })()

export function App() {
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    const checkIfConfigured = async () => {
      setIsConfigured(await LoadConfig())
    }
    checkIfConfigured()
  }, [])

  if (isConfigured) {
    return (
      <div>
        <label>all set</label>
      </div>
    )
  }

  return (
    <div className="container">
      <input type="text" placeholder="Data directory" />
      <input type="text" placeholder="Recovery phrase" />
      <button onClick={async () => alert(await GenerateSeed())}>
        Generate Seed
      </button>
      <input type="text" placeholder="HTTP address" />
      <input type="text" placeholder="HTTP password" />
      <input type="text" placeholder="Gateway address" />
      <input type="text" placeholder="RHP2 address" />
      <input type="text" placeholder="RHP3 TCP address" />
      <input type="text" placeholder="RHP3 WebSocket address" />
      <label>Log Level</label>
      <select>
        <option value="debug">Debug</option>
        <option value="info">Info</option>
        <option value="warn">Warn</option>
        <option value="error">Error</option>
      </select>
      <button onClick={() => alert('save')}>Save</button>
    </div>
  )
}
