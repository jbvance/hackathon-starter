'use strict';

var bcrypt = require('bcrypt');
var crypto = require('crypto');

//HMAC version
// var secrets = require('../config/secrets');
// function createHash(string) {
//   if(!string)
//     return null;

//   var hashKey = secrets.localAuth.hashKey;
//   var hmac = crypto.createHmac(secrets.localAuth.hashMethod, new Buffer(hashKey, 'utf-8'));
//   return hmac.update(new Buffer(string, 'utf-8')).digest('hex');
// }

var instanceMethods = {
  getGravatarUrl: function(size) {
    if (!size) size = 200;

    if (!this.email) {
      return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
    }

    var md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
  },
  getProfilePicture: function(size) {
    if(this.profile && this.profile.picture != null)
      return this.profile.picture;

    return this.getGravatarUrl(size);
  },
  hasSetPassword: function() {
    return this.password != null && this.password.length > 0;
  }
};

module.exports = function(db, DataTypes) {
  const User = db.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    password: DataTypes.STRING,
    googleId: {
      type: DataTypes.STRING,
      unique: true
    },
    facebookId: {
      type: DataTypes.STRING,
      unique: true
    },
    twitterId: {
      type: DataTypes.STRING,
      unique: true
    },
    linkedInId: {
      type: DataTypes.STRING,
      unique: true
    },
    githubId: {
      type: DataTypes.STRING,
      unique: true
    },
    resetPasswordExpires: DataTypes.DATE,
    resetPasswordToken: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    logins: DataTypes.INTEGER,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      isEmail: true
    },
    emailVerified: { 
      type: DataTypes.BOOLEAN, 
      allowNull: false, 
      defaultValue: false
    },
    profile: DataTypes.JSON,
    tokens: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    tableName: 'pl_users',
    instanceMethods: instanceMethods,
    classMethods: {
      associate: function(models) {
        //User.hasMany(models.Role);
      },
    
      findUser: function(email, password, cb) {
        User.findOne({
          where: { email: email }
        })
        .then(function(user) {
          if(user == null || user.password == null || user.password.length === 0) {
            cb('User / Password combination is not correct', null);
            return;
          }
          bcrypt.compare(password, user.password, function(err, res) {
            if(res)
              cb(null, user);
            else
              cb(err, null);
          });
        })
        .catch(function(serr) { cb(serr, null); });
      }
    },
    hooks: {
      
    },
    indexes: [
      {
        name: 'facebookIdIndex',
        method: 'BTREE',
        fields: ['facebookId']
      },
      {
        name: 'googleIdIndex',
        method: 'BTREE',
        fields: ['googleId']
      },
      {
        name: 'twitterIdIndex',
        method: 'BTREE',
        fields: ['twitterId']
      },
      {
        name: 'linkedInIdIndex',
        method: 'BTREE',
        fields: ['linkedInId']
      },
      {
        name: 'githubIdIndex',
        method: 'BTREE',
        fields: ['githubId']
      }
    ]
  });
  
  User.addHook('beforeCreate', (user, options) => {
   
    return new Promise((resolve, reject) => {
        user.profile = user.profile || {
          name: '',
          gender: '',
          location: '',
          website: ''
        };
        user.tokens = user.tokens || {};
         console.log("IN BEFORE CREATE HOOK", user);
    if(user.changed('password')) {
        user.encryptPassword(user.password, function(hash, err) {
          if (err) {
            reject(err);
          }
          user.password = hash;
          resolve();
        });
      }
      resolve();
    })
    
  });
  
  User.prototype.encryptPassword = function(password, cb) {
    if (!password) {
      cb('', null);
      return;
    }
  
    bcrypt.genSalt(10, function(err, salt) {
      if (err) { cb(null, err); return; }
      bcrypt.hash(password, salt, function(hErr, hash) {
        if (hErr) { cb(null, hErr); return; }
        cb(hash, null);
      });
    });
  };
  
    // validate passowrd on login
  // returns a promise
  User.prototype.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
  }
  
  User.prototype.gravatar = function gravatar(size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

  
  
  return User;
};