import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

/**
 * Registers a new user.
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} { _id, username, email, avatarUrl, token }
 * @throws {Error} If user already exists or data is invalid.
 */
const registerUser = async (username, email, password) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('User already exists');
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      token: generateToken(user._id),
    };
  } else {
    throw new Error('Invalid user data');
  }
};

/**
 * Logs in a user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} { _id, username, email, avatarUrl, token }
 * @throws {Error} If email or password is invalid.
 */
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      token: generateToken(user._id),
    };
  } else {
    throw new Error('Invalid email or password');
  }
};

export const authService = {
  registerUser,
  loginUser,
};
