const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../Excption/invariantError');
const NotFoundError = require('../../Excption/NoutFoundError');
const AuthenticationError = require('../../Excption/AuthenticationError');

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

    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);

    if (result.rows.length > 0) { // Jika username sudah ada
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
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

  // Method memeriksa kredinsial username dan password benar
  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { id, password: hashedPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }
    return id;
  }
}
module.exports = UserService;