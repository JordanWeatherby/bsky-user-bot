import { BskyAgent } from '@atproto/api';
import * as dotenv from 'dotenv';
import { join } from 'path';
import * as process from 'process';

dotenv.config({ path: join(__dirname, '.env')} );

// Create a Bluesky Agent 
const agent = new BskyAgent({
    service: 'https://bsky.social',
  })

const getData = async () => {
    const url = 'https://bsky-search.jazco.io/stats';
    try {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        return json
    } catch (error) {
        console.error(error);
    }

}

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


const main = async () => {
    const data = await getData();
    console.log('process.env: ', process.env.BLUESKY_USERNAME);
    if (data && data.total_users) {
        const text = `Total Bluesky users: ${numberWithCommas(data.total_users)}`
        await agent.login({ identifier: process.env.BLUESKY_USERNAME!, password: process.env.BLUESKY_PASSWORD!})
        await agent.post({
            text
        });
        console.log(text)
    }
}

main();