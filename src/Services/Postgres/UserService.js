const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../Excption/invariantError');
const NotFoundError = require('../../Excption/NoutFoundError');

class UserService {
  constructor() {
    this._pool = new Pool();
  }

  // Method menambahkan User baru
  async addUser({ username, password, fullname }) {
    // verivikasi username belum terdaftar
    await this.verifyNewUsername(username);

    // inisialisasi id, password
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    // memasukan semua data ke dalam databases jika verify di lewati
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    // jika result lebih dari 0 arti nya user sudah terisi
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  // Method memeriksa username jika username belum ada
  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool(query);

    if (result.rows.length > 0) { // Jika username sudah ada
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.')
    }
  }

  // Method mencari user berdasarkan id
  async getUserById(userId) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  }
}
module.exports = UserService;