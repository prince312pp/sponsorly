const { MongoClient } = require('mongodb');

async function clearDatabase() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const database = client.db('sponsorly');
        const users = database.collection('users');

        // Clear all users
        const result = await users.deleteMany({});
        console.log(`✓ Cleared ${result.deletedCount} users from database`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        console.log('Connection closed.');
    }
}

clearDatabase();
