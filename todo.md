# TODO

### Features

- [] Dealing Images and Files in the app.
- [] Implement pagination for foms and responses.
- [] Implement auto save for forms.
- [] Maintain a local copy of the form in the browser and save it to the server every 5 minutes or user save it explicitly.
- [] Implement a feature to share the form with other users.
- [] Add Yes/No field type.
- [] Subtitute the `type` field in the form schema with `fieldType` to avoid conflicts with the `type` keyword in TypeScript.
- [] Subtitute "text" field type with "short-text" field type. also, add "long-text" field type. or "paragraph" field type.
- [] Implement a feature to duplicate a form or a response.
- [] Implement a feature to export the form or response to a PDF, JSON or CSV type.
- [] Implement a feature to import a form or response from a JSON or CSV file.
- [] Implement a feature to send the form or response to the user's email.
- [] Print the form or the response.
- [] Share the form or response on social media.
- [] Implement a preview feature for the form and the response.
- [] Add "Other" option to the radio and checkbox field types.
- [] Add responses count to the form model.
- [] Handle password reset functionality.
- [] Add keep me logged in for 30 days feature.

### Backend

- [] Gaurd the create form controller from creating a form with the same _id_.
- [] Better handling of errors in the application.
- [x] intsall and use winston.
- [x] Configure CORS in the application.
- [] Setup and configure redis
- [] Make the `options` field required only when the type property of the field is `radio`, `checkbox`, or `dropdown` and remove it if the type property is `text`, `email`, `number` or `date`.
  in [form.ts](./src/lib/schemas/form.ts).
- [x] Configure PassportJS properly to respond in cases of _User does not exists_ or _Invalid credinatials (Password mismatched)_.
- [] Implement User update and delete functionalities.
- [] Implement Response update and delete functionalities.
- [] Write tests for the api.
- [] Update the form schema to have a `formId` instead of `id` field.
- [x] Update the README.md file to include the new changes.
- [x] Update the password length in the User schema to be a minimum of 8 characters.
- [x] Add Rate Limiting to the application.

  ```javascript
  import rateLimit from "express-rate-limit";

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
  });

  app.use(limiter);
  ```

### Frontend

- [] Implement toggle password visibility in the login and register forms.
- [x] Implement a Loader component.
- [x] Implement Date picker field component
- [x] Implement Drop-down field component
- [] Auto focus on new fields and options
- [x] Correct the state of user logged in or not in the application.
- [x] Update docment's title on every route change and based on form's title.
- [] Add copy functionality to the app.
- [] Create forgot password page.
