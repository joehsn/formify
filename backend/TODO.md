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
- [x] Update the form schema to have a `formId` instead of `id` field.
    > I just override the default `_id`.
- [x] Update the README.md file to include the new changes.
- [x] Update the password length in the User schema to be a minimum of 8 characters.
- [x] Add Rate Limiting to the application.
