const { client}= require("../config/db.config");
async function getCache(key) {
  if (process.env.NODE_ENV === "production") {
    return await client.get(key);
  }
  return null;
}

async function setCache(key, value) {
  if (process.env.NODE_ENV === "production") {
    return await client.set(key, value, { EX: 100 });
  }
  return null;
}

module.exports = {
  getCache,
  setCache,
};
