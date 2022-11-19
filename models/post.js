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

const mongodb = require("mongodb");

const db = require("../data/database");

const ObjectId = mongodb.ObjectId;
class Post {
  constructor(title, content, id) {
    this.title = title;
    // this. refers to the newly created object based on this blueprint.
    // Then we can add properties and assign them the values like shown above,
    this.content = content;
    // this.id = id;
    // id might be undefined if no id is provided. (If it's a new post. Not an update to a already existing post.)

    if (id) {
      this.id = new ObjectId(id);
      // The id we're getting is a raw string.
      // Therefor, we need to transform that id to a ObjectId.
      // Only then we can use this.id to perform db queries.
    }
  }

  async save() {
    let result;

    if (this.id) {
      // This if condition will check whether there's a id on the post or not.
      result = await db
        .getDb()
        .collection("posts")
        .updateOne(
          { _id: this.id },
          { $set: { title: this.title, content: this.content } }
        );
    } else {
      result = await db.getDb().collection("posts").insertOne({
        title: this.title,
        content: this.content,
      });
    }

    return result;
  }
  // This is how we add methods inside classes

  // async update() {}
  // We can add a external update method like this.
  // But we know that we only execute update method if there's a post with an id.
  // Therefor, we can check inside the save method that whether there is a id on the post or not
  // and trigger the update post code if there's so.

  async delete() {
    if (!this.id) {
      return;
    }
    const result = await db
      .getDb()
      .collection("posts")
      .deleteOne({ _id: this.id });
    return result;
  }
}
// The constructor function contains code that should be executed whenever a new object is created.
// We need to use upper case letters when we name classes.

module.exports = Post;
