const createConversation = async (req, res) => {
  const { name, type = "direct", participant_ids = [] } = req.body;
  const created_by = participant_ids?.[0];
  const [{ insertId }] = db.query(
    `INSERT INTO CONVERSATIONS (created_by,name,type) VALUES (?,?,?)`,
    [created_by, name, type],
  );
  console.log(insertId);
};
module.exports = { createConversation };
