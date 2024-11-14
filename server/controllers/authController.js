const { doc, getDoc, collection, setDoc } = require("firebase/firestore");
const { db } = require("../config/firebase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const { email, password } = req.body;

  try {
    const userRef = doc(db, "users", email);
    const user = await getDoc(userRef);

    if (user.exists()) {
      return res.status(400).json({
        message: "User already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await setDoc(userRef, {
      email: email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { email: email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRef = doc(db, "users", email);
    const user = await getDoc(userRef);

    if (!user.exists()) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.data().password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { email: user.data().email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Send token as response
    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
