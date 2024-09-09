
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
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
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
			},getUsername: (username) => {
				setStore({username: username})
			},
			createAgenda: async (loginData) => {
				const uri = `${getStore().host}/agendas/${getStore().username}`;
				const options = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(loginData),
				}
				const response = await fetch(uri, options);
				if(!response.ok) {
					console.log('Error:', error.status, error.statusText);
					return
				}

				getActions().getContacts();
			},
			getAgendas: async () => {
				const uri = `${getStore().host}/agendas`;
				const options = {
					method: 'GET'
				};
				const response = await fetch (uri, options);
				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				}

				const data = await response.json();
				console.log('data:', data);
				
				setStore({agendas: data.results}) //ver que tipo de data devuelve
			},
			getContacts: async () => {
				console.log('Este es el username', getStore().username);
				
				const uri = `${getStore().host}/agendas/${getStore().username}/contacts`;
				const options = {
					method: 'GET',
				};
				const response = await fetch (uri, options);
				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				}

				const data = await response.json();

				setStore({singleAgenda: data.contacts});
			},
			AddContact: async (dataToSend) => {
				console.log('Este es el  username:', getStore().username);
				
				const uri = `${getStore().host}/agendas/${getStore().username}/contacts`;
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(dataToSend)
				}
				const response = await fetch (uri, options);
				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				}
				const data =  await response.json();
				getActions().getContacts();
			},
			editContact: async (id, dataToSend) => {
				const uri = `${getStore().host}/${username}/contacts/${id}`;
				const options = {
					method: 'PUT',
					headers: {
						'Content-Type' : 'application/json',
					},
					body: JSON.stringify(dataToSend),
				};
				const response = await fetch (uri,options);
				if(!options.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				}

				getActions().getContacts();
			},
			deleteContact: async () => {
				const uri = `${getStore().host}/agendas/${username}/contacts/${id}`;
				const options = {
					method: 'DELETE',
				};
				const response = await fetch (uri, options);
				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				};
				getActions().getContacts();
			},
		}
	};
};

export default getState;
