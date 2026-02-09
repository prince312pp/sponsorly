const { MongoClient } = require('mongodb');

async function deleteUsersWithoutLocation() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const database = client.db('sponsorly');
        const users = database.collection('users');

        // Find users without location field
        const usersToDelete = await users.find({
            $or: [
                { location: { $exists: false } },
                { location: null },
                { location: '' }
            ]
        }).toArray();

        console.log(`Found ${usersToDelete.length} users without location field:`);
        usersToDelete.forEach(user => {
            console.log(`- ${user.email} (${user.firstName} ${user.lastName})`);
        });

        if (usersToDelete.length > 0) {
            const result = await users.deleteMany({
                $or: [
                    { location: { $exists: false } },
                    { location: null },
                    { location: '' }
                ]
            });
            console.log(`\nDeleted ${result.deletedCount} users successfully.`);
        } else {
            console.log('\nNo users to delete.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        console.log('Connection closed.');
    }
}

deleteUsersWithoutLocation();
