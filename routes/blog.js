const express = require("express");

// const mongodb = require("mongodb");
// const db = require("../data/database");
// const ObjectId = mongodb.ObjectId;
// We can get rid of this three now as we've moved them to the post.js file.

const Post = require("../models/post");
// This is how we export the post.js file
// We need to name this on uppercase letters as we export classes from this files.

const router = express.Router();

router.get("/", function (req, res) {
  res.render("welcome", { csrfToken: req.csrfToken() });
});

router.get("/admin", async function (req, res) {
  if (!res.locals.isAuth) {
    return res.status(401).render("401");
  }

  // const posts = await db.getDb().collection("posts").find().toArray();
  // We can move this line to the fetchAll() static method on post.js modules files.
  const posts = await Post.fetchAll();
  // We called save and delete on existing post objects.
  // We first created a post and called save on that created post.
  // But here, we're calling fetchAll directly on the class itself.
  // We've done this by using a static method we defined on the class on the post.js file.

  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      title: "",
      content: "",
    };
  }

  req.session.inputData = null;

  res.render("admin", {
    posts: posts,
    inputData: sessionInputData,
    csrfToken: req.csrfToken(),
  });
});

router.post("/posts", async function (req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  if (
    !enteredTitle ||
    !enteredContent ||
    enteredTitle.trim() === "" ||
    enteredContent.trim() === ""
  ) {
    req.session.inputData = {
      hasError: true,
      message: "Invalid input - please check your data.",
      title: enteredTitle,
      content: enteredContent,
    };

    res.redirect("/admin");
    return; // or return res.redirect('/admin'); => Has the same effect
  }

  // const newPost = {
  //   title: enteredTitle,
  //   content: enteredContent,
  // };

  // await db.getDb().collection('posts').insertOne(newPost);
  // We can now move this logic into the post.js file in modules folder.

  const post = new Post(enteredTitle, enteredContent);
  // This is how we create an object based on a class blueprint.
  // enteredTitle and enteredContent are the parameters we pass to the constructor on Post class.
  // Actually we don't pass a parameter for the id because we create a new post here.
  // But that will automatically set to null.
  await post.save();
  // This will trigger the save method of the Post class on the post.js file
  // We should only redirect after the post was saved. So we need to await here.

  res.redirect("/admin");
});

router.get("/posts/:id/edit", async function (req, res) {
  // const postId = new ObjectId(req.params.id);
  // const post = await db.getDb().collection("posts").findOne({ _id: postId });
  // We can move this code to the fetch() method on the Post class of post.js file.

  const post = new Post(null, null, req.params.id);
  await post.fetch();
  // We can trigger the fetch() function inside the post like this.

  // if (!post) {
  //   return res.render("404"); // 404.ejs is missing at this point - it will be added later!
  // }
  // This won't valid anymore because there will always be a post now.
  // So instead we wanna check whether post.title or post.content is missing.
  if (!post.title || !post.content) {
    return res.render("404");
  }

  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      title: post.title,
      content: post.content,
    };
  }

  req.session.inputData = null;

  res.render("single-post", {
    post: post,
    inputData: sessionInputData,
    csrfToken: req.csrfToken(),
  });
});

router.post("/posts/:id/edit", async function (req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;
  // const postId = new ObjectId(req.params.id);
  // Now this part will be done on the post.js file.

  if (
    !enteredTitle ||
    !enteredContent ||
    enteredTitle.trim() === "" ||
    enteredContent.trim() === ""
  ) {
    req.session.inputData = {
      hasError: true,
      message: "Invalid input - please check your data.",
      title: enteredTitle,
      content: enteredContent,
    };

    res.redirect(`/posts/${req.params.id}/edit`);
    return;
  }

  // await db
  //   .getDb()
  //   .collection("posts")
  //   .updateOne(
  //     { _id: postId },
  //     { $set: { title: enteredTitle, content: enteredContent } }
  //   );

  const post = new Post(enteredTitle, enteredContent, req.params.id);
  await post.save();
  // This is how we update the posts based on the Post class we've created.

  res.redirect("/admin");
});

router.post("/posts/:id/delete", async function (req, res) {
  // const postId = new ObjectId(req.params.id);
  // await db.getDb().collection("posts").deleteOne({ _id: postId });
  // We need to outsource this code to the post.js file.

  const post = new Post(null, null, req.params.id);
  // This will pass null to title and content as we don't need them.
  await post.delete();

  res.redirect("/admin");
});

module.exports = router;
