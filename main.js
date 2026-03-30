#!/usr/bin/env node
import fs from 'fs';

const print = (data) => console.log(data);

async function getEventsJson(username) {
    const rawSecrets = fs.readFileSync('./secrets.json', 'utf-8');
    const secrets = JSON.parse(rawSecrets);

    try {

        const data = await fetch(`https://api.github.com/users/${username}/events?per_page=100`, {
            headers: {
                Authorization: `Bearer ${secrets.PAT}`,
            }
        });

        return await data.json();
    } catch (e) {
        throw new Error(e);
    }
}

async function getCountedEvents(name) {
    const events = await getEventsJson(name);

    let c_key;
    let c_count;
    let c_event;
    let key;
    for (const event of events) {
        key = event.type + (event.payload?.action || '');
        if (!c_key) {
            c_key = key;
            c_count = 1
            c_event = event;
        } else {
            if (key != c_key) {
                printEventSummary(event, c_count);
                c_key = key;
                c_count = 1
                c_event = event;
            } else {
                c_count += 1;
            }
        }

    }

    if (c_key) {
        printEventSummary(c_event, c_count);
    }


}



//didn't want to write the entire human readable code formatting by myself
function printEventSummary(event, count) {
    const repo = event.repo.name;

    switch (event.type) {
        case 'PushEvent':
            console.log(`- Pushed ${count} commit${count > 1 ? 's' : ''} to ${repo}`);
            break;

        case 'PullRequestEvent':
            const prAction = event.payload.action;
            if (prAction === 'opened') {
                console.log(`- Opened ${count} pull request${count > 1 ? 's' : ''} in ${repo}`);
            } else if (prAction === 'closed') {
                console.log(`- Closed ${count} pull request${count > 1 ? 's' : ''} in ${repo}`);
            } else if (prAction === 'merged') {
                console.log(`- Merged ${count} pull request${count > 1 ? 's' : ''} in ${repo}`);
            } else {
                console.log(`- ${prAction.charAt(0).toUpperCase() + prAction.slice(1)} ${count} pull request${count > 1 ? 's' : ''} in ${repo}`);
            }
            break;

        case 'IssuesEvent':
            const issueAction = event.payload.action;
            console.log(`- ${issueAction.charAt(0).toUpperCase() + issueAction.slice(1)} ${count} issue${count > 1 ? 's' : ''} in ${repo}`);
            break;

        case 'WatchEvent':
            console.log(`- Starred ${repo} ${count} time${count > 1 ? 's' : ''}`);
            break;

        case 'CreateEvent':
            console.log(`- Created ${event.payload.ref_type} ${event.payload.ref} in ${repo}`);
            break;

        case 'ForkEvent':
            console.log(`- Forked ${repo} ${count} time${count > 1 ? 's' : ''}`);
            break;

        case 'ReleaseEvent':
            console.log(`- Published ${count} release${count > 1 ? 's' : ''} in ${repo}`);
            break;

        case 'CommitCommentEvent':
            console.log(`- Commented on ${count} commit${count > 1 ? 's' : ''} in ${repo}`);
            break;

        case 'PullRequestReviewEvent':
            console.log(`- Reviewed ${count} pull request${count > 1 ? 's' : ''} in ${repo}`);
            break;

        case 'PullRequestReviewCommentEvent':
            console.log(`- Commented on ${count} pull request review${count > 1 ? 's' : ''} in ${repo}`);
            break;

        case 'MemberEvent':
            console.log(`- Added ${count} collaborator${count > 1 ? 's' : ''} in ${repo}`);
            break;

        case 'DeleteEvent':
            console.log(`- Deleted ${event.payload.ref_type} ${event.payload.ref} in ${repo}`);
            break;

        case 'PublicEvent':
            console.log(`- Made ${repo} public`);
            break;

        default:
            console.log(`- ${event.type} occurred ${count} time${count > 1 ? 's' : ''} in ${repo}`);
            break;
    }
}

const name = process.argv[2];
if (!name) {
    print("Please provide a github username");
}

await getCountedEvents(name);