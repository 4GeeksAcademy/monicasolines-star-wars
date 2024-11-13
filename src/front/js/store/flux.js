

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
			user: '',
			currentContact: {},
			hostStarWars: 'https://swapi.tech/api',
			characters: [],
			planets: [],
			starships: [],
			characterDetails: {},
			planetDetails: {},
			starshipDetails: {},
			favorites: [],
			isLogged: false,
			alert: {
				text: 'A simple primary alert—check it out!',
				background: 'danger',
				visible: false
			},
			alerta: {
				text: 'A simple primary alert—check it out!',
				background: 'danger',
				visible: false
			},
			posts: [],
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			login: async (dataToSend, navigate) => {
				const uri = `${process.env.BACKEND_URL}/api/login`;
				const options = {
					method: 'POST',
					headers: {
						"Content-Type": 'application/json'
					},
					body: JSON.stringify(dataToSend)
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
					setStore({
						alerta: {
							text: "Error de email o password",
							background: 'danger',
							visible: true
						},
					})
					return
					console.log('Error', response.status, response.statusText);
					return;
				}
				const data = await response.json()
				console.log('estos es data results', data.results)

				localStorage.setItem('token', data.access_token)
				console.log('estos es el  data', data)
				localStorage.setItem('user', JSON.stringify(data.results))
				setStore({ isLogged: true, user: data.results.email })
				console.log('estos es user', getStore().user)
				let username = getStore().user.split("@")[0];
				setStore({username: username})
				localStorage.setItem('username', username)
				if (! username) {
					getActions().createAgenda();
				} else {
					getActions().getContacts();
				}
				navigate("/dashboard");
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
			},
			getUsername: () => {
				const storedUsername = localStorage.getItem('username');
				if (storedUsername) {
					try {
						const localUsername = localStorage.getItem('username')
						setStore({ username: localUsername })
					} catch (error) {
						console.error('Error al analizar el nombre de usuario almacenado:', error);
						setStore({ username: '' });
					}
					return
				}
			},
			addFavorite: (newFavorite) => {
				// setStore({ favorites: [...getStore().favorites, newFavorite] })
				getStore().favorites.some(fav => fav.name === newFavorite.name && fav.type === newFavorite.type)
					?
					alert('Este elemento ya esta en tus favoritos!')
					:
					setStore({ favorites: [...getStore().favorites, newFavorite] })
			},
			removeFavorite: (item) => {
				/* const newFavorite = getStore().favorites.filter((element) => element !== item);
				setStore({ favorites: newFavorite }); */
				// para que este todo en una linea se puede hacer como abajo:
				setStore({ favorites: getStore().favorites.filter((element) => element !== item) })
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
				// console.log('Este es el username en getcontacts', getStore().username);

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
				// console.log('Este es el  username en add contact:', getStore().username);

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
				if (!response.ok) {
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
				// console.log('URI:', uri);
				const options = {
					method: 'GET',
				}

				const response = await fetch(uri, options);

				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				}

				const data = await response.json();
				// console.log('este es el data:', data);
				setStore({ characters: data.results });
				localStorage.setItem('characters', JSON.stringify(data.results))
			},
			getPlanets: async () => {
				const uri = `${getStore().hostStarWars}/planets`
				// console.log('URI:', uri);
				const options = {
					method: 'GET',
				}

				const response = await fetch(uri, options);

				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				}

				const data = await response.json();
				// console.log('este es el data:', data);
				setStore({ planets: data.results });
				localStorage.setItem('planets', JSON.stringify(data.results));
			},
			getStarships: async () => {
				const uri = `${getStore().hostStarWars}/starships`
				// console.log('URI:', uri);
				const options = {
					method: 'GET',
				}

				const response = await fetch(uri, options);

				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				}

				const data = await response.json();
				// console.log('este es el data de starships:', data);
				setStore({ starships: data.results });
				localStorage.setItem('starships', JSON.stringify(data.results));
			},
			getCharactersDetails: async (id) => {
				// console.log('flux', id);

				setStore({ characterDetails: {} });

				const uri = `${getStore().hostStarWars}/people/${id}`
				const options = {
					method: 'GET',
				}

				const response = await fetch(uri, options);

				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				}

				const data = await response.json();
				// console.log('este es el data de details:', data);
				setStore({ characterDetails: data.result.properties })
			},
			getPlanetsDetails: async (id) => {
				setStore({ planetDetails: {} });
				const uri = `${getStore().hostStarWars}/planets/${id}`
				// console.log('URI:', uri);
				const options = {
					method: 'GET',
				}

				const response = await fetch(uri, options);

				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				}

				const data = await response.json();
				// console.log('este es el data de details planets:', data);
				setStore({ planetDetails: data.result.properties });
				/* localStorage.setItem('planetsDetails:', JSON.stringify(data.results)); */
			},
			getStarshipsDetails: async (id) => {
				setStore({ starshipDetails: {} });
				const uri = `${getStore().hostStarWars}/starships/${id}`
				// console.log('URI:', uri);
				const options = {
					method: 'GET',
				}

				const response = await fetch(uri, options);

				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				}

				const data = await response.json();
				// console.log('este es el data de details starships:', data);
				setStore({ starshipDetails: data.result.properties });
				/* localStorage.setItem('planetsDetails:', JSON.stringify(data.results)); */
			},
			logout: () => {
				setStore({ isLogged: false, user: '' });
				localStorage.removeItem('token')
				localStorage.removeItem('user')
				setStore({ username: '' });
				localStorage.removeItem('username');
			},
			isLogged: () => {
				const token = localStorage.getItem('token')
				if (token) {
					const userData = JSON.parse(localStorage.getItem('user'));
					console.log(userData)
					setStore({ isLogged: true, user: userData.email })
				}
			},
			accessProtected: async () => {
				const token = localStorage.getItem('token')
				const uri = `${process.env.BACKEND_URL}/api/protected`;
				const options = {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}`
					}
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('error', response.status, response.statusText);
					return
				}
				const data = await response.json();
				console.log(data);
			},
			getPosts: async () => {
				const token = localStorage.getItem('token')
				const uri = `${process.env.BACKEND_URL}/api/posts`;
				const options = {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}`
					}
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					if (response.status === 403) {
						const data = await response.json()
						setStore({
							alert: {
								text: "Error no puedes acceder a esto",
								background: 'danger',
								visible: true
							},
						})
						return
					}
					if (response.status === 404 || response.status === 422 ) {
						const data = await response.json()
						setStore({
							alert: {
								text: "Error no puedes acceder a esto",
								background: 'danger',
								visible: true
							},
						})
						return
					}
					console.log('error', response.status, response.statusText);
					return
				}
				const data = await response.json();
				console.log( 'get posts:', data);
				setStore({ posts: data.results });
			},
			getPost: async (id) => {
				const token = localStorage.getItem('token')
				const uri = `${process.env.BACKEND_URL}/api/posts/${id}`;
				const options = {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}`
					}
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					// error 40
					if (response.status === 403) {
						const data = await response.json()
						setStore({
							alert: {
								text: data.message,
								background: 'danger',
								visible: true
							},
						})
						return
					}
					if (response.status === 404 ||  response.status === 422 ) {
						const data = await response.json()
						setStore({
							alert: {
								text: data.message,
								background: 'danger',
								visible: true
							},
						})
						return
					}
					console.log('error', response.status, response.statusText);
					return
				}
				const data = await response.json();
				console.log(data);
				const text = data.results.title
				setStore({
					alert: {
						text: text,
						background: 'info',
						visible: true
					},
				})
			},
		}
	};
};

export default getState;
