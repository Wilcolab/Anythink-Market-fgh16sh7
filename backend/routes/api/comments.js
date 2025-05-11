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

// add another endpoint for deleting a comment
router.delete("/:slug/comments/:id", async (req, res) => {
  const item = req.item;
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ error: "Comment not found" });
  }
  if (comment.seller.toString() !== req.payload.id) {
    return res.status(403).json({ error: "You do not have permission to delete this comment" });
  }
  await comment.remove();
  item.comments.pull(comment._id);
  await item.save();
  return res.json({ comment: comment.toJSONFor(req.payload) });
}
);