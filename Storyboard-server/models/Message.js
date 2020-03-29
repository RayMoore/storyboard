const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { objectId } = require("../utils");

const MessageSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["chat", "notification", "request"],
      default: "chat"
    },
    meta: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

MessageSchema.statics.createMessage = function(message) {
  const { type, meta, content, from, to } = message;
  return this.create({
    type,
    meta,
    content,
    from: objectId(from),
    to: objectId(to)
  });
};
module.exports = mongoose.model("Message", MessageSchema);
