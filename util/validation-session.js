// We can move the session validation logic in post-controllers.js file into this.

function getSessionErrorData(req, defaultValues) {
  let sessionInputData = req.session.inputData;
  // We need to pass req into this function in order it to work as req is required to
  // create sessionInputData file.

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      // title: "",
      // content: "",
      ...defaultValues
      // We need the defaultValues spread operator to pre-populate title and content
      // on the edit page.
    };
  }

  req.session.inputData = null;

  return sessionInputData;
}

function flashErrorsToSession(req, data, action) {
  req.session.inputData = {
    hasError: true,
    // message: "Invalid input - please check your data.",
    // title: enteredTitle,
    // content: enteredContent,
    // This message, title and content can vary from different errors.
    // Therefor, we don't hard code message, title and content here.
    // Instead, we set a data parameter and set the values for data in the places
    // that require this function to be executed.
    ...data,
    // ...data is a spread operator.
    // Here, we expect data to be an object.
    // So when we use a spread operator on an object it simply takes all the key
    // value pairs in that object and add them as key-value pairs, so as new properties
    // to that object which we use the operator for.
  };

  // action is a function that should be performed after the data was stored in a session.
  req.session.save(action);
  // The save method takes a function that get executed after saving finished.
  // the action method will be taken from the outside of this code.
  // "redirect" is an example for an action that will be set as the action function.
}

module.exports = {
  getSessionErrorData: getSessionErrorData,
  flashErrorsToSession: flashErrorsToSession,
};
