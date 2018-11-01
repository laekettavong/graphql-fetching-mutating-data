import express from 'express'
import expressGraphQL from 'express-graphql'
import schema from './schema/schema'

const app = express()

//add middleware (code that intercepts/modify requests) to express
app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true
}))

app.listen(4000, () => {
    console.log('Listening on port 4000')
})

app.get('/', (req, res) => {
    res.send({ msg: 'Hello World!' })
})

