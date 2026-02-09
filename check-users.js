const { MongoClient } = require('mongodb');

async function checkUsers() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const database = client.db('sponsorly');
        const users = database.collection('users');

        // Get all users
        const allUsers = await users.find({}).toArray();
        console.log(`\nTotal users in database: ${allUsers.length}\n`);

        allUsers.forEach(user => {
            console.log(`Email: ${user.email}`);
            console.log(`Name: ${user.firstName} ${user.lastName}`);
            console.log(`Role: ${user.role}`);
            console.log(`Location: ${user.location === undefined ? 'UNDEFINED' : user.location === null ? 'NULL' : user.location === '' ? 'EMPTY STRING' : user.location}`);
            console.log(`Company Name: ${user.companyName === undefined ? 'UNDEFINED' : user.companyName === null ? 'NULL' : user.companyName === '' ? 'EMPTY STRING' : user.companyName}`);
            console.log(`Budget: ${user.budget === undefined ? 'UNDEFINED' : user.budget === null ? 'NULL' : user.budget === '' ? 'EMPTY STRING' : user.budget}`);
            console.log(`Employees: ${user.noOfEmployees === undefined ? 'UNDEFINED' : user.noOfEmployees === null ? 'NULL' : user.noOfEmployees === '' ? 'EMPTY STRING' : user.noOfEmployees}`);
            console.log('---');
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

checkUsers();
