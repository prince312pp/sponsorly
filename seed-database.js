const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const indianCities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'];
const platforms = ['YouTube', 'Instagram', 'Twitter', 'TikTok', 'LinkedIn'];
const audienceReach = ['Local', 'Regional', 'National', 'International'];
const budgets = ['₹50K-₹1L', '₹1L-₹2L', '₹2L-₹10L', '₹10L-₹50L', '₹50L+'];
const teamSizes = ['1-10', '11-50', '51-200', '201-500', '500+'];

const creatorNames = [
    { firstName: 'Priya', lastName: 'Sharma' },
    { firstName: 'Rahul', lastName: 'Verma' },
    { firstName: 'Ananya', lastName: 'Gupta' },
    { firstName: 'Arjun', lastName: 'Reddy' },
    { firstName: 'Sneha', lastName: 'Patel' },
    { firstName: 'Vikram', lastName: 'Singh' },
    { firstName: 'Isha', lastName: 'Mehta' },
    { firstName: 'Rohan', lastName: 'Kumar' },
    { firstName: 'Kavya', lastName: 'Nair' },
    { firstName: 'Aditya', lastName: 'Joshi' },
    { firstName: 'Diya', lastName: 'Kapoor' },
    { firstName: 'Karan', lastName: 'Malhotra' },
    { firstName: 'Riya', lastName: 'Desai' },
    { firstName: 'Siddharth', lastName: 'Iyer' },
    { firstName: 'Meera', lastName: 'Chopra' },
    { firstName: 'Aarav', lastName: 'Agarwal' },
    { firstName: 'Tara', lastName: 'Bose' },
    { firstName: 'Vihaan', lastName: 'Rao' },
    { firstName: 'Zara', lastName: 'Khan' },
    { firstName: 'Ishaan', lastName: 'Pandey' },
    { firstName: 'Anvi', lastName: 'Saxena' },
    { firstName: 'Ayaan', lastName: 'Menon' },
    { firstName: 'Sara', lastName: 'Bhatt' },
    { firstName: 'Reyansh', lastName: 'Shetty' },
    { firstName: 'Myra', lastName: 'Pillai' }
];

const sponsorNames = [
    { firstName: 'Amit', lastName: 'Shah' },
    { firstName: 'Neha', lastName: 'Bansal' },
    { firstName: 'Rajesh', lastName: 'Khanna' },
    { firstName: 'Pooja', lastName: 'Sinha' },
    { firstName: 'Manish', lastName: 'Tiwari' },
    { firstName: 'Deepa', lastName: 'Yadav' },
    { firstName: 'Suresh', lastName: 'Reddy' },
    { firstName: 'Anjali', lastName: 'Kulkarni' },
    { firstName: 'Vivek', lastName: 'Mishra' },
    { firstName: 'Shruti', lastName: 'Jain' },
    { firstName: 'Nikhil', lastName: 'Dubey' },
    { firstName: 'Preeti', lastName: 'Chauhan' },
    { firstName: 'Sandeep', lastName: 'Arora' },
    { firstName: 'Kavita', lastName: 'Bhatia' },
    { firstName: 'Ashok', lastName: 'Tripathi' },
    { firstName: 'Sunita', lastName: 'Goyal' },
    { firstName: 'Prakash', lastName: 'Nambiar' },
    { firstName: 'Rekha', lastName: 'Dutta' },
    { firstName: 'Manoj', lastName: 'Hegde' },
    { firstName: 'Geeta', lastName: 'Subramanian' },
    { firstName: 'Ravi', lastName: 'Krishnan' },
    { firstName: 'Lakshmi', lastName: 'Venkat' },
    { firstName: 'Harish', lastName: 'Balaji' },
    { firstName: 'Usha', lastName: 'Ramesh' },
    { firstName: 'Dinesh', lastName: 'Mohan' }
];

const companies = [
    'TechVista Solutions', 'BrandCraft India', 'Digital Nexus', 'Innovate Hub',
    'MarketPro Ventures', 'Creative Minds Co', 'Growth Catalyst', 'Brand Builders',
    'Social Spark Agency', 'Influence Network', 'Content Kings', 'Viral Ventures',
    'Engage Media', 'Trend Setters Inc', 'Impact Marketing', 'Vision Brands',
    'Momentum Digital', 'Amplify Solutions', 'Connect Hub', 'Reach Media',
    'Boost Brands', 'Prime Marketing', 'Elite Ventures', 'Apex Digital',
    'Summit Brands'
];

const bios = [
    'Passionate about creating engaging content and building meaningful connections.',
    'Digital storyteller with a love for authentic brand partnerships.',
    'Helping brands connect with their audience through creative campaigns.',
    'Content creator focused on lifestyle, tech, and travel.',
    'Building a community of engaged followers through quality content.',
    'Marketing professional with expertise in influencer collaborations.',
    'Creating impactful content that resonates with audiences.',
    'Brand strategist helping companies grow their digital presence.',
    'Experienced in running successful influencer marketing campaigns.',
    'Dedicated to producing high-quality content for brands and audiences.'
];

async function seedDatabase() {
    const uri = 'mongodb+srv://princepatel3628_db_user:Prince3628@cluster0.tzu8m7h.mongodb.net/sponsorly';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const database = client.db('sponsorly');
        const users = database.collection('users');

        // Clear existing users
        const deleteResult = await users.deleteMany({});
        console.log(`Cleared ${deleteResult.deletedCount} existing users\n`);

        const hashedPassword = await bcrypt.hash('password123', 10);
        const testUsers = [];

        // Create 25 creators
        for (let i = 0; i < 25; i++) {
            const name = creatorNames[i];
            const platform = platforms[Math.floor(Math.random() * platforms.length)];
            const followers = Math.floor(Math.random() * 900000) + 10000;
            const city = indianCities[Math.floor(Math.random() * indianCities.length)];

            testUsers.push({
                firstName: name.firstName,
                lastName: name.lastName,
                email: `${name.firstName.toLowerCase()}.${name.lastName.toLowerCase()}@creator.com`,
                password: hashedPassword,
                role: 'creator',
                verified: true,
                bio: bios[Math.floor(Math.random() * bios.length)],
                location: `${city}, India`,
                platform: platform,
                handle: `@${name.firstName.toLowerCase()}${name.lastName.toLowerCase()}`,
                followers: followers,
                audienceReach: audienceReach[Math.floor(Math.random() * audienceReach.length)],
                dob: new Date(1990 + Math.floor(Math.random() * 15), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
                links: [
                    { label: platform, url: `https://${platform.toLowerCase()}.com/@${name.firstName.toLowerCase()}` }
                ]
            });
        }

        // Create 25 sponsors
        for (let i = 0; i < 25; i++) {
            const name = sponsorNames[i];
            const company = companies[i];
            const city = indianCities[Math.floor(Math.random() * indianCities.length)];

            testUsers.push({
                firstName: name.firstName,
                lastName: name.lastName,
                email: `${name.firstName.toLowerCase()}.${name.lastName.toLowerCase()}@sponsor.com`,
                password: hashedPassword,
                role: 'sponsor',
                verified: true,
                bio: bios[Math.floor(Math.random() * bios.length)],
                location: `${city}, India`,
                companyName: company,
                noOfEmployees: teamSizes[Math.floor(Math.random() * teamSizes.length)],
                budget: budgets[Math.floor(Math.random() * budgets.length)],
                requirements: 'Looking for authentic creators to collaborate with our brand.',
                links: [
                    { label: 'Website', url: `https://${company.toLowerCase().replace(/\s+/g, '')}.com` }
                ]
            });
        }

        // Insert all users
        const result = await users.insertMany(testUsers);
        console.log(`✓ Created ${result.insertedCount} test users successfully!\n`);

        console.log('Summary:');
        console.log(`- 25 Creators (password: password123)`);
        console.log(`- 25 Sponsors (password: password123)`);
        console.log(`\nSample logins:`);
        console.log(`Creator: priya.sharma@creator.com`);
        console.log(`Sponsor: amit.shah@sponsor.com`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        console.log('\nConnection closed.');
    }
}

seedDatabase();
