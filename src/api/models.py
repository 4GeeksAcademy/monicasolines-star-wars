from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

db = SQLAlchemy()


class Users (db.Model):
    # El tablename se genera solos como users
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    first_name =  db.Column(db.String(80), unique=False, nullable=True)
    last_name = db.Column(db.String(), unique=False, nullable=True)

    def __repr__(self):
        return f'<User: {self.id} - {self.email}>'

    def serialize(self):
        # Do not serialize the password, its a security breach
        return {'id': self.id,
                'email': self.email,
                'is_active': self.is_active,
                'posts': [row.serialize() for row in self.posts_to],
        }
    

class Posts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(), nullable=False)
    description = db.Column(db.String, unique=False, nullable=True)  
    body = db.Column(db.String, unique=False, nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.now)
    image_url = db.Column(db.String)
    users_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_to = db.relationship('Users', foreign_keys=[users_id], backref=db.backref('posts_to', lazy='select'))

    def __repr__ (self):
        return f'post: {self.id} - {self.title}'

    def serialize(self):
        return {'id': self.id,
                'title': self.title,
                'description': self.description,
                'body': self.body,
                'date': self.date,
                'image_url': self.image_url,
                'users_id': self.users_id}

class Comments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String, unique=False, nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    post_to = db.relationship('Posts', foreign_keys=[post_id], backref=db.backref('comments_to', lazy='select'))
    users_id =  db.Column(db.Integer, db.ForeignKey('users.id'))
    user_to = db.relationship('Users', foreign_keys=[users_id], backref=db.backref('comments_to', lazy='select'))

    def __repr__ (self):
        return f'comment: {self.id} - {self.body}'
    
    def serialize(self):
        return {'id': self.id,
                'body': self.body,
                'post_id': self.post_id,
                'users_id': self.users_id}

class Medias(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    media_type =  db.Column(db.Enum('image', 'video', 'podcast', name='media_type'))
    url = db.Column(db.String)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), unique=True)
    post_to = db.relationship('Posts', foreign_keys=[post_id], backref=db.backref('media_to', lazy='select'))

    def __repr__ (self):
        return f'media: {self.id} - {self.media_type} - {self.url}'
    
    def serialize(self):
        return {'id': self.id,
                'type': self.media_type,
                'url': self.url,
                'post_id': self.post_id}

class Followers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    following_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    following_to = db.relationship('Users', foreign_keys=[following_id], backref=db.backref('following_to', lazy='select'))
    follower_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    follower_to = db.relationship('Users', foreign_keys=[follower_id], backref=db.backref('follower_to', lazy='select'))

    def __repr__ (self):
        return f'Following: {self.following_id} - follower: {self.follower_id}'

    def serialize(self):
        return { 'id': self.id,
                'following_id' : self.following_id,
                'follower_id': self.follower_id,
                'following_email': self.following_to.email if self.following_to else None,  # Email del usuario seguido
                'follower_email': self.follower_to.email if self.follower_to else None}
    
class Characters(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=True, nullable=False)
    height = db.Column(db.String, unique=False, nullable=False)
    mass = db.Column(db.String, unique=False, nullable=False)
    hair_color = db.Column(db.String, unique=False, nullable=False)
    skin_color = db.Column(db.String, unique=False, nullable=False)
    eye_color = db.Column(db.String, unique=False, nullable=False)
    birth_year = db.Column(db.String, unique=False, nullable=False)
    gender = db.Column(db.String, unique=False, nullable=False)

    def __repr__ (self):
        return f'character: {self.id} - follower: {self.name}'
    
    def serialize(self):
        return {'id': self.id,
                'name': self.name,
                'height': self.height,
                'mass': self.mass,
                'hair_color': self.hair_color,
                'skin_color': self.skin_color,
                'eye_color': self.eye_color,
                'birth_year': self.birth_year,
                'gender': self.gender}

class Character_Favorites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    users_id =  db.Column(db.Integer, db.ForeignKey('users.id'))
    user_to = db.relationship('Users', foreign_keys=[users_id], backref=db.backref('characters_favorites_to', lazy='select'))
    chracters_id =  db.Column(db.Integer, db.ForeignKey('characters.id'))
    chracter_to = db.relationship('Characters', foreign_keys=[chracters_id], backref=db.backref('characters_favorites_to', lazy='select'))

    def __repr__ (self):
        return f'Characters_favorites: {self.id}'
    
    def serialize(self):
        return {'id': self.id,
                'users_id': self.users_id,
                'characters_id': self.chracters_id}
    
class Planets(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=True, nullable=False)
    diameter = db.Column(db.String, unique=False, nullable=False)
    rotation_period = db.Column(db.String, unique=False, nullable=False)
    orbital_period = db.Column(db.String, unique=False, nullable=False)
    gravity = db.Column(db.String, unique=False, nullable=False)
    population = db.Column(db.String, unique=False, nullable=False)
    climate = db.Column(db.String, unique=False, nullable=False)
    terrain = db.Column(db.String, unique=False, nullable=False)

    def __repr__ (self):
        return f'Planets: {self.id} - {self.name}'
    
    def serialize(self):
        return {'id': self.id,
                'name': self.name,
                'diameter': self.diameter,
                'rotation_period': self.rotation_period,
                'orbital_period': self.orbital_period,
                'gravity': self.gravity,
                'population': self.population,
                'climate': self.population,
                'terrain': self.terrain}

class Planet_Favorites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    users_id =  db.Column(db.Integer, db.ForeignKey('users.id'))
    user_to = db.relationship('Users', foreign_keys=[users_id], backref=db.backref('planets_favorites_to', lazy='select'))
    planets_id =  db.Column(db.Integer, db.ForeignKey('planets.id'))
    planets_to = db.relationship('Planets', foreign_keys=[planets_id], backref=db.backref('planets_favorites_to', lazy='select'))

    def __repr__ (self):
        return f'Planets_favorites: {self.id}'
    
    def serialize(self):
        return {'id': self.id,
                'users_id': self.users_id,
                'planets_id': self.planets_id}

# Model Table () : es bueno deberia aprender a utilizarlo ( cuando es mas optimo es mejor usar tabla a modelo), un poco mas complejo