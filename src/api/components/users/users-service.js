const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Email Checker
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailChecker(email) {
  const emailChecked = await usersRepository.emailChecker(email);
  if (!emailChecked) {
    return null;
  } else {
    return true;
  }
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update Password
 * @param {string} id
 * @param {string} old_password
 * @param {string} new_password
 * @returns {boolean}
 */

async function passwordUpdate(id, old_password, new_password) {
  const user = await usersRepository.getUser(id);

  if (!user) {
    return null;
  }

  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(old_password, userPassword);

  if (user && passwordChecked) {
    const hashedPassword = await hashPassword(new_password);
    try {
      await usersRepository.updatePassword(id, hashedPassword);
    } catch (err) {
      return null;
    }
    return true;
  } else {
    return null;
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  emailChecker,
  updateUser,
  deleteUser,
  passwordUpdate,
};
