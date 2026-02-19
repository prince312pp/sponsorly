import { mongo } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sponsorly';

async function seed() {
    const client = new mongo.MongoClient(MONGODB_URI);
    try {
        console.log('Connecting to MongoDB via Native Client...');
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db();
        const usersCollection = db.collection('users');

        // Note: User explicitly stated they emptied the DB, so we just insert.

        const password = await bcrypt.hash('Password123!', 10);

        const creators = [
            { firstName: 'Alex', lastName: 'Rivera', email: 'alex.rivera@creators.co', handle: '@alex_tech', followers: 245000, platform: 'YouTube', bio: 'Full-stack developer and tech reviewer. Helping 245k+ subscribers navigate the latest in software and hardware.', niche: 'Tech', website: 'alexrivera.dev' },
            { firstName: 'Sarah', lastName: 'Chen', email: 'sarah.chen@studio.io', handle: '@sarahchen_art', followers: 120000, platform: 'Instagram', bio: 'Digital illustrator and muralist based in NYC. Specializing in vibrant, high-contrast urban art.', niche: 'Art', website: 'sarahchen.design' },
            { firstName: 'Jordan', lastName: 'Smith', email: 'jordan.smith@fitlife.com', handle: '@jordanfit', followers: 500000, platform: 'TikTok', bio: 'Certified personal trainer and nutrition coach. Daily workouts and healthy meal prep for a sustainable lifestyle.', niche: 'Fitness', website: 'jordansmithfit.com' },
            { firstName: 'Maya', lastName: 'Patel', email: 'maya.patel@travels.com', handle: '@maya_explores', followers: 85000, platform: 'Instagram', bio: 'Visual storyteller and slow travel advocate. Exploring hidden gems across Southeast Asia and Europe.', niche: 'Travel', website: 'mayaexplores.com' },
            { firstName: 'Leo', lastName: 'Gomez', email: 'leo.gomez@gaming.net', handle: '@leogaming_pro', followers: 320000, platform: 'Twitch', bio: 'Professional esports athlete and variety streamer. Join my daily 6 PM streams for high-level FPS gameplay.', niche: 'Gaming', website: 'leogomez.pro' },
            { firstName: 'Chloe', lastName: 'Lefebvre', email: 'chloe.l@fashion.fr', handle: '@chloe_paris', followers: 410000, platform: 'TikTok', bio: 'Paris-based fashion stylist. Bringing high-fashion trends to everyday wear with a focus on sustainability.', niche: 'Fashion', website: 'chloestyle.fr' },
            { firstName: 'David', lastName: 'Brooks', email: 'david.b@finance.com', handle: '@brooks_finance', followers: 65000, platform: 'LinkedIn', bio: 'Financial advisor and wealth strategist. Simplifying complex investment concepts for the modern professional.', niche: 'Finance', website: 'brookswealth.com' },
            { firstName: 'Elena', lastName: 'Russo', email: 'elena.russo@kitchen.it', handle: '@elena_cooks', followers: 180000, platform: 'YouTube', bio: 'Traditional Italian recipes with a modern twist. Learn the secrets of authentic home cooking.', niche: 'Cooking', website: 'elenaskitchen.it' },
            { firstName: 'Marcus', lastName: 'Thorne', email: 'marcus.t@tech.com', handle: '@marcus_gadgets', followers: 95000, platform: 'X (Twitter)', bio: 'Tech journalist and early adopter. Breaking down the latest mobile and computing news.', niche: 'Tech', website: 'marcusthorne.tech' },
            { firstName: 'Sienna', lastName: 'Williams', email: 'sienna.w@beauty.com', handle: '@sienna_beauty', followers: 275000, platform: 'Instagram', bio: 'Makeup artist and skincare expert. Honest reviews and effortless tutorials for every skin type.', niche: 'Beauty', website: 'siennawilliams.com' },
            { firstName: 'Ryan', lastName: 'Kim', handle: '@ryan_vlogs', followers: 380000, email: 'ryan.kim@vlog.co', platform: 'YouTube', bio: 'Daily vlogs from Seoul. Documenting life, culture, and street food in South Korea.', niche: 'Lifestyle', website: 'ryankim.me' },
            { firstName: 'Olivia', lastName: 'Martinez', handle: '@olivia_yoga', followers: 150000, email: 'olivia.m@yoga.com', platform: 'Instagram', bio: 'Yoga instructor and mindfulness coach. Helping you find balance through movement and breath.', niche: 'Wellness', website: 'oliviayoga.com' },
            { firstName: 'Nathan', lastName: 'Drake', handle: '@nathan_geo', followers: 55000, email: 'nathan.d@explore.org', platform: 'Instagram', bio: 'National Geographic fellow and wildlife photographer. Documenting the beauty of our natural world.', niche: 'Photography', website: 'nathandrake.photo' },
            { firstName: 'Aria', lastName: 'Song', handle: '@aria_beats', followers: 210000, email: 'aria.s@music.com', platform: 'TikTok', bio: 'Independent producer and vocalist. Sharing bits of my creative process and new releases.', niche: 'Music', website: 'ariasong.com' },
            { firstName: 'Isaac', lastName: 'Newton', handle: '@isaac_tech', followers: 130000, email: 'isaac.n@coding.io', platform: 'YouTube', bio: 'Teaching the world to code, one tutorial at a time. Specializing in React and Node.js.', niche: 'Education', website: 'isaaccodes.io' },
            { firstName: 'Isabella', lastName: 'Rossi', handle: '@bella_style', followers: 420000, email: 'isabella.r@fashion.it', platform: 'Instagram', bio: 'Milan-based fashion designer. Elevating Italian luxury with a contemporary edge.', niche: 'Fashion', website: 'isabellarossi.it' },
            { firstName: 'Ethan', lastName: 'Hunt', handle: '@ethan_adventures', followers: 190000, email: 'ethan.h@adventure.com', platform: 'YouTube', bio: 'Adrenaline junkie and outdoor enthusiast. Join me as I explore the wildest corners of the Earth.', niche: 'Travel', website: 'ethanhunt.com' },
            { firstName: 'Sophie', lastName: 'Martin', handle: '@sophie_bakery', followers: 85000, email: 'sophie.m@bakery.fr', platform: 'TikTok', bio: 'Pastry chef sharing French baking secrets. From macarons to mille-feuille, let’s bake together.', niche: 'Cooking', website: 'sophiebakes.fr' },
            { firstName: 'Noah', lastName: 'Walker', handle: '@noah_reviews', followers: 310000, email: 'noah.w@techreviews.com', platform: 'YouTube', bio: 'In-depth reviews of the latest home automation gadgets. Making your home smarter and simpler.', niche: 'Tech', website: 'noahwalker.tech' },
            { firstName: 'Lily', lastName: 'Woods', handle: '@lily_decor', followers: 110000, email: 'lily.w@interiors.com', platform: 'Instagram', bio: 'Interior designer specializing in minimalist and eco-friendly home transformations.', niche: 'Lifestyle', website: 'lilywoods.design' },
            { firstName: 'Lucas', lastName: 'Gray', handle: '@lucas_fit', followers: 260000, email: 'lucas.g@fitness.pro', platform: 'TikTok', bio: 'High-intensity interval training for busy professionals. Get fit in 20 minutes a day.', niche: 'Fitness', website: 'lucasgrayfit.com' },
            { firstName: 'Grace', lastName: 'Hills', handle: '@grace_garden', followers: 75000, email: 'grace.h@organic.com', platform: 'Instagram', bio: 'Urban gardener and sustainability advocate. Learn how to grow your own food in any space.', niche: 'Lifestyle', website: 'gracehills.garden' },
            { firstName: 'Oliver', lastName: 'Stone', handle: '@oliver_coding', followers: 140000, email: 'oliver.s@dev.to', platform: 'YouTube', bio: 'Senior software engineer sharing career advice and technical deep dives for aspiring devs.', niche: 'Tech', website: 'oliverstone.dev' },
            { firstName: 'Amelia', lastName: 'Rose', handle: '@amelia_skincare', followers: 220000, email: 'amelia.r@beauty.co', platform: 'TikTok', bio: 'Science-backed skincare routines. Cut through the marketing noise and find what works for you.', niche: 'Beauty', website: 'ameliaskincare.com' },
            { firstName: 'Sebastian', lastName: 'Cook', handle: '@seb_travels', followers: 95000, email: 'seb.c@nomad.com', platform: 'Instagram', bio: 'Digital nomad and budget travel expert. Helping you see the world without breaking the bank.', niche: 'Travel', website: 'sebtravels.me' },
        ];

        const sponsors = [
            { firstName: 'Robert', lastName: 'Iger', companyName: 'Disney', email: 'partnerships@disney.com', website: 'disney.com', budget: '$50,000+', niche: 'Entertainment', employees: '1000+', bio: 'Global leadership in entertainment. We seek storytellers who bring magic to life.', requirements: 'Family-friendly content with high engagement in the US and Europe.' },
            { firstName: 'Phil', lastName: 'Knight', companyName: 'Nike', email: 'colabs@nike.com', website: 'nike.com', budget: '$50,000+', niche: 'Sports', employees: '1000+', bio: 'Just Do It. Partnering with athletes and visionaries who inspire the world.', requirements: 'Exceptional athletic performance or unique fitness journey stories.' },
            { firstName: 'Shantanu', lastName: 'Narayen', companyName: 'Adobe', email: 'creators@adobe.com', website: 'adobe.com', budget: '$10,000 - $50,000', niche: 'Software', employees: '1000+', bio: 'Changing the world through digital experiences. Supporting the next generation of creative talent.', requirements: 'Proficiency in Adobe Creative Cloud and a strong portfolio of high-quality assets.' },
            { firstName: 'Tobi', lastName: 'Lütke', companyName: 'Shopify', email: 'merchants@shopify.com', website: 'shopify.com', budget: '$10,000 - $50,000', niche: 'E-commerce', employees: '1000+', bio: 'Empowering entrepreneurship. We want to hear from creators who are building their own brands.', requirements: 'Demonstrated experience in e-commerce or entrepreneurship-related content.' },
            { firstName: 'Evan', lastName: 'Spiegel', companyName: 'Snapchat', email: 'creators@snap.com', website: 'snapchat.com', budget: '$5,000 - $10,000', niche: 'Social Media', employees: '1000+', bio: 'Connecting people through visual communication. Looking for innovative AR and video creators.', requirements: 'Expertise in AR lens creation or high-frequency video posting.' },
            { firstName: 'Whitney', lastName: 'Wolfe Herd', companyName: 'Bumble', email: 'impact@bumble.com', website: 'bumble.com', budget: '$10,000 - $50,000', niche: 'Tech', employees: '501-1000', bio: 'Kindness is powerful. Partnering with creators who promote healthy relationships and empowered communities.', requirements: 'Strong community focus and alignment with our mission of equality and respect.' },
            { firstName: 'Stewart', lastName: 'Butterfield', companyName: 'Slack', email: 'teams@slack.com', website: 'slack.com', budget: '$5,000 - $10,000', niche: 'SaaS', employees: '1000+', bio: 'Where work happens. Supporting creators who improve productivity and team collaboration.', requirements: 'High engagement among professional and enterprise-level audiences.' },
            { firstName: 'Reed', lastName: 'Hastings', companyName: 'Netflix', email: 'originals@netflix.com', website: 'netflix.com', budget: '$50,000+', niche: 'Entertainment', employees: '1000+', bio: 'See what\'s next. Looking for cinematic storytellers and cultural commentators.', requirements: 'Original, high-production value content with global appeal.' },
            { firstName: 'Marc', lastName: 'Benioff', companyName: 'Salesforce', email: 'impact@salesforce.com', website: 'salesforce.com', budget: '$10,000 - $50,000', niche: 'Software', employees: '1000+', bio: 'Business is the greatest platform for change. Partnering with creators focused on innovation and social good.', requirements: 'A focus on professional development, tech, or philanthropy.' },
            { firstName: 'Jack', lastName: 'Dorsey', companyName: 'Block', email: 'partners@block.xyz', website: 'block.xyz', budget: '$10,000 - $50,000', niche: 'Fintech', employees: '1000+', bio: 'Building tools for economic empowerment. Supporting creators in the finance and crypto space.', requirements: 'In-depth knowledge of financial systems or decentralized technology.' },
            { firstName: 'Melanie', lastName: 'Perkins', companyName: 'Canva', email: 'design@canva.com', website: 'canva.com', budget: '$5,000 - $10,000', niche: 'Design', employees: '1000+', bio: 'Empowering the world to design. We love seeing how creators use Canva to tell their stories.', requirements: 'Engaged audience of creators, small business owners, or marketing professionals.' },
            { firstName: 'Payal', lastName: 'Kadia', companyName: 'ClassPass', email: 'wellness@classpass.com', website: 'classpass.com', budget: '$1,000 - $5,000', niche: 'Fitness', employees: '501-1000', bio: 'Your pass to the world’s best workouts. Seeking fitness enthusiasts who love to experiment with different studios.', requirements: 'Authentic passion for diverse fitness experiences and a local community focus.' },
            { firstName: 'Daniel', lastName: 'Ek', companyName: 'Spotify', email: 'audio@spotify.com', website: 'spotify.com', budget: '$10,000 - $50,000', niche: 'Music', employees: '1000+', bio: 'Unlock the potential of human creativity. Supporting musicians and podcasters on their journey.', requirements: 'High engagement in music-related content or a growing podcast audience.' },
            { firstName: 'Ben', lastName: 'Silbermann', companyName: 'Pinterest', email: 'inspire@pinterest.com', website: 'pinterest.com', budget: '$5,000 - $10,000', niche: 'Social Media', employees: '501-1000', bio: 'Inspiring people to create the life they love. Looking for creators who share actionable ideas.', requirements: 'Visually-driven content with a focus on DIY, fashion, or lifestyle.' },
            { firstName: 'Vlad', lastName: 'Tenev', companyName: 'Robinhood', email: 'finance@robinhood.com', website: 'robinhood.com', budget: '$5,000 - $10,000', niche: 'Fintech', employees: '1000+', bio: 'Investing for everyone. Partnering with creators who make finance more accessible.', requirements: 'Transparent and educational approach to personal finance and investing.' },
            { firstName: 'Katrina', lastName: 'Lake', companyName: 'Stitch Fix', email: 'style@stitchfix.com', website: 'stitchfix.com', budget: '$5,000 - $10,000', niche: 'Fashion', employees: '501-1000', bio: 'Personal styling for every body. Seeking creators who celebrate individuality through fashion.', requirements: 'Honest, relatable style content with high audience trust.' },
            { firstName: 'Eric', lastName: 'Yuan', companyName: 'Zoom', email: 'community@zoom.us', website: 'zoom.us', budget: '$1,000 - $5,000', niche: 'Tech', employees: '1000+', bio: 'Happiness delivered. Supporting creators who help people connect and collaborate remotely.', requirements: 'Content focused on productivity, remote work, or remote learning.' },
            { firstName: 'Emily', lastName: 'Weiss', companyName: 'Glossier', email: 'beauty@glossier.com', website: 'glossier.com', budget: '$5,000 - $10,000', niche: 'Beauty', employees: '201-500', bio: 'Skincare first, makeup second. We look for beauty enthusiasts who value a natural, glowing look.', requirements: 'Audience with a strong interest in "clean beauty" and minimalist aesthetics.' },
            { firstName: 'Jennifer', lastName: 'Hyman', companyName: 'Rent the Runway', email: 'fashion@rtr.com', website: 'renttherunway.com', budget: '$5,000 - $10,000', niche: 'Fashion', employees: '501-1000', bio: 'Own the look, not the outfit. Partnering with creators who advocate for a more sustainable closet.', requirements: 'Focus on conscious consumption, occasion wear, or sustainable style.' },
            { firstName: 'Adam', lastName: 'Neumann', companyName: 'WeWork', email: 'spaces@wework.com', website: 'wework.com', budget: '$5,000 - $10,000', niche: 'Real Estate', employees: '1000+', bio: 'Do what you love. Supporting the community of creators, entrepreneurs, and freelancers.', requirements: 'Professional audience with an interest in networking and workspace innovation.' },
            { firstName: 'Brian', lastName: 'Chesky', companyName: 'Airbnb', email: 'stays@airbnb.com', website: 'airbnb.com', budget: '$10,000 - $50,000', niche: 'Travel', employees: '1000+', bio: 'Belong anywhere. We seek hosts and travelers who share unique stories and cultures.', requirements: 'High-quality photography and storytelling centered around travel and design.' },
            { firstName: 'Julie', lastName: 'Wainwright', companyName: 'The RealReal', email: 'luxury@therealreal.com', website: 'therealreal.com', budget: '$5,000 - $10,000', niche: 'E-commerce', employees: '501-1000', bio: 'The leader in authenticated luxury consignment. Join us in the circular economy.', requirements: 'In-depth knowledge of luxury brands and a commitment to authenticity.' },
            { firstName: 'Marcos', lastName: 'Galperin', companyName: 'Mercado Libre', email: 'impact@mercadolibre.com', website: 'mercadolibre.com', budget: '$10,000 - $50,000', niche: 'E-commerce', employees: '1000+', bio: 'Democratizing e-commerce in Latin America. Supporting Latinx creators and entrepreneurs.', requirements: 'Fluency in Spanish or Portuguese and a strong LatAm audience.' },
            { firstName: 'Dara', lastName: 'Khosrowshahi', companyName: 'Uber', email: 'mobility@uber.com', website: 'uber.com', budget: '$10,000 - $50,000', niche: 'Tech', employees: '1000+', bio: 'Go anywhere, get anything. Partnering with creators who value convenience and accessibility.', requirements: 'High urban engagement and content related to travel, lifestyle, or food delivery.' },
            { firstName: 'Tim', lastName: 'Cook', companyName: 'Apple', email: 'partnerships@apple.com', website: 'apple.com', budget: '$50,000+', niche: 'Tech', employees: '1000+', bio: 'Think different. We support creators who use our tools to create what was once considered impossible.', requirements: 'Exceptional creative output made with Apple products (Shot on iPhone, Edit on Mac).' },
        ];

        const users: any[] = [];

        // Add Creators
        creators.forEach((c, i) => {
            users.push({
                firstName: c.firstName,
                lastName: c.lastName,
                email: c.email,
                password,
                role: 'creator',
                bio: c.bio,
                location: 'Global',
                links: [
                    { label: c.platform, url: `https://${c.platform.toLowerCase().replace(/ \(/, '').replace(/\)/, '')}.com/${c.handle.slice(1)}` },
                    { label: 'Portfolio', url: `https://${c.website}` }
                ],
                platform: c.platform,
                handle: c.handle,
                followers: c.followers,
                dob: new Date(1990 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 12), 1),
                audienceReach: c.niche,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        });

        // Add Sponsors
        sponsors.forEach((s, i) => {
            users.push({
                firstName: s.firstName,
                lastName: s.lastName,
                email: s.email,
                password,
                role: 'sponsor',
                bio: s.bio,
                location: 'Global',
                links: [
                    { label: 'Website', url: `https://${s.website}` },
                    { label: 'Company', url: `https://linkedin.com/company/${s.companyName.toLowerCase()}` }
                ],
                companyName: s.companyName,
                noOfEmployees: s.employees,
                budget: s.budget,
                requirements: s.requirements,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        });

        console.log(`Curated ${users.length} high-quality users. Inserting into database...`);
        const result = await usersCollection.insertMany(users);
        console.log(`Successfully inserted ${result.insertedCount} users into the database.`);

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
}

seed();
