// index.js
const { ApolloServer, gql, AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const SECRET = 'SOLOMON_AMAZING';
const typeDefs = gql`
  type User {
    id: ID!
    type: String!
    token: String!
  }
  type ContactInfo {
    id: ID!
    detail: String!
    isDefault: Boolean!
    }

   type AddressInfo {
    id: ID!
    detail: String!
    detail2: String!
    isDefault: Boolean!
    }

    type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    middleName: String!
    birthDate: String!
    gender: String!
    maritalStatus: String!
    position: String!
    dateHired: String!
    contacts: [ContactInfo!]!
    addresses: [AddressInfo!]!
  }
  type Query {
    employees: [Employee]
    employee(id: ID!): Employee
  }

  type Mutation {
    addEmployee(firstName: String!, lastName: String!, middleName: String!, birthDate: String!, gender: String!, maritalStatus: String!, position: String!, dateHired: String!): Employee
    updateEmployee(id: ID!, firstName: String!, lastName: String!, middleName: String!, birthDate: String!, gender: String!, maritalStatus: String!, position: String!, dateHired: String!): Employee
    deleteEmployee(id: ID!): Boolean
    login(username: String!, password: String!): User
    addContactToEmployee(employeeId: ID!, detail: String!, isDefault: Boolean!): ContactInfo
    updateContact(employeeId: ID!, contactId: ID!, detail: String!, isDefault: Boolean!): ContactInfo
    deleteContact(employeeId: ID!, contactId: ID!): Boolean
    addAddressToEmployee(employeeId: ID!, detail: String!, detail2: String!, isDefault: Boolean!): AddressInfo
    updateAddress(employeeId: ID!, addressId: ID!, detail: String!, isDefault: Boolean!): AddressInfo
    deleteAddress(employeeId: ID!, addressId: ID!): Boolean
  }
`;

 
const employees = [];

const firstNames = ['Solomon', 'Aria', 'Lucas', 'Ella', 'Mason', 'Ava', 'Liam', 'Mia', 'Noah', 'Amelia', 'Oliver', 'Harper', 'Ethan', 'Evelyn', 'Sebastian', 'Abigail', 'Caleb', 'Ella', 'Logan', 'Scarlett', 'Benjamin', 'Grace', 'Daniel', 'Lily', 'Owen', 'Riley', 'Jackson', 'Zoe', 'Wyatt', 'Lillian'];

const lastNames = ['Monotilla', 'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez'];

const middleNames = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const genders = ['male', 'female'];
const maritalStatuses = ['single', 'married', 'divorced', 'widowed'];
const positions = ['developer', 'designer', 'manager', 'analyst', 'engineer'];

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

for (let i = 1; i <= 30; i++) {
    const employee = {
        id: i.toString(),
        firstName: getRandomElement(firstNames),
        lastName: getRandomElement(lastNames),
        middleName: getRandomElement(middleNames),
        birthDate: `19${85 + (i % 15)}-08-31`,
        gender: getRandomElement(genders),
        maritalStatus: getRandomElement(maritalStatuses),
        position: getRandomElement(positions),
        dateHired: `20${10 + (i % 10)}-08-31`
    };
    employees.push(employee);
}



const users = [
    { id: '1', username: 'admin', password: 'admin', type: 'Admin' },
    { id: '2', username: 'standard', password: 'standard', type: 'Standard' }
];


const resolvers = {
    Query: {
        employees: () => employees,
        employee: (_, { id }) => employees.find(emp => emp.id === id),
    },
    Mutation: {
        addEmployee: (_, { firstName, lastName, middleName, birthDate,gender,maritalStatus,position,dateHired }) => {
            const newEmployee = { id: Date.now().toString(), firstName, lastName, middleName, birthDate, gender, maritalStatus, position, dateHired, contacts: [], addresses: []};
            employees.push(newEmployee);
            return newEmployee;
        },
        updateEmployee: (_, { id, firstName, lastName, middleName, birthDate,gender,maritalStatus,position,dateHired }) => {
            const index = employees.findIndex(emp => emp.id === id);
            if (index !== -1) {
                employees[index] = { id, firstName, lastName, middleName, birthDate,gender,maritalStatus,position,dateHired};
                return employees[index];
            }
            return null;
        },
        deleteEmployee: (_, { id }) => {
            const index = employees.findIndex(emp => emp.id === id);
            if (index !== -1) {
                employees.splice(index, 1);
                return true;
            }
            return false;
        },
        login: (_, { username, password }) => {
            const user = users.find(u => u.username === username && u.password === password);
            if (!user) throw new AuthenticationError('Invalid credentials');

            const token = jwt.sign({ id: user.id, type: user.type }, SECRET);
            return { ...user, token };
        },

    addContactToEmployee: (_, { employeeId, detail, isDefault }) => {
        const employee = employees.find(emp => emp.id === employeeId);
        if (!employee) throw new Error('Employee not found');

        const newContact = { id: Date.now().toString(), detail, isDefault };
        if (isDefault) {
            employee.contacts.forEach(contact => contact.isDefault = false);
        }
        employee.contacts.push(newContact);
        return newContact;
    },
    
 

    addAddressToEmployee: (_, { employeeId, detail, detail2, isDefault }) => {
        const employee = employees.find(emp => emp.id === employeeId);
        if (!employee) throw new Error('Employee not found');

        const newAddress = { id: Date.now().toString(), detail, detail2, isDefault };
        if (isDefault) {
            employee.addresses.forEach(address => address.isDefault = false);
        }
        employee.addresses.push(newAddress);
        return newAddress;
    },
    
    }
}


const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
