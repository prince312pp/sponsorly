const { MongoClient } = require('mongodb');

async function deleteSpecificUser() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const database = client.db('sponsorly');
        const users = database.collection('users');

        // Delete the specific user
        const email = 'prince.patel3628@asdf.com';
        const result = await users.deleteOne({ email });

        if (result.deletedCount > 0) {
            console.log(`✓ Deleted user: ${email}`);
        } else {
            console.log(`✗ User not found: ${email}`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        console.log('Connection closed.');
    }
}

deleteSpecificUser();
