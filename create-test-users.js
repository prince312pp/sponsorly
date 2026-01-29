require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function createTestUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB (Database: sponsorly)...');

        const UserSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
        const User = mongoose.model('User', UserSchema);

        const password = await bcrypt.hash('password123', 10);

        const testUsers = [
            // Creators
            {
                firstName: 'Alice',
                lastName: 'Creator',
                email: 'alice@creator.com',
                password,
                role: 'creator',
                verified: true,
                platform: 'YouTube',
                handle: '@alicecreates',
                followers: 50000,
                bio: 'Passionate about tech reviews and lifestyle vlogs.',
                location: 'San Francisco, CA'
            },
            {
                firstName: 'Bob',
                lastName: 'Vlogger',
                email: 'bob@creator.com',
                password,
                role: 'creator',
                verified: true,
                platform: 'Instagram',
                handle: '@bobclicks',
                followers: 120000,
                bio: 'Travel photographer and visual storyteller.',
                location: 'New York, NY'
            },
            // Sponsors
            {
                firstName: 'Charlie',
                lastName: 'Sponsor',
                email: 'charlie@sponsor.com',
                password,
                role: 'sponsor',
                verified: true,
                companyName: 'TechGear',
                budget: '$5,000 - $10,000',
                bio: 'We provide high-quality gear for tech enthusiasts.',
                location: 'Austin, TX'
            },
            {
                firstName: 'Diana',
                lastName: 'Marketer',
                email: 'diana@sponsor.com',
                password,
                role: 'sponsor',
                verified: true,
                companyName: 'PureFuel',
                budget: '$1,000 - $5,000',
                bio: 'Organic energy drinks for creators on the go.',
                location: 'Los Angeles, CA'
            }
        ];

        for (const userData of testUsers) {
            const exists = await User.findOne({ email: userData.email });
            if (!exists) {
                const user = new User({
                    ...userData,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                await user.save();
                console.log(`Created ${userData.role}: ${userData.email}`);
            } else {
                console.log(`User already exists: ${userData.email}`);
            }
        }

        console.log('\nSUCCESS: Test users created successfully!');
        console.log('Default password for all: password123');

    } catch (err) {
        console.error('Failed to create test users:', err);
    } finally {
        await mongoose.disconnect();
    }
}

createTestUsers();
