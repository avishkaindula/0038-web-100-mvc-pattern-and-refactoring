function postIsValid(title, content) {
  return (
    title &&
    content &&
    title.trim() !== "" &&
    content.trim() !== ""
  );
}
//   !enteredTitle ||
//   !enteredContent ||
//   enteredTitle.trim() === "" ||
//   enteredContent.trim() === ""
// We've inverted this logic.
// title and content will be provided from the outside.

module.exports = {
  postIsValid: postIsValid,
}

