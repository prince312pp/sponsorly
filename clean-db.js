require('dotenv').config();
const mongoose = require('mongoose');

async function cleanDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        const UserSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
        const User = mongoose.model('User', UserSchema);

        // Find all users named "Prince" to keep
        const princeUsers = await User.find({ firstName: 'Prince' });
        console.log(`\nFound ${princeUsers.length} user(s) named "Prince" to keep:`);
        princeUsers.forEach(user => {
            console.log(`  - ${user.firstName} ${user.lastName} (${user.email})`);
        });

        // Delete all users except those named "Prince"
        const result = await User.deleteMany({ firstName: { $ne: 'Prince' } });

        console.log(`\n✅ Successfully deleted ${result.deletedCount} users`);
        console.log(`✅ Kept ${princeUsers.length} user(s) named "Prince"`);

        // Show remaining users
        const remainingUsers = await User.find();
        console.log(`\n📊 Total users in database: ${remainingUsers.length}`);

    } catch (err) {
        console.error('❌ Error cleaning database:', err);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

cleanDatabase();
