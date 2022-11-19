// There are 3 aspects of the MVC pattern
// Models, Views and Controllers
// Views are the ejs templates we've created which serve as the visual part of out code.
// Models are the database logic we use to fetch data from a database.
// Controllers are the routes we use to connect Models with views
// But right now, we've created the Database models inside the routes folder.
// Therefor, we need to outsource those Database to a different file.
// We can outsource those models to this post.js file in the Models folder.

// Classes will be very useful when we create modules as classes serve as blueprints.
// Because we wanna implement a blueprint of a post that describes the data, functions
// that should be useable on a post.

const db = require("../data/database");

class Post {
  constructor(title, content, id) {
    this.title = title;
    // this. refers to the newly created object based on this blueprint.
    // Then we can add properties and assign them the values like shown above,
    this.content = content;
    this.id = id;
    // id might be undefined if no id is provided. (If it's a new post. Not an update to a already existing post.)
  }

  async save() {
    const result = await db.getDb().collection("posts").insertOne({
      title: this.title,
      content: this.content,
    });

    return result;
  }
  // This is how we add methods inside classes
}
// The constructor function contains code that should be executed whenever a new object is created.
// We need to use upper case letters when we name classes.

module.exports = Post;
