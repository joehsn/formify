# Backend's TODOs

- [ ] Gaurd the create form controller from creating a form with the same _id_.
- [ ] Better handling of errors in the application.
- [x] intsall and use winston.
- [x] Configure CORS in the application.
- [ ] Setup and configure redis
- [ ] Make the `options` field required only when the type property of the field is `radio`, `checkbox`, or `dropdown` and remove it if the type property is `text`, `email`, `number` or `date`.
  in [form.ts](./src/lib/schemas/form.ts).
- [x] Configure PassportJS properly to respond in cases of _User does not exists_ or _Invalid credinatials (Password mismatched)_.
- [ ] Implement User update and delete functionalities.
- [ ] Implement Response update and delete functionalities.
- [ ] Write tests for the api.
- [ ] Update the form schema to have a `formId` instead of `id` field.
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
