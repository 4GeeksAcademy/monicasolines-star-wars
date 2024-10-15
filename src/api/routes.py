"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Users, Posts, Medias, Followers, Comments, Character_Favorites, Characters, Planet_Favorites, Planets
from datetime import datetime
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
import requests
#pipenv install requests para instalar este import
#pipenv install Flask-JWT 

api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {}
    response_body["message"] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return response_body, 200


@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    data = request.json
    email = data.get("email", None)
    password = request.json.get("password", None)
    user = db.session.execute(db.select(Users).where(Users.email == email, Users.password == password, Users.is_active)).scalar()
    if not user:
        response_body['message'] = 'Bad email or password'
        return response_body, 401
    print('************ Valor de user *************:', user.serialize())
    access_token = create_access_token(identity={'email': user.email, 'user_id': user.id})
    response_body['message'] = f'Bienvenido {email}'
    response_body['access_token'] = access_token
    return response_body, 200


@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    response_body = {}
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    response_body['logged_in_as'] = current_user
    return response_body, 200


@api.route('/users', methods=['GET', 'POST'])
def users():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Users)).scalars()
        # hay varias opciones, esta es la 1(la otra es con for), esta es con list comprehension
        result=[ row.serialize() for row in rows]
        response_body['message']='Listado de usuarios (GET)'
        response_body['results'] = result
        return response_body, 200


# SCALARS = LISTA / SCALAR = DICCIONARIO
# Endpoints de los Posts
@api.route('/posts', methods=['GET', 'POST'])
def posts():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Posts)).scalars()
        # hay varias opciones, esta es la 1(la otra es con for), esta es con list comprehension
        result=[ row.serialize() for row in rows]
        response_body['message']='Listado de todas Publicaciones (GET)'
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = Posts(title = data.get('title'),
                description = data.get('description'),
                body = data.get('body'),
                date = datetime.now(),
                image_url = data.get('image_url'),
                users_id = data.get('users_id'),)
        db.session.add((row))
        db.session.commit()
        response_body['message']='Creo nueva publicacion (POST)'
        response_body['results'] = row.serialize()
        return response_body, 200


# Este endpoint trae un post especifico, lo edita y elimina
@api.route('/posts/<int:id>', methods=['GET', 'PUT', 'DELETE'])
# @jwt_required()
def post(id):
    response_body = {}
    row = db.session.execute (db.select(Posts).where(Posts.id == id)).scalar()
    if not row:
        response_body['message'] = f'NO EXISTE LA PUBLICACION: {id} (GET)'
        response_body['results'] = {}
        return response_body, 400
    
    if request.method == 'GET':
        response_body['message'] = f'Datos de la publicacion: {id} (GET)'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.title = data.get('title')
        row.description = data.get('description')
        row.body = data.get('body')
        row.date = datetime.now()
        row.image_url = data.get('image_url')
        row.users_id = data.get('users_id')
        db.session.commit()
        response_body['message'] = f'Publicacion: {id} fue modificada (PUT)'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'Se elimino la publicacion: {id} (DELETE)'
        response_body['results'] = {}
        return response_body, 200


# Este endpoint trae todos los posts de un usuario
@api.route('/users/<int:id>/posts', methods=['GET', 'PUT', 'DELETE'])
# @jwt_required()
def user_post(id):
    response_body = {}
    rows = db.session.execute (db.select(Posts).where(Posts.users_id == id)).scalars()
    if not rows:
        response_body['message'] = f'NO EXISTE LA PUBLICACION: {id} (GET)'
        response_body['results'] = {}
        return response_body, 400
    
    if request.method == 'GET':
        response_body['message'] = f'Datos de todas las publicacion: {id} (GET)'
        response_body['results'] = [row.serialize() for row in rows]
        return response_body, 200
    

# Los followers de todos
@api.route('/followers', methods=['GET', 'POST'])
def followers():
    response_body= {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Followers)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = 'Este es el get de los followers'
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = Followers(following_id = data.get('following_id'),
                        follower_id = data.get('follower_id'))
        db.session.add(row)
        db.session.commit()
        response_body['message']= 'este crea un followers con POST'
        response_body['results'] = row.serialize()
        return response_body, 200


# Eso trae los seguidores de un usuario especifico
@api.route('users/<int:id>/followers', methods=['GET', 'PUT', 'DELETE'])
def follower(id):
    response_body = {}
    rows = db.session.execute (db.select(Followers).where(Followers.following_id == id)).scalars()
    if not rows:
        response_body['message'] = f'NO EXISTE ESTE USUARIO: {id} (GET)'
        response_body['results'] = {}
        return response_body, 400
    
    if request.method == 'GET':
        response_body['message'] = f'Datos de followers: {id} (GET)'
        response_body['results'] = [row.serialize() for row in rows]
        return response_body, 200
    

# Esto trae los que el usuario sigue
@api.route('users/<int:id>/following', methods=['GET', 'PUT', 'DELETE'])
def following(id):
    response_body = {}
    rows = db.session.execute (db.select(Followers).where(Followers.follower_id == id)).scalars()
    if not rows:
        response_body['message'] = f'NO EXISTE ESTE USUARIO: {id} (GET)'
        response_body['results'] = {}
        return response_body, 400
    
    if request.method == 'GET':
        response_body['message'] = f'Datos de los que sigue el: {id} (GET)'
        response_body['results'] = [row.serialize() for row in rows]
        return response_body, 200


@api.route('/comments', methods=['GET', 'POST'])
def comments():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Comments)).scalars()
        results = [row.serialize() for row in rows]
        response_body['message'] = 'Este trae los comentarios GET'
        response_body['results'] = results
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = Comments(body = data.get('body'),
                       post_id =data.get('post_id'),
                       users_id = data.get('users_id'))
        db.session.add(row)
        db.session.commit()
        response_body['message']= 'esto agrega comentario'
        response_body['resuts']= row.serialize()
        return response_body, 200

# Trae un comment especifico, lo edita y elimina
@api.route('post/<int:id>/comments/', methods=['GET', 'PUT', 'DELETE'])
def comment(id):
    response_body = {}
    row = db.session.execute (db.select(Comments).where(Comments.id == id)).scalar()
    if not row:
        response_body['message'] = f'NO EXISTE ESTE Comment: {id} (GET)'
        response_body['results'] = {}
        return response_body, 400
    
    if request.method == 'GET':
        response_body['message'] = f'Datos del comment: {id} (GET)'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.body = data.get('body')
        row.post_id = data.get('post_id')
        row.users_id = data.get('users_id')
        db.session.commit()
        response_body['message'] = f'comments: {id} fue modificada (PUT)'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'Se elimino el comment: {id} (DELETE)'
        response_body['results'] = {}
        return response_body, 200
    

#esto trae los comments de un post especifico
@api.route('post/<int:id>/comments', methods=['GET', 'PUT', 'DELETE'])
def post_comments(id):
    response_body = {}
    rows = db.session.execute (db.select(Comments).where(Comments.post_id == id)).scalars()
    if not rows:
        response_body['message'] = f'NO EXISTE ESTE POST: {id} (GET)'
        response_body['results'] = {}
        return response_body, 400
    
    if request.method == 'GET':
        response_body['message'] = f'Comments de este post: {id} (GET)'
        response_body['results'] = [row.serialize() for row in rows]
        return response_body, 200


#esto trae los comments de un usuario especifico
@api.route('user/<int:id>/comments', methods=['GET', 'PUT', 'DELETE'])
def user_comments(id):
    response_body = {}
    rows = db.session.execute (db.select(Comments).where(Comments.users_id == id)).scalars()
    if not rows:
        response_body['message'] = f'NO EXISTE ESTE USUARIO: {id} (GET)'
        response_body['results'] = {}
        return response_body, 400
    
    if request.method == 'GET':
        response_body['message'] = f'Comments de este usuario: {id} (GET)'
        response_body['results'] = [row.serialize() for row in rows]
        return response_body, 200



@api.route('/character-favorites', methods=['GET', 'POST'])
def characters_favorites():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Character_Favorites)).scalars()
        results = [row.serialize() for row in rows]
        response_body['message'] = 'este es el GET de los personajes favoritos'
        response_body['results']= results
        return response_body,200
    if request.method == 'POST':
        data = request.json
        rows = Character_Favorites(users_id = data.get('users_id'),
                                   chracters_id = data.get('character_id'))
        db.session.add(rows)
        db.session.commit()
        response_body['message'] = ' este es el POST de char favs'
        response_body['results'] = rows.serialize()
        return response_body, 200


@api.route('character-favorites/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def character_favorite(id):
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = f'Datos de la char fav: {id} (GET)'
        response_body['results'] = {}
        return response_body, 200
    if request.method == 'PUT':
        response_body['message'] = f'char fav: {id} fue modificada (PUT)'
        response_body['results'] = {}
        return response_body, 200
    if request.method == 'DELETE':
        response_body['message'] = f'Se elimino la char fav: {id} (DELETE)'
        response_body['results'] = {}
        return response_body, 200


@api.route('/planet-favorites', methods=['GET', 'POST'])
def planet_favorites():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Planet_Favorites)).scalars()
        results = [row.serialize() for row in rows]
        response_body['message'] = 'este es el get de planets favorites'
        response_body['results'] = results
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        rows = Planet_Favorites(users_id = data.get('users_id'),
                                planets_id = data.get('planets_id'))
        db.session.add(rows)
        db.session.commit()
        response_body['message'] = ' este es el POST de planets favs'
        response_body['results'] = rows.serialize()
        return response_body, 200


@api.route('/planets-favorites/<int:id>')
def planet_favorite(id):
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = f'Datos de la planet fav: {id} (GET)'
        response_body['results'] = {}
        return response_body, 200
    if request.method == 'PUT':
        response_body['message'] = f'planet fav: {id} fue modificada (PUT)'
        response_body['results'] = {}
        return response_body, 200
    if request.method == 'DELETE':
        response_body['message'] = f'Se elimino la planet fav: {id} (DELETE)'
        response_body['results'] = {}
        return response_body, 200


@api.route('/characters/<int:id>', methods=['GET'])
def character(id):
    response_body = {}
    # Formatear la URL con el ID del personaje
    url = f'https://www.swapi.tech/api/people/{id}'
    
    # Obtener los datos desde la API
    response = requests.get(url)
    print(response)
    
    if response.status_code == 200:
        data = response.json()
        # Verificar si el personaje ya existe en la base de datos
        existing_char = db.session.query(Characters).filter_by(id=data["result"]["uid"]).first()

        if not existing_char:
            # Si el personaje no existe, se crea uno nuevo
            char = Characters(
                id=data["result"]["uid"],
                name=data["result"]["properties"]["name"],
                height=data["result"]["properties"]["height"],
                mass=data["result"]["properties"]["mass"],
                hair_color=data["result"]["properties"]["hair_color"],
                skin_color=data["result"]["properties"]["skin_color"],
                eye_color=data["result"]["properties"]["eye_color"],
                birth_year=data["result"]["properties"]["birth_year"],
                gender=data["result"]["properties"]["gender"]
            )
            db.session.add(char)
            db.session.commit()
        else:
            # Si el personaje ya existe, usar el existente
            char = existing_char

        # Serializar el objeto character
        response_body['results'] = char.serialize()
    else:
        response_body['error'] = f'Error al obtener datos desde SWAPI. Código de estado: {response.status_code}'

    return response_body, 200


@api.route('/planets/<int:id>', methods=['GET'])
def planet(id):
    response_body = {}
    url = f'https://www.swapi.tech/api/planets/{id}'
    
    response = requests.get(url)
    print(response)
    
    if response.status_code == 200:
        data = response.json()
        existing_planet = db.session.query(Planets).filter_by(id=data["result"]["uid"]).first()

        if not existing_planet:
            planet = Planets(
                id=data["result"]["uid"],
                name=data["result"]["properties"]["name"],
                diameter=data["result"]["properties"]["diameter"],
                rotation_period=data["result"]["properties"]["rotation_period"],
                orbital_period=data["result"]["properties"]["orbital_period"],
                gravity=data["result"]["properties"]["gravity"],
                population=data["result"]["properties"]["population"],
                climate=data["result"]["properties"]["climate"],
                terrain=data["result"]["properties"]["terrain"]
            )
            db.session.add(planet)
            db.session.commit()
        else:
            planet = existing_planet

        response_body['results'] = planet.serialize()
    else:
        response_body['error'] = f'Error al obtener datos desde SWAPI. Código de estado: {response.status_code}'

    return response_body, 200