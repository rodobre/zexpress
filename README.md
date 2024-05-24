## zexpress

### Chainables

Chainable middlewares offer rich TypeScript support for validation, leveraging Zod's strict checks and strong typings:

```ts
chainableRouter
  .pipe(validateProperty(SamplePostSchema, 'body'))
  .post('/', (req, res) =>
    res
      .status(200)
      .send({ ...req.user, id: Math.floor(Math.random() * 1000000) })
  )

chainableRouter
  .pipe(validateProperty(SamplePutSchema, 'params'))
  .pipe(validateProperty(SamplePostSchema, 'body'))
  .put('/:id/', (req, res) => {
    res.status(200).send({ ...req.user, id: req.id })
  })
```

### File-system routing

Routes are automatically resolved to the corresponding directory paths, allowing slugs with `[slug]` whilst maintaining full flexibility.

### Error handling

Internal server errors are automatically handled by the handler wrapper which returns an HTTP 500 status code.
Verbose error messages are available when `NODE_ENV` is set to `development`. On production, only `Internal Server Error` is returned.

### Logging

All route calls will be logged in the console and in the `logs` folder.
This is an example of a generated log file structure:

```sh
total 16
-rw-r--r--  1 tmp  tmp   169 May 24 20:31 access.log
drwxr-xr-x  4 tmp  tmp   128 May 24 20:31 daily
-rw-r--r--  1 tmp  tmp  1249 May 24 20:31 error.log

logs/daily:
total 16
-rw-r--r--  1 tmp  tmp   169 May 24 20:31 2024-05-24-access.log
-rw-r--r--  1 tmp  tmp  1249 May 24 20:31 2024-05-24-error.log
```
