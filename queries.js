const { pool } = require('./db_init');

async function getAssets() {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM assets WHERE is_active = true ORDER BY user_id`
    );
    return rows;
  } catch (error) {
    return 'failed';
  }
}

async function getCodes() {
  try {
    const { rows } = await pool.query(
      `SELECT DISTINCT(code) FROM assets WHERE is_active = true`
    );
    return rows;
  } catch (error) {
    return 'failed';
  }
}

async function updateAssets(newValue, id) {
  try {
    const { rows } = await pool.query(
      `UPDATE assets SET last_value = $1, last_time = current_timestamp WHERE id = $2`,
      [newValue, id]
    );
    return 'sucsess';
  } catch (error) {
    console.log(error);
    return 'failed';
  }
}

async function getTelegramID(userId) {
  try {
    const { rows } = await pool.query(
      `SELECT telegram_id FROM users WHERE id = $1`,
      [userId]
    );
    return rows[0].telegram_id;
  } catch (error) {
    return 'failed';
  }
}

module.exports = {
  getAssets,
  getCodes,
  updateAssets,
  getTelegramID,
};
