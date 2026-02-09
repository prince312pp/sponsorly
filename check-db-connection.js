const { MongoClient } = require('mongodb');

async function checkDatabaseConnection() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('✓ Connected to MongoDB successfully\n');

        // List all databases
        const adminDb = client.db().admin();
        const dbs = await adminDb.listDatabases();

        console.log('Available databases:');
        dbs.databases.forEach(db => {
            console.log(`  - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
        });

        // Check sponsorly database
        const database = client.db('sponsorly');
        const collections = await database.listCollections().toArray();

        console.log('\nCollections in "sponsorly" database:');
        if (collections.length === 0) {
            console.log('  (No collections found)');
        } else {
            for (const collection of collections) {
                const coll = database.collection(collection.name);
                const count = await coll.countDocuments();
                console.log(`  - ${collection.name}: ${count} documents`);
            }
        }

        // Count users specifically
        const users = database.collection('users');
        const userCount = await users.countDocuments();
        console.log(`\nTotal users in database: ${userCount}`);

        if (userCount > 0) {
            console.log('\nFirst 3 users:');
            const sampleUsers = await users.find({}).limit(3).toArray();
            sampleUsers.forEach(user => {
                console.log(`  - ${user.email} (${user.role})`);
            });
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

checkDatabaseConnection();
