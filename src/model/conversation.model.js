const db = require("@/config/database");
const { user } = require("@/config/db.config");

const createConversation = async (name, type, participant_ids, user_id) => {
  try {
    const created_by = user_id;

    const [{ insertId }] = await db.query(
      `INSERT INTO CONVERSATIONS (created_by,name,type) VALUES (?,?,?)`,
      [created_by, name, type],
    );
    const conversationId = insertId;
    const memberValues = participant_ids.map((userId) => [
      conversationId,
      userId,
    ]);
    console.log(memberValues);
    await db.query(
      `INSERT INTO conversation_participants (conversation_id,user_id) VALUES ?`,
      [memberValues],
    );
    return insertId;
  } catch (error) {
    console.log(error);
  }
};

const getMyConversations = async (userId) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM conversations 
       JOIN  conversation_participants as c ON c.conversation_id = conversations.id
       WHERE c.user_id = ?
       ORDER BY c.id DESC`,
      [userId],
    );

    return rows;
  } catch (error) {
    console.log(error);
  }
};
const findConversation = async (userId) => {
  try {
    const [rows] = await db.query("SELECT * FROM conversations WHERE id = ? ", [
      userId,
    ]);
    return rows[0];
  } catch (error) {
    console.log(error);
  }
};

// tìm trong bảng user
const findUserById = async (userId) => {
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    return rows[0];
  } catch (error) {
    console.log(error);
  }
};
const addParticipant = async (conversationId, userId) => {
  try {
    const [result] = await db.query(
      "INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?, ?)",
      [conversationId, userId],
    );
    return result;
  } catch (error) {
    console.log(error);
  }
};

const checkUserInConversation = async (conversationId, userId) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM conversation_participants WHERE conversation_id = ? AND user_id = ?",
      [conversationId, userId],
    );
    console.log(rows);
    if (rows.length === 0) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
  }
};
const createMessage = async (conversationId, senderId, content) => {
  try {
    const [{ insertId }] = await db.query(
      "INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)",
      [conversationId, senderId, content],
    );
    return insertId;
  } catch (error) {
    console.error("Database Error:", error);
    throw error;
  }
};
const getMessageByConversation = async (conversationId) => {
  try {
    const [rows] = await db.query(
      `SELECT 
    messages.content,
    users.id,
    messages.conversation_id,
    messages.created_at
FROM messages
JOIN users 
    ON messages.sender_id = users.id
    WHERE messages.conversation_id = ?
ORDER BY messages.created_at ASC;
`,
      [conversationId],
    );

    const formattedRows = rows.map((row) => ({
      id: row.id,
      conversation_id: row.conversation_id,
      sender: {
        id: row.sender_id,
        email: row.sender_email,
      },
      content: row.content,
      created_at: row.created_at,
    }));

    return formattedRows;
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  createConversation,
  getMyConversations,
  findConversation,
  addParticipant,
  checkUserInConversation,
  createMessage,
  getMessageByConversation,
  findUserById,
};
