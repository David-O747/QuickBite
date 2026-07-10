const crypto = require('crypto')

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !password) return false
  const [salt, hash] = storedHash.split(':')
  if (!salt || !hash) return false

  const expected = Buffer.from(hash, 'hex')
  const actual = crypto.scryptSync(password, salt, 64)

  if (expected.length !== actual.length) return false
  return crypto.timingSafeEqual(expected, actual)
}

module.exports = {
  hashPassword,
  verifyPassword,
}
