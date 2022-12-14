// We only have one post controller.
// All the different functions we need for the different routes will be called controller actions.
// Route handler functions that are on the blog.js routes file, which we pass as second parameter values
// could be considers as controllers.

const Post = require("../models/post");
// As getAdmin relies on Post, we need to import it like this.

const validationSession = require("../util/validation-session");
const validation = require("../util/validation");

function getHome(req, res) {
  // res.render("welcome", { csrfToken: req.csrfToken() });
  res.render("welcome");
}

async function getAdmin(req, res) {
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

  // let sessionInputData = req.session.inputData;
  // if (!sessionInputData) {
  //   sessionInputData = {
  //     hasError: false,
  //     title: "",
  //     content: "",
  //   };
  // }
  // req.session.inputData = null;
  // We can move this logic to the validation-session.js file.

  // This is how we import the above logic back into post-controllers.js file.
  sessionErrorData = validationSession.getSessionErrorData(req, {
    title: "",
    content: "",
    // These are the values needed for the ...defaultValues spread operator on the
    // getSessionErrorData.
  });

  res.render("admin", {
    posts: posts,
    inputData: sessionErrorData,
    // csrfToken: req.csrfToken(),
    // We can remove csrfToken from here as we now add them through res.locals
  });
}

async function createPost(req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  if (
    // !enteredTitle ||
    // !enteredContent ||
    // enteredTitle.trim() === "" ||
    // enteredContent.trim() === ""
    !validation.postIsValid(enteredTitle, enteredContent)
  ) {
    validationSession.flashErrorsToSession(
      req,
      {
        message: "Invalid input - please check your data.",
        title: enteredTitle,
        content: enteredContent,
      },
      function () {
        res.redirect("/admin");
      }
    );

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
}

async function getSinglePost(req, res) {
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

  // let sessionInputData = req.session.inputData;
  // if (!sessionInputData) {
  //   sessionInputData = {
  //     hasError: false,
  //     title: post.title,
  //     content: post.content,
  //   };
  // }
  // req.session.inputData = null;

  sessionErrorData = validationSession.getSessionErrorData(req, {
    title: post.title,
    content: post.content,
    // These are the values needed for the ...defaultValues spread operator on the
    // getSessionErrorData.
  });

  res.render("single-post", {
    post: post,
    inputData: sessionErrorData,
    // csrfToken: req.csrfToken(),
  });
}

async function updatePost(req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;
  // const postId = new ObjectId(req.params.id);
  // Now this part will be done on the post.js file.

  if (
    // !enteredTitle ||
    // !enteredContent ||
    // enteredTitle.trim() === "" ||
    // enteredContent.trim() === ""
    // We can move this to validation.js file
    !validation.postIsValid(enteredTitle, enteredContent)
    // Because we wanna check whether this is "NOT" valid, we need to add ! in front of this code.
    // enteredTitle and enteredContent are the values needed for title and content parameters of
    // postIsValid function.
  ) {
    // req.session.inputData = {
    //   hasError: true,
    //   message: "Invalid input - please check your data.",
    //   title: enteredTitle,
    //   content: enteredContent,
    // };
    // We can move this logic also to the validation-session.js file.
    validationSession.flashErrorsToSession(
      req,
      {
        message: "Invalid input - please check your data.",
        title: enteredTitle,
        content: enteredContent,
        // This are the key-value pairs that are passed to the ...data spread operator
        // on the flashErrorsToSession function on validation-session.js
      },
      function () {
        res.redirect(`/posts/${req.params.id}/edit`);
        // This is the function that is passed to the action parameter
        // on the flashErrorsToSession function on validation-session.js
      }
    );

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
}

async function deletePost(req, res) {
  // const postId = new ObjectId(req.params.id);
  // await db.getDb().collection("posts").deleteOne({ _id: postId });
  // We need to outsource this code to the post.js file.

  const post = new Post(null, null, req.params.id);
  // This will pass null to title and content as we don't need them.
  await post.delete();

  res.redirect("/admin");
}

module.exports = {
  getHome: getHome,
  getAdmin: getAdmin,
  createPost: createPost,
  getSinglePost: getSinglePost,
  updatePost: updatePost,
  deletePost: deletePost,
};
