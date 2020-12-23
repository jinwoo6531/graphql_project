const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { SECRET_KEY } = require('../../config');
const { UserInputError } = require('apollo-server');

module.exports = {
  Mutation: {
    register(
      _,
      { registerInput: { username, email, password, confirmPassword } },
      
    ) {
      // TODO: Validate user Data
      // TODO: Make sure user doesnt already exist
      const user = await User.findOne({ username });
      if(user) {
          throw new UserInputError('Username is taken', {
            error: {
              username: 'This username is taken'
            }
          })
      }
      // TODO: hash password and create an auth token
      password = await bcrypt.hash(password,12);

      const newUser = new User({
          email,
          username,
          password,
          createdAt: new Date().toISOString()
      });

      const res = await newUser.save();
      const token = jwt.sign({
          id: res.id,
          email: res.email,
          username: res.username
      }, SECRET_KEY, { expiresIn: '1h'});
      return {
          ...res.doc,
            id:res._id,
            token
     }
    },
  },
};
