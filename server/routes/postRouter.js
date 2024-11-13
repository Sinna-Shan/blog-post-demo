const router = require("express").Router();
const upload = require("../config/multer");
const authMiddleware = require("../middleware/authMiddleware");

const {
  getAllPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} = require("../controllers/blogpostsController");

router
  .route("/")
  .get(authMiddleware, getAllPosts)
  .post(authMiddleware, upload.single("file"), createPost);
router
  .route("/:id")
  .get(authMiddleware, getPost)
  .patch(authMiddleware, upload.single("file"), updatePost)
  .delete(authMiddleware, deletePost);

module.exports = router;
