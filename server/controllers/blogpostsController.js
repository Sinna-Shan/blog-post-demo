const {
  collection,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  orderBy,
  startAfter,
  limit,
} = require("firebase/firestore");
const { db } = require("../config/firebase");

exports.getAllPosts = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    let lastVisibleId = req.query.lastVisibleId || null;

    let postsQuery = collection(db, "posts");

    const allPosts = await getDocs(postsQuery);
    const totalPosts = allPosts.size;

    let paginatedQuery = query(postsQuery, limit(pageSize));

    if (lastVisibleId) {
      const lastVisibleDocRef = doc(db, "posts", lastVisibleId);
      const lastVisibleDoc = await getDoc(lastVisibleDocRef);

      if (lastVisibleDoc.exists()) {
        paginatedQuery = query(
          postsQuery,
          startAfter(lastVisibleDoc),
          limit(pageSize)
        );
      }
    }

    const paginatedDocs = await getDocs(paginatedQuery);

    const posts = [];
    let lastDoc = null;

    paginatedDocs.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
      lastDoc = doc;
    });


    res.status(200).json({
      posts,
      lastVisibleId: lastDoc ? lastDoc.id : null,
      total: totalPosts,
      totalPages: Math.ceil(totalPosts / pageSize),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
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
