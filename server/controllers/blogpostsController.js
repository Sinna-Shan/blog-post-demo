const {
  collection,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
} = require("firebase/firestore");
const { db } = require("../config/firebase");

exports.getAllPosts = async (req, res) => {
  const querySnapshot = await getDocs(collection(db, "posts"));
  const data = [];

  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });

  res.status(200).json(data);
};

exports.createPost = async (req, res) => {
  const { title, subtitle, description } = req.body;

  let imageUrl;
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req?.file?.filename
    }`;
  } else {
    imageUrl = null;
  }

  const docRef = await addDoc(collection(db, "posts"), {
    title,
    subtitle,
    description,
    imageUrl,
  });
  res.status(200).json({
    message: `post created successfully with ${docRef.id}`,
  });
};

exports.getPost = async (req, res) => {
  const id = req.params.id;

  const post = await getDoc(doc(db, "posts", id));
  if (!post.exists) {
    return res.status(404).json({ message: "post not found" });
  }
  res.status(200).json({ id: post.id, ...post.data() });
};

exports.updatePost = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  let imageUrl;
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req?.file?.filename
    }`;
  } else {
    imageUrl = null;
  }

  await updateDoc(
    doc(db, "posts", id),
    imageUrl ? { imageUrl, ...data } : data
  );

  const post = await getDoc(doc(db, "posts", id));

  if (!post.exists()) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.status(200).json({ id: post.id, ...post.data() });
};

exports.deletePost = async (req, res) => {
  const id = req.params.id;
  const post = await deleteDoc(doc(db, "posts", id));

  res.status(200).json(post);
};
