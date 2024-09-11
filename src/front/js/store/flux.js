

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			host: `https://playground.4geeks.com/contact`,
			agendas: [],
			singleAgenda: [],
			username: '',
			currentContact: {},
			hostStarWars: 'https://swapi.dev/api',
			characters: [],
			planets: [],
			starships: [],
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}, getUsername: (username) => {
				setStore({ username: username })
			},
			setCurrentContact: (contact) => { setStore({ currentContact: contact }) },
			createAgenda: async (loginData) => {
				const uri = `${getStore().host}/agendas/${getStore().username}`;
				const options = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(loginData),
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error:', error.status, error.statusText);
					return
				}

				getActions().getContacts();
			},
			getContacts: async () => {
				console.log('Este es el username en getcontacts', getStore().username);

				const uri = `${getStore().host}/agendas/${getStore().username}/contacts`;
				const options = {
					method: 'GET',
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				}

				const data = await response.json();

				setStore({ singleAgenda: data.contacts });
				console.log('estos son los contacts:', getStore().singleAgenda);

			},
			addContact: async (dataToSend) => {
				console.log('Este es el  username en add contact:', getStore().username);

				if (!getStore().username) {
					setAlertVisible(true);
					return;
				}

				const uri = `${getStore().host}/agendas/${getStore().username}/contacts`;
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(dataToSend)
				}

				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				}
				const data = await response.json();
				getActions().getContacts(getStore().username);
			},
			editContacts: async (id, dataToSend) => {

				const uri = `${getStore().host}/agendas/${getStore().username}/contacts/${id}`;
				const options = {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(dataToSend),
				};
				const response = await fetch(uri, options);
				if (!options.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				}
				getActions().setCurrentContact({});
				getActions().getContacts();

			},
			deleteContact: async (id) => {
				const uri = `${getStore().host}/agendas/${getStore().username}/contacts/${id}`;
				const options = {
					method: 'DELETE',
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				};
				getActions().getContacts();
			},
			getCharacters: async () => {
				const uri = `${getStore().hostStarWars}/people`
				console.log('URI:', uri);
				const options = {
					method: 'GET',
				}

				const response = await fetch(uri, options);

				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				}

				const data = await response.json();
				console.log('este es el data:', data);
				setStore({ characters: data.results });
			},
			getPlanets: async () => {
				const uri = `${getStore().hostStarWars}/planets`
				console.log('URI:', uri);
				const options = {
					method: 'GET',
				}

				const response = await fetch(uri, options);

				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				}

				const data = await response.json();
				console.log('este es el data:', data);
				setStore({ planets: data.results });
			},
			getStarships: async () => {
				const uri = `${getStore().hostStarWars}/starships`
				console.log('URI:', uri);
				const options = {
					method: 'GET',
				}

				const response = await fetch(uri, options);

				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				}

				const data = await response.json();
				console.log('este es el data:', data);
				setStore({ starships: data.results });
			},
		}
	};
};

export default getState;
