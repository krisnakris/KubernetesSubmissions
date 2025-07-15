const db = require("./db");

const pingpongCounter = async () => {
  try {
    // Dapatkan count terakhir dari database
    const latest = await db.query(
      "SELECT count FROM pingpong_counts ORDER BY id DESC LIMIT 1"
    );

    const currentCount = latest.rows.length > 0 ? latest.rows[0].count + 1 : 1;

    const res = await db.query(
      "INSERT INTO pingpong_counts (count) VALUES ($1) RETURNING *",
      [currentCount]
    );
    console.log(`Logged to database: "Ping / Pong": ${pingpongCount}`);
    return pingpongCount;
  } catch (err) {
    console.error("Database operation failed:", err);
    throw err;
  }
};

const pingpongManualCount = async () => {
  const res = await db.query(
    "INSERT INTO pingpong_counts (count) VALUES (COALESCE((SELECT MAX(count) FROM pingpong_counts), 0) + 1) RETURNING *"
  );
  return res.rows[0].count;
};

const pingPongValue = async () => {
  const res = await db.query(
    "SELECT count FROM pingpong_counts ORDER BY id DESC LIMIT 1"
  );
  return res.rows.length > 0 ? res.rows[0].count : 0;
};

module.exports = {
  pingpongCounter,
  pingpongManualCount,
  pingPongValue,
};
