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
            // Creators (12 users)
            {
                firstName: 'Maya',
                lastName: 'Rodriguez',
                email: 'maya.rodriguez@creator.com',
                password,
                role: 'creator',
                verified: true,
                platform: 'YouTube',
                handle: '@mayatech',
                followers: 245000,
                dob: '1996-03-15',
                audienceReach: '100k-500k',
                bio: 'Tech reviewer and software engineer sharing coding tutorials and gadget reviews. Passionate about making tech accessible to everyone.',
                location: 'San Francisco, CA',
                links: [
                    { label: 'Website', url: 'https://mayarodriguez.dev' },
                    { label: 'GitHub', url: 'https://github.com/mayatech' },
                    { label: 'Twitter', url: 'https://twitter.com/mayatech' }
                ]
            },
            {
                firstName: 'Jordan',
                lastName: 'Chen',
                email: 'jordan.chen@creator.com',
                password,
                role: 'creator',
                verified: true,
                platform: 'Instagram',
                handle: '@jordanfitness',
                followers: 180000,
                dob: '1994-07-22',
                audienceReach: '100k-500k',
                bio: 'Certified personal trainer and nutrition coach. Helping people transform their lives through fitness and healthy living.',
                location: 'Los Angeles, CA',
                links: [
                    { label: 'Website', url: 'https://jordanfitness.com' },
                    { label: 'Instagram', url: 'https://instagram.com/jordanfitness' },
                    { label: 'Coaching', url: 'https://coachwithjordan.com' }
                ]
            },
            {
                firstName: 'Aisha',
                lastName: 'Patel',
                email: 'aisha.patel@creator.com',
                password,
                role: 'creator',
                verified: true,
                platform: 'TikTok',
                handle: '@aishacooks',
                followers: 520000,
                dob: '1998-11-08',
                audienceReach: '500k-1M',
                bio: 'Food blogger and recipe developer. Bringing authentic Indian cuisine to your kitchen with quick and easy recipes.',
                location: 'Mumbai, India',
                links: [
                    { label: 'Recipe Blog', url: 'https://aishacooks.com' },
                    { label: 'TikTok', url: 'https://tiktok.com/@aishacooks' },
                    { label: 'Cookbook', url: 'https://shop.aishacooks.com' }
                ]
            },
            {
                firstName: 'Marcus',
                lastName: 'Williams',
                email: 'marcus.williams@creator.com',
                password,
                role: 'creator',
                verified: true,
                platform: 'Twitch',
                handle: '@marcusgaming',
                followers: 95000,
                dob: '1999-05-30',
                audienceReach: '50k-100k',
                bio: 'Professional esports player and gaming streamer. Specializing in FPS games and competitive gameplay. Come join the squad!',
                location: 'Austin, TX',
                links: [
                    { label: 'Twitch', url: 'https://twitch.tv/marcusgaming' },
                    { label: 'Discord', url: 'https://discord.gg/marcussquad' },
                    { label: 'Merch', url: 'https://marcusmerch.store' }
                ]
            },
            {
                firstName: 'Sophie',
                lastName: 'Anderson',
                email: 'sophie.anderson@creator.com',
                password,
                role: 'creator',
                verified: true,
                platform: 'YouTube',
                handle: '@sophietravels',
                followers: 340000,
                dob: '1995-09-12',
                audienceReach: '100k-500k',
                bio: 'Travel vlogger exploring hidden gems around the world. Sustainable travel advocate and cultural storyteller.',
                location: 'London, UK',
                links: [
                    { label: 'YouTube', url: 'https://youtube.com/@sophietravels' },
                    { label: 'Blog', url: 'https://sophieswanderlust.com' },
                    { label: 'Instagram', url: 'https://instagram.com/sophietravels' }
                ]
            },
            {
                firstName: 'Ryan',
                lastName: 'Thompson',
                email: 'ryan.thompson@creator.com',
                password,
                role: 'creator',
                verified: true,
                platform: 'YouTube',
                handle: '@ryanbuilds',
                followers: 425000,
                dob: '1992-01-25',
                audienceReach: '100k-500k',
                bio: 'DIY enthusiast and woodworking expert. Building amazing projects and teaching essential skills for home improvement.',
                location: 'Portland, OR',
                links: [
                    { label: 'YouTube', url: 'https://youtube.com/@ryanbuilds' },
                    { label: 'Plans Shop', url: 'https://ryanbuildplans.com' },
                    { label: 'Patreon', url: 'https://patreon.com/ryanbuilds' }
                ]
            },
            {
                firstName: 'Priya',
                lastName: 'Sharma',
                email: 'priya.sharma@creator.com',
                password,
                role: 'creator',
                verified: true,
                platform: 'Instagram',
                handle: '@priyafashion',
                followers: 280000,
                dob: '1997-04-18',
                audienceReach: '100k-500k',
                bio: 'Fashion designer and sustainable style advocate. Sharing affordable outfit ideas and promoting ethical fashion choices.',
                location: 'Delhi, India',
                links: [
                    { label: 'Instagram', url: 'https://instagram.com/priyafashion' },
                    { label: 'Online Store', url: 'https://priyastyles.in' },
                    { label: 'Pinterest', url: 'https://pinterest.com/priyafashion' }
                ]
            },
            {
                firstName: 'Alex',
                lastName: 'Johnson',
                email: 'alex.johnson@creator.com',
                password,
                role: 'creator',
                verified: true,
                platform: 'TikTok',
                handle: '@alexedu',
                followers: 670000,
                dob: '1993-12-05',
                audienceReach: '500k-1M',
                bio: 'Science educator making complex topics fun and accessible. Former chemistry teacher turned full-time content creator.',
                location: 'Chicago, IL',
                links: [
                    { label: 'TikTok', url: 'https://tiktok.com/@alexedu' },
                    { label: 'Courses', url: 'https://alexlearning.com' },
                    { label: 'YouTube', url: 'https://youtube.com/@alexedu' }
                ]
            },
            {
                firstName: 'Nina',
                lastName: 'Foster',
                email: 'nina.foster@creator.com',
                password,
                role: 'creator',
                verified: true,
                platform: 'YouTube',
                handle: '@ninamusic',
                followers: 195000,
                dob: '1996-08-21',
                audienceReach: '100k-500k',
                bio: 'Singer-songwriter and music producer. Creating original music and covers. Let music tell your story.',
                location: 'Nashville, TN',
                links: [
                    { label: 'YouTube', url: 'https://youtube.com/@ninamusic' },
                    { label: 'Spotify', url: 'https://open.spotify.com/artist/ninamusic' },
                    { label: 'Website', url: 'https://ninafoster.music' }
                ]
            },
            {
                firstName: 'Carlos',
                lastName: 'Mendez',
                email: 'carlos.mendez@creator.com',
                password,
                role: 'creator',
                verified: true,
                platform: 'Instagram',
                handle: '@carloscar',
                followers: 145000,
                dob: '1991-06-14',
                audienceReach: '100k-500k',
                bio: 'Automotive enthusiast and car modification expert. Sharing tips, tricks, and builds for car lovers worldwide.',
                location: 'Miami, FL',
                links: [
                    { label: 'Instagram', url: 'https://instagram.com/carloscar' },
                    { label: 'YouTube', url: 'https://youtube.com/@carloscar' },
                    { label: 'Shop', url: 'https://carloscarparts.com' }
                ]
            },
            {
                firstName: 'Emma',
                lastName: 'Davis',
                email: 'emma.davis@creator.com',
                password,
                role: 'creator',
                verified: true,
                platform: 'YouTube',
                handle: '@emmabeauty',
                followers: 385000,
                dob: '1998-02-28',
                audienceReach: '100k-500k',
                bio: 'Makeup artist and beauty content creator. Sharing tutorials, product reviews, and skincare routines for all skin types.',
                location: 'Toronto, Canada',
                links: [
                    { label: 'YouTube', url: 'https://youtube.com/@emmabeauty' },
                    { label: 'Instagram', url: 'https://instagram.com/emmabeauty' },
                    { label: 'Beauty Blog', url: 'https://emmabeautyguide.com' }
                ]
            },
            {
                firstName: 'Liam',
                lastName: 'O\'Brien',
                email: 'liam.obrien@creator.com',
                password,
                role: 'creator',
                verified: true,
                platform: 'Twitter',
                handle: '@liamwrites',
                followers: 125000,
                dob: '1990-10-17',
                audienceReach: '100k-500k',
                bio: 'Writer, podcaster, and storyteller. Discussing books, writing tips, and the art of storytelling. Published author of 3 novels.',
                location: 'Dublin, Ireland',
                links: [
                    { label: 'Twitter', url: 'https://twitter.com/liamwrites' },
                    { label: 'Books', url: 'https://liamobrien.author' },
                    { label: 'Podcast', url: 'https://storiespodcast.com' }
                ]
            },

            // Sponsors (8 users)
            {
                firstName: 'Sarah',
                lastName: 'Mitchell',
                email: 'sarah.mitchell@sponsor.com',
                password,
                role: 'sponsor',
                verified: true,
                companyName: 'TechFlow',
                noOfEmployees: '51-200',
                budget: '₹2L-₹10L',
                bio: 'Leading provider of productivity software for creative professionals. Empowering creators with tools to work smarter.',
                requirements: 'Looking for tech reviewers and productivity content creators with engaged audiences.',
                location: 'Seattle, WA',
                links: [
                    { label: 'Company Website', url: 'https://techflow.io' },
                    { label: 'Products', url: 'https://products.techflow.io' }
                ]
            },
            {
                firstName: 'Michael',
                lastName: 'Harper',
                email: 'michael.harper@sponsor.com',
                password,
                role: 'sponsor',
                verified: true,
                companyName: 'FitGear Pro',
                noOfEmployees: '11-50',
                budget: '₹50k-₹2L',
                bio: 'Premium athletic wear and fitness equipment brand. Supporting athletes and fitness enthusiasts in their journey.',
                requirements: 'Seeking fitness influencers and athletes for product collaborations and brand partnerships.',
                location: 'Denver, CO',
                links: [
                    { label: 'Website', url: 'https://fitgearpro.com' },
                    { label: 'Shop', url: 'https://shop.fitgearpro.com' }
                ]
            },
            {
                firstName: 'Jessica',
                lastName: 'Lee',
                email: 'jessica.lee@sponsor.com',
                password,
                role: 'sponsor',
                verified: true,
                companyName: 'Gourmet Box',
                noOfEmployees: '11-50',
                budget: '₹50k-₹2L',
                bio: 'Curated monthly subscription boxes featuring artisanal foods and cooking ingredients from around the world.',
                requirements: 'Looking for food bloggers and cooking content creators for sponsored content and reviews.',
                location: 'San Diego, CA',
                links: [
                    { label: 'Website', url: 'https://gourmetbox.co' },
                    { label: 'Subscribe', url: 'https://subscribe.gourmetbox.co' }
                ]
            },
            {
                firstName: 'David',
                lastName: 'Kumar',
                email: 'david.kumar@sponsor.com',
                password,
                role: 'sponsor',
                verified: true,
                companyName: 'EcoLife Products',
                noOfEmployees: '1-10',
                budget: '₹50k',
                bio: 'Sustainable and eco-friendly household products. Making green living accessible and affordable for everyone.',
                requirements: 'Partnering with sustainability advocates and lifestyle creators who share our values.',
                location: 'Bangalore, India',
                links: [
                    { label: 'Website', url: 'https://ecolifeproducts.in' },
                    { label: 'Blog', url: 'https://blog.ecolifeproducts.in' }
                ]
            },
            {
                firstName: 'Amanda',
                lastName: 'Brooks',
                email: 'amanda.brooks@sponsor.com',
                password,
                role: 'sponsor',
                verified: true,
                companyName: 'GamerGear',
                noOfEmployees: '201-500',
                budget: '₹10L+',
                bio: 'Global gaming peripherals and accessories brand. Trusted by professional esports teams and gamers worldwide.',
                requirements: 'Seeking gaming streamers and esports content creators for long-term brand partnerships.',
                location: 'Seoul, South Korea',
                links: [
                    { label: 'Website', url: 'https://gamergear.gg' },
                    { label: 'Esports', url: 'https://esports.gamergear.gg' }
                ]
            },
            {
                firstName: 'Robert',
                lastName: 'Taylor',
                email: 'robert.taylor@sponsor.com',
                password,
                role: 'sponsor',
                verified: true,
                companyName: 'WanderLust Travel',
                noOfEmployees: '51-200',
                budget: '₹2L-₹10L',
                bio: 'Boutique travel agency specializing in curated adventure experiences and sustainable tourism packages.',
                requirements: 'Collaborating with travel vloggers and adventure content creators for destination promotions.',
                location: 'Barcelona, Spain',
                links: [
                    { label: 'Website', url: 'https://wanderlust-travel.com' },
                    { label: 'Destinations', url: 'https://explore.wanderlust-travel.com' }
                ]
            },
            {
                firstName: 'Lisa',
                lastName: 'Wong',
                email: 'lisa.wong@sponsor.com',
                password,
                role: 'sponsor',
                verified: true,
                companyName: 'StyleHub',
                noOfEmployees: '11-50',
                budget: '₹50k-₹2L',
                bio: 'Online fashion marketplace connecting independent designers with style-conscious consumers worldwide.',
                requirements: 'Looking for fashion influencers and style creators for collection launches and campaigns.',
                location: 'Hong Kong',
                links: [
                    { label: 'Marketplace', url: 'https://stylehub.fashion' },
                    { label: 'Designer Portal', url: 'https://designers.stylehub.fashion' }
                ]
            },
            {
                firstName: 'James',
                lastName: 'Peterson',
                email: 'james.peterson@sponsor.com',
                password,
                role: 'sponsor',
                verified: true,
                companyName: 'EduTech Academy',
                noOfEmployees: '501+',
                budget: '₹10L+',
                bio: 'Leading online education platform offering courses in technology, business, and creative fields. Empowering millions globally.',
                requirements: 'Seeking educational content creators and subject matter experts for course development partnerships.',
                location: 'Boston, MA',
                links: [
                    { label: 'Platform', url: 'https://edutech-academy.com' },
                    { label: 'Courses', url: 'https://learn.edutech-academy.com' }
                ]
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
                console.log(`✓ Created ${userData.role}: ${userData.firstName} ${userData.lastName} (${userData.email})`);
            } else {
                console.log(`• User already exists: ${userData.email}`);
            }
        }

        console.log('\n✅ SUCCESS: Test users created successfully!');
        console.log('📧 Total users: ' + testUsers.length + ' (12 creators, 8 sponsors)');
        console.log('🔑 Default password for all: password123');

    } catch (err) {
        console.error('❌ Failed to create test users:', err);
    } finally {
        await mongoose.disconnect();
    }
}

createTestUsers();
