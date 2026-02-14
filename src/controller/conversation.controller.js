const db = require("@/config/database");
const conversationModel = require("@/model/conversation.model");
const createConversation = async (req, res) => {
  const {
    name = "Direct Message",
    type = "direct",
    participant_ids = [],
  } = req.body;
  const normalizedType = type.toLowerCase();
  //  Kiểm tra có phải mảng không
  if (!Array.isArray(participant_ids) || participant_ids.length === 0) {
    return res.error(400, null, "Danh sách thành viên không hợp lệ");
  }
  // logic direct
  if (normalizedType === "direct") {
    if (participant_ids.length !== 2) {
      return res.error(
        400,
        null,
        "Cuộc trò chuyện trực tiếp phải có đúng 2 thành viên",
      );
    }
  }
  console.log(participant_ids.length);
  if (normalizedType === "group" && participant_ids.length < 2) {
    return res.error(400, null, "Nhóm phải có ít nhất 2 thành viên");
  }

  const insertId = await conversationModel.createConversation(
    name,
    type,
    participant_ids,
  );
  if (!insertId) {
    return res.error(400, null, "Create Fail");
  }
  return res.success({
    id: insertId,
    type,
    name,
  });
};
const getMyConversations = async (req, res) => {
  const conversation = await conversationModel.getMyConversations(
    req.currentUser.id,
  );
  console.log(req.currentUser.id);
  if (!conversation) {
    return res.success({
      message: "Chưa có bài viết nào",
    });
  }
  return res.success(conversation);
};
const addMember = async (req, res) => {
  const conversationId = req.params.id;
  const { user_id } = req.body;
  if (!user_id) {
    return res.error(400, null, "Thiếu user_id để thêm vào nhóm");
  }
  const conversation = await conversationModel.findConversation(conversationId);

  console.log(conversation);
  if (!conversation) {
    return res.error(404, null, "Không tìm thấy cuộc hội thoại");
  }

  // Chỉ cho phép thêm vào group chat
  if (conversation.type !== "group") {
    return res.error(
      400,
      null,
      "Chỉ có thể thêm thành viên vào cuộc trò chuyện nhóm",
    );
  }
  // Thực hiện thêm thành viên
  await conversationModel.addParticipant(conversationId, user_id);

  return res.success({ message: "Thêm thành viên thành công" });
};

const sendMessage = async (req, res) => {
  const conversationId = req.params.id;
  const { content } = req.body;
  const senderId = req.currentUser.id;
  if (!content) {
    return res.error(400, null, "Nội dung tin nhắn không được để trống");
  }
  const membership = await conversationModel.checkUserInConversation(
    conversationId,
    senderId,
  );
  if (!membership) {
    return res.error(
      403,
      null,
      "Bạn không có quyền gửi tin nhắn vào cuộc hội thoại này",
    );
  }
  const insertId = await conversationModel.createMessage(
    conversationId,
    senderId,
    content,
  );
  return res.success(
    {
      id: insertId,
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      created_at: new Date(),
    },
    201,
  );
};
const getMessage = async (req, res) => {
  const conversationId = req.params.id;
  const { content } = req.body;
  const senderId = req.currentUser.id;
  if (!content) {
    return res.error(400, null, "Nội dung tin nhắn không được để trống");
  }
  const membership = await conversationModel.checkUserInConversation(
    conversationId,
    senderId,
  );
  if (!membership) {
    return res.error(
      403,
      null,
      "Bạn không có quyền xem tin nhắn của cuộc hội thoại này",
    );
  }
  const message =
    await conversationModel.getMessageByConversation(conversationId);
  return res.success(message);
};
module.exports = {
  createConversation,
  getMyConversations,
  addMember,
  sendMessage,
  getMessage,
};
