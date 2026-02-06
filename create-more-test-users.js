require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function createMoreTestUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for additional users...');

        const UserSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
        const User = mongoose.model('User', UserSchema);

        const password = await bcrypt.hash('password123', 10);

        const moreTestUsers = [
            // Creators (10 users)
            {
                firstName: 'Zoe', lastName: 'Kim', email: 'zoe.kim@creator.com', password, role: 'creator', verified: true,
                platform: 'Twitch', handle: '@zoekim_plays', followers: 65000, dob: '2001-04-12', audienceReach: '50k-100k',
                bio: 'Professional Valorant player and variety streamer. Engaging with a dedicated community of competitive gamers.',
                location: 'Seoul, South Korea', links: [{ label: 'Twitch', url: 'https://twitch.tv/zoekim_plays' }]
            },
            {
                firstName: 'Omar', lastName: 'Hassan', email: 'omar.hassan@creator.com', password, role: 'creator', verified: true,
                platform: 'Instagram', handle: '@omar_visuals', followers: 120000, dob: '1995-11-20', audienceReach: '100k-500k',
                bio: 'Architecture photographer and drone specialist. Capturing the world from unique perspectives.',
                location: 'Dubai, UAE', links: [{ label: 'Portfolio', url: 'https://omarvisuals.com' }]
            },
            {
                firstName: 'Elena', lastName: 'Rossi', email: 'elena.rossi@creator.com', password, role: 'creator', verified: true,
                platform: 'YouTube', handle: '@elenas_kitchen', followers: 310000, dob: '1988-06-30', audienceReach: '100k-500k',
                bio: 'Traditional Italian recipes with a modern twist. Bringing the taste of Tuscany to your home.',
                location: 'Florence, Italy', links: [{ label: 'YouTube', url: 'https://youtube.com/@elenakitchen' }]
            },
            {
                firstName: 'David', lastName: 'Peterson', email: 'david.p@creator.com', password, role: 'creator', verified: true,
                platform: 'Twitter', handle: '@dave_fintech', followers: 88000, dob: '1985-02-14', audienceReach: '50k-100k',
                bio: 'Financial analyst discussing market trends, cryptocurrency, and personal finance strategies.',
                location: 'New York, NY', links: [{ label: 'Twitter', url: 'https://twitter.com/dave_fintech' }]
            },
            {
                firstName: 'Sakura', lastName: 'Tanaka', email: 'sakura.t@creator.com', password, role: 'creator', verified: true,
                platform: 'TikTok', handle: '@sakura_art', followers: 850000, dob: '2000-09-05', audienceReach: '500k-1M',
                bio: 'Digital artist specializing in anime-style illustrations and character design. Sharing my creative process.',
                location: 'Tokyo, Japan', links: [{ label: 'TikTok', url: 'https://tiktok.com/@sakura_art' }]
            },
            {
                firstName: 'Lucas', lastName: 'Silva', email: 'lucas.silva@creator.com', password, role: 'creator', verified: true,
                platform: 'YouTube', handle: '@lucas_tech', followers: 220000, dob: '1997-12-12', audienceReach: '100k-500k',
                bio: 'Gadget unboxings and deep-dives into the latest mobile technology. Always looking for the best value.',
                location: 'São Paulo, Brazil', links: [{ label: 'YouTube', url: 'https://youtube.com/@lucastech' }]
            },
            {
                firstName: 'Grace', lastName: 'Miller', email: 'grace.miller@creator.com', password, role: 'creator', verified: true,
                platform: 'Instagram', handle: '@grace_yoga', followers: 155000, dob: '1993-01-22', audienceReach: '100k-500k',
                bio: 'Yoga instructor and mindfulness coach. Helping you find balance in a busy world.',
                location: 'Sydney, Australia', links: [{ label: 'Instagram', url: 'https://instagram.com/graceyoga' }]
            },
            {
                firstName: 'Amara', lastName: 'Okonkwo', email: 'amara.o@creator.com', password, role: 'creator', verified: true,
                platform: 'YouTube', handle: '@amara_natural', followers: 440000, dob: '1996-07-08', audienceReach: '100k-500k',
                bio: 'Natural hair care expert and lifestyle vlogger. Celebrating African beauty and culture.',
                location: 'Lagos, Nigeria', links: [{ label: 'YouTube', url: 'https://youtube.com/@amaranatural' }]
            },
            {
                firstName: 'Tom', lastName: 'Baker', email: 'tom.baker@creator.com', password, role: 'creator', verified: true,
                platform: 'Twitter', handle: '@tom_outdoors', followers: 45000, dob: '1989-10-25', audienceReach: '10k-50k',
                bio: 'Hiking, camping, and outdoor survival tips. Documenting my adventures across the national parks.',
                location: 'Denver, CO', links: [{ label: 'Blog', url: 'https://tomoutdoors.com' }]
            },
            {
                firstName: 'Isabella', lastName: 'Garcia', email: 'isabella.g@creator.com', password, role: 'creator', verified: true,
                platform: 'TikTok', handle: '@isabella_styles', followers: 920000, dob: '2002-03-18', audienceReach: '500k-1M',
                bio: 'Fast fashion hauls and trend analysis. Keeping you updated on the latest runway looks.',
                location: 'Madrid, Spain', links: [{ label: 'TikTok', url: 'https://tiktok.com/@isabellastyles' }]
            },

            // Sponsors (10 users)
            {
                firstName: 'Alex', lastName: 'Reed', email: 'alex.reed@sponsor.com', password, role: 'sponsor', verified: true,
                companyName: 'CloudScale', noOfEmployees: '201-500', budget: '₹10L+',
                bio: 'Enterprise cloud infrastructure provider focusing on scalability and security for high-traffic apps.',
                requirements: 'Targeting developers, tech creators, and IT professionals.',
                location: 'Berlin, Germany', links: [{ label: 'Website', url: 'https://cloudscale.de' }]
            },
            {
                firstName: 'Kevin', lastName: 'Lee', email: 'kevin.lee@sponsor.com', password, role: 'sponsor', verified: true,
                companyName: 'Zen Tea', noOfEmployees: '11-50', budget: '₹50k-₹2L',
                bio: 'Organic premium tea brand focused on wellness and traditional harvesting methods.',
                requirements: 'Looking for lifestyle, wellness, and tea enthusiast creators.',
                location: 'Hangzhou, China', links: [{ label: 'Website', url: 'https://zentea.com' }]
            },
            {
                firstName: 'Monica', lastName: 'Sutter', email: 'monica.s@sponsor.com', password, role: 'sponsor', verified: true,
                companyName: 'Sutter Homes', noOfEmployees: '51-200', budget: '₹2L-₹10L',
                bio: 'High-end interior design and luxury home staging services.',
                requirements: 'Partnering with home decor, DIY, and lifestyle influencers.',
                location: 'Paris, France', links: [{ label: 'Website', url: 'https://sutterhomes.fr' }]
            },
            {
                firstName: 'Brian', lastName: 'Chen', email: 'brian.chen@sponsor.com', password, role: 'sponsor', verified: true,
                companyName: 'Quest Gear', noOfEmployees: '11-50', budget: '₹50k-₹2L',
                bio: 'Durable trekking and adventure gear for extreme climates.',
                requirements: 'Seeking outdoor adventurers and travel vloggers.',
                location: 'Vancouver, Canada', links: [{ label: 'Website', url: 'https://questgear.ca' }]
            },
            {
                firstName: 'Yuki', lastName: 'Sato', email: 'yuki.sato@sponsor.com', password, role: 'sponsor', verified: true,
                companyName: 'Mirai Robotics', noOfEmployees: '501+', budget: '₹10L+',
                bio: 'Educational robotics kits for the next generation of engineers.',
                requirements: 'Collaborating with STEM educators and tech creators.',
                location: 'Tokyo, Japan', links: [{ label: 'Website', url: 'https://mirai-robotics.jp' }]
            },
            {
                firstName: 'Paula', lastName: 'Dixon', email: 'paula.dixon@sponsor.com', password, role: 'sponsor', verified: true,
                companyName: 'Vibe Beats', noOfEmployees: '11-50', budget: '₹50k-₹2L',
                bio: 'Affordable, high-quality wireless headphones and audio accessories.',
                requirements: 'Seeking music reactors and tech reviewers.',
                location: 'Austin, TX', links: [{ label: 'Website', url: 'https://vibebeats.com' }]
            },
            {
                firstName: 'Siddharth', lastName: 'Mehta', email: 'sid.m@sponsor.com', password, role: 'sponsor', verified: true,
                companyName: 'FinGrow', noOfEmployees: '51-200', budget: '₹2L-₹10L',
                bio: 'Modern investment platform for young professionals in emerging markets.',
                requirements: 'Looking for finance and business content creators.',
                location: 'Mumbai, India', links: [{ label: 'Website', url: 'https://fingrow.in' }]
            },
            {
                firstName: 'Claudia', lastName: 'Bauer', email: 'claudia.b@sponsor.com', password, role: 'sponsor', verified: true,
                companyName: 'Urban Wear', noOfEmployees: '11-50', budget: '₹50k-₹2L',
                bio: 'Streetwear brand focusing on street culture and artistic collaborations.',
                requirements: 'Partnering with urban lifestyle and fashion creators.',
                location: 'Berlin, Germany', links: [{ label: 'Website', url: 'https://urbanwear.de' }]
            },
            {
                firstName: 'Jason', lastName: 'Tate', email: 'jason.tate@sponsor.com', password, role: 'sponsor', verified: true,
                companyName: 'Pro Stream', noOfEmployees: '51-200', budget: '₹2L-₹10L',
                bio: 'Software for professional streaming and broadcasting.',
                requirements: 'Seeking gaming and variety streamers.',
                location: 'San Jose, CA', links: [{ label: 'Website', url: 'https://prostream.io' }]
            },
            {
                firstName: 'Maria', lastName: 'Hernandez', email: 'maria.h@sponsor.com', password, role: 'sponsor', verified: true,
                companyName: 'Sabor Latino', noOfEmployees: '1-10', budget: '₹50k',
                bio: 'Artisanal Latin American sauce and spice brand.',
                requirements: 'Looking for food creators and cultural bloggers.',
                location: 'Mexico City, Mexico', links: [{ label: 'Website', url: 'https://saborlatino.mx' }]
            }
        ];

        for (const userData of moreTestUsers) {
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

        console.log('\n✅ SUCCESS: 20 more test users created!');
        console.log('📧 Total new users: 20 (10 creators, 10 sponsors)');

    } catch (err) {
        console.error('❌ Failed to create more test users:', err);
    } finally {
        await mongoose.disconnect();
    }
}

createMoreTestUsers();
