const db = require('../db/knex.js')
const { v4 } = require('uuid')

const TABLE_NAME = 'users'

exports.findByUsername = username => 
    db(`${TABLE_NAME}`)
        .where({ username })
        .first()

exports.findByEmail = email => 
    db(`${TABLE_NAME}`)
        .where({ email })
        .first()

exports.findByIds = ids =>
    db(`${TABLE_NAME}`)
        .whereIn('id', ids)
        .select('id', 'name', 'username');

exports.findById = id => 
    db(`${TABLE_NAME}`)
        .where({ id })
        .first()
        .then(row => {
            if (!row) return null
            return {
                id: row.id,
                name: row.name,
                username: row.username,
                createdAt: row.created_at,
                updatedAt: row.updated_at
            }
        })

exports.createUser = async user => {

    const id = v4()

    await db(`${TABLE_NAME}`)
        .insert({ id, ...user})

    return this.findById(id)
}

exports.deleteUser = username =>
    db(`${TABLE_NAME}`)
        .where({ username })
        .del()
        .then(count => count > 0)

exports.updateUser = (username, user) =>
    db(`${TABLE_NAME}`)
        .where({ username })
        .update(user)
        .then(count => count > 0)

exports.findAll = () =>
    db(`${TABLE_NAME}`)
        .select('id', 'name', 'username', 'created_at', 'updated_at')
        .then(rows => rows.map(row => ({
            id: row.id,
            name: row.name,
            username: row.username,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        })))

exports.deleteAll = () =>
    db(`${TABLE_NAME}`)
        .del()
        .then(() => {})