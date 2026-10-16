// NeDB — pure-JS embedded DB, no MongoDB needed
const Datastore = require('nedb-promises');
const path = require('path');
const fs = require('fs');

const dataDir = fs.existsSync(path.join(__dirname, 'users.db'))
  ? __dirname
  : path.join(__dirname, 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = {
  users: Datastore.create({ filename: path.join(dataDir, 'users.db'), autoload: true }),
  resumes: Datastore.create({ filename: path.join(dataDir, 'resumes.db'), autoload: true }),
  roadmaps: Datastore.create({ filename: path.join(dataDir, 'roadmaps.db'), autoload: true }),
  chatMessages: Datastore.create({ filename: path.join(dataDir, 'chat.db'), autoload: true }),
  mockInterviews: Datastore.create({ filename: path.join(dataDir, 'interviews.db'), autoload: true }),
};

// Ensure indexes
db.users.ensureIndex({ fieldName: 'email', unique: true });
db.resumes.ensureIndex({ fieldName: 'userId', unique: true });
db.roadmaps.ensureIndex({ fieldName: 'userId', unique: true });
db.chatMessages.ensureIndex({ fieldName: 'userId' });
db.mockInterviews.ensureIndex({ fieldName: 'userId' });

module.exports = db;
