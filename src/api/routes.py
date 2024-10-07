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
        response_body['message']='Listado de usuarios y sus publicaciones (GET)'
        response_body['results'] = result
        return response_body, 200

# SCALARS = LISTA / SCALAR = DICCIONARIO0
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

@api.route('/posts/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
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
    

@api.route('/medias', methods=['GET', 'POST'])
def medias():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Medias)).scalars()
        result= [row.serialize() for row in rows]
        response_body['message'] = 'Este es el GET de medias'
        response_body['result'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = Medias(media_type = data.get('media_type'),
                url = data.get('url'),
                post_id = data.get('post_id'),)
        db.session.add(row)
        db.session.commit()
        response_body['message'] = 'Crea un media con POST'
        response_body['results'] = {}
        return response_body, 200

@api.route('/medias/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def media(id):
    response_body = {}
    row = db.session.execute (db.select(Medias).where(Medias.id == id)).scalar()
    if not row:
        response_body['message'] = f'NO EXISTE este media: {id} (GET)'
        response_body['results'] = {}
        return response_body, 400
    
    if request.method == 'GET':
        response_body['message'] = f'Datos de la media: {id} (GET)'
        response_body['results'] = {}
        return response_body, 200
    if request.method == 'PUT':
        response_body['message'] = f'media: {id} fue modificada (PUT)'
        response_body['results'] = {}
        return response_body, 200
    if request.method == 'DELETE':
        response_body['message'] = f'Se elimino la media: {id} (DELETE)'
        response_body['results'] = {}
        return response_body, 200


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

@api.route('users/<int:id>/followers', methods=['GET', 'PUT', 'DELETE'])
def follower(id):
    response_body = {}
    row = db.session.execute (db.select(Followers).where(Followers.following_id == id)).scalar()
    if not row:
        response_body['message'] = f'NO EXISTE ESTE SEGUIDOR: {id} (GET)'
        response_body['results'] = {}
        return response_body, 400
    
    if request.method == 'GET':
        response_body['message'] = f'Datos de follower: {id} (GET)'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.following_id = data.get('following_id')
        row.follower_id = data.get('follower_id')
        db.session.commit()
        response_body['message'] = f'follower: {id} fue modificada (PUT)'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'Se elimino la follower: {id} (DELETE)'
        response_body['results'] = {}
        return response_body, 200
#falta following

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

@api.route('post/<int:id>/comments/', methods=['GET', 'PUT', 'DELETE'])
def comment(id):
    response_body = {}
    row = db.session.execute (db.select(Comments).where(Comments.id == id)).scalar()
    if not row:
        response_body['message'] = f'NO EXISTE ESTE Comment: {id} (GET)'
        response_body['results'] = {}
        return response_body, 400
    
    if request.method == 'GET':
        response_body['message'] = f'Datos de la comments: {id} (GET)'
        response_body['results'] = {}
        return response_body, 200
    if request.method == 'PUT':
        response_body['message'] = f'comments: {id} fue modificada (PUT)'
        response_body['results'] = {}
        return response_body, 200
    if request.method == 'DELETE':
        response_body['message'] = f'Se elimino la comments: {id} (DELETE)'
        response_body['results'] = {}
        return response_body, 200
#falta uno de coments de post

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


@api.route('characters', methods=['GET', 'POST'])
def characters():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Characters)).scalars()
        results = [row.serialize() for row in rows]
        response_body['message'] = 'este es el get de characters'
        response_body['results'] = results
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        rows = Characters(name = data.get('name'),
                          height = data.get('height'),
                          mass = data.get('mass'),
                          hair_color = data.get('hair_color'),
                          skin_color = data.get('skin_color'),
                          eye_color = data.get('eye_color'),
                          birth_year = data.get('birth_year'),
                          gender= data.get('gender'))
        db.session.add(rows)
        db.session.commit()
        response_body['message'] = 'Este es el mensaje del POST de characters'
        response_body['results'] ={}
        return response_body, 200

@api.route('/characters/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def character(id):
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = f'Datos de la character: {id} (GET)'
        response_body['results'] = {}
        return response_body, 200
    if request.method == 'PUT':
        response_body['message'] = f'character: {id} fue modificada (PUT)'
        response_body['results'] = {}
        return response_body, 200
    if request.method == 'DELETE':
        response_body['message'] = f'Se elimino la character: {id} (DELETE)'
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


@api.route('/planets', methods=['GET', 'POST'])
def planets():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Planets)).scalars()
        results = [row.serialize() for row in rows]
        response_body['message'] = 'get de planets'
        response_body['results'] = results
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        rows = Planets(name = data.get('name'),
                       diameter = data.get('diameter'),
                       rotation_period = data.get('rotation_period'),
                       orbital_period = data.get('orbital_period'),
                       gravity = data.get('gravity'),
                       population = data.get('population'),
                       climate = data.get('climate'),
                       terrain = data.get('terrain'))
        db.session.add(rows)
        db.session.commit()
        response_body['message'] = 'post de planets'
        response_body['results'] = rows.serialize()
        return response_body, 200

@api.route('/planets/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def planet():
    response_body = {}
    
    # if not row:
        # response_body['message'] = f'Datos de la planet: {id} (GET)'
        # response_body['results'] = {}
        # return response_body, 200
    if request.method == 'GET':
        response_body['message'] = f'Datos de la planet: {id} (GET)'
        response_body['results'] = {}
        return response_body, 200
    if request.method == 'PUT':
        response_body['message'] = f'planet: {id} fue modificada (PUT)'
        response_body['results'] = {}
        return response_body, 200
    if request.method == 'DELETE':
        response_body['message'] = f'Se elimino la planet: {id} (DELETE)'
        response_body['results'] = {}
        return response_body, 200