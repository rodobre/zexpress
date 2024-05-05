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
