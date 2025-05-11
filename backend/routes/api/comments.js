const router = require("express").Router();
const mongoose = require("mongoose");
const Comment = mongoose.model("Comment");

module.exports = router;


router.get("/:slug/comments", async (req, res) => {
  const item = req.item;
  await item.populate("comments.seller");
  return res.json({ comments: item.comments });
}
);

// add another endpoint for creating a comment
router.post("/:slug/comments", async (req, res) => {
  const item = req.item;
  const comment = new Comment(req.body.comment);
  comment.seller = req.payload.id;
  comment.item = item._id;
  await comment.save();
  item.comments.push(comment);
  await item.save();
  return res.json({ comment: comment.toJSONFor(req.payload) });
}
);