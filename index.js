const express = require("express");
const cors = require("cors");
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

//import body parser
const bodyParser = require('body-parser')
//import routes
const postsRouter = require('./routes/posts');
const authRouter = require('./routes/auth');
const verifyToken = require('./routes/verifyToken');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/api/posts', postsRouter); // use route posts di Express
app.use('/api/auth', authRouter); // use route posts di Express
app.use('/api/verifyToken', verifyToken); // use route posts di Express

app.get("/", async (req, res) => {
  res.send("welcome on in.");
});

// app.get("/authors", async (req, res) => {
//   const authors = await prisma.author.findMany();
//   res.json(authors);
// });

// app.get("/books/:author_id", async (req, res) => {
//   const authorId = parseInt(req.params.author_id);
//   const books = await prisma.book.findMany({
//     where: {
//       authorId: authorId
//     }
//   });
//   res.json(books);
// });

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});