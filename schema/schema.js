import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} from 'graphql'
import axios from 'axios'

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                    .then(response => response.data)
            }
        }
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        isManager: { type: GraphQLBoolean },
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    .then(response => response.data)
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(response => response.data)
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                    .then(resp => resp.data);
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                company: { type: GraphQLString, defaultValue: 1 },
                isManager: { type: GraphQLBoolean, defaultValue: false }
            },
            resolve(parentValue, { firstName, age, company, isManager }) { //destructed from 'args' argument
                return axios.post(`http://localhost:3000/users`, { firstName, age, company, isManager })
                    .then(resp => resp.data);
            }
        },
        addCompany: {
            type: CompanyType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parentValue, { name, description }) { //destructed from 'args' argument
                return axios.post(`http://localhost:3000/companies`, { name, description })
                    .then(resp => resp.data);
            }
        },
        deleteUser: {
            type: UserType,
            args: { id: { type: new GraphQLNonNull(GraphQLString) } },
            resolve(parentValue, { id }) { //destructed from 'args' argument
                return axios.delete(`http://localhost:3000/users/${id}`)
                    .then(resp => resp.data);
            }
        },
        deleteCompany: {
            type: CompanyType,
            args: { id: { type: new GraphQLNonNull(GraphQLString) } },
            resolve(parentValue, { id }) { //destructed from 'args' argument
                return axios.delete(`http://localhost:3000/companies/${id}`)
                    .then(resp => resp.data);
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                firstName: { type: GraphQLString },
                age: { type: GraphQLInt },
                company: { type: GraphQLString, defaultValue: 1 },
                isManager: { type: GraphQLBoolean, defaultValue: false }
            },
            resolve(parentValue, { id, firstName, age, company, isManager }) { //destructed from 'args' argument
                return axios.put(`http://localhost:3000/users/${id}`, { firstName, age, company, isManager })
                    .then(resp => resp.data);
            }
        },
        updateCompany: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: GraphQLString },
                description: { type: GraphQLString},
            },
            resolve(parentValue, { id, name, description}) { //destructed from 'args' argument
                return axios.put(`http://localhost:3000/companies/${id}`, { name, description })
                    .then(resp => resp.data);
            }
        },
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})