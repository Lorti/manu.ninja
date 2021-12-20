---
layout: layouts/post.njk
permalink: /recurring-tasks-in-notion/
title: (Real) Recurring Tasks in Notion
description: Learn how to create (real) recurring tasks in Notion. There’s only basic coding skills necessary. Any tech-savvy person can level up from Notion formulas using this tutorial.
date: 2021-07-20
categories: [coding]
tags: [apis, business, js, tools]
---

I only recently discovered Notion. It looks like it can replace both Evernote and Remember the Milk for my personal organization. One thing that bugs me, though, is that there's no built-in way of creating recurring tasks. I have watched a lot of YouTube videos, but all of them seem to be workarounds for non-programmers. Luckily Notion provides an API---although still in beta---so we can automate everything by code.

In this article I'll show you a way to create real recurring tasks in Notion. It's targeted to programmers, but any tech-savvy person should be able to set this up. You only need a code editor and a free [Pipedream](https://pipedream.com/) account. If you are not a coder but have written a few Notion formula's I am confident that you can take my script and adapt it to your needs. So let's go.

First we'll create a task database in Notion, of course. This can be as simple as having a `Title`, `Date` and `Frequency` property.

![](/images/notion-database-setup.jpg)

The `Frequency` property is what flags a task as a recurring task. You can set any intervals that you'd like. I have created a select property with `Yearly`, `Monthly`, `Weekly` and `Daily` intervals for my recurring tasks.

![](/images/notion-page-properties.jpg)

Be sure to create a few example tasks, so that we can test the script later. I have created two tasks `Clean the house` and `Water the plants`, that were due to yesterday and the day before yesterday (I have written this on December 20, 2021).

The next step is to create your Notion integration at <https://www.notion.so/my-integrations>. There is a guide on how to do this in the [Getting started](https://developers.notion.com/docs/getting-started#step-1-create-an-integration) page of the API docs, which is where I took the GIF below from. Thank you, Notion. The important thing is to copy your `Internal Integration Token` for later use. This allows you to create, update and delete data in your Notion workspaces.

![](https://files.readme.io/2ec137d-093ad49-create-integration.gif)

The next step is to share our database with our integration. There's also a guide in the [Getting started](https://developers.notion.com/docs/getting-started#step-2-share-a-database-with-your-integration) page, if you need help. Please copy the `Database ID` as well for later use.

![](https://files.readme.io/0a267dd-share-database-with-integration.gif)

Equipped with your `Token` and your `Database ID` you can start coding. If you are familiar with running Node.js scripts on your computer you can directly copy und adapt the script below, and create a scheduled task (or classic cron job) for it. If not, please head directly to [Pipedream](https://pipedream.com/) and create an account.

In Pipedream you can then create what's called a workflow. Follow the steps in the screenshots to create a Node.js script that runs daily:

![](/images/notion-pipedream-step-1.jpg)
![](/images/notion-pipedream-step-2.jpg)
![](/images/notion-pipedream-step-3.jpg)
![](/images/notion-pipedream-step-4.jpg)

You should now be ready to copy and paste the script into your Node.js workflow step.

But first, create two environment variables:

1. Name the first variable `NOTION_KEY` and paste your `Token` as its value.
1. Name the second variable `NOTION_DATABASE_ID` and paste your `Database ID` as its value.

![](/images/notion-pipedream-step-5.jpg)

Now let's have a look at the script. Copy and paste it to your workflow and then read the comments to understand what's happening.

```js
import { Client } from '@notionhq/client';
import {
    format,
    parseISO,
    addDays,
    addWeeks,
    addMonths,
    addYears,
} from 'date-fns';

const notion = new Client({ auth: process.env.NOTION_KEY });

const databaseId = process.env.NOTION_DATABASE_ID;

// This function creates a task with the three properties `name`, `date`
// and `frequency` in the Notion database you have specified.
async function createTask(name, date, frequency) {
    try {
        await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                Name: {
                    title: [
                        {
                            text: {
                                content: name,
                            },
                        },
                    ],
                },
                Date: {
                    date: {
                        start: date,
                    },
                },
                Frequency: {
                    select: {
                        name: frequency,
                    },
                },
            },
        });
        console.log(`Task '${name}' created for '${date}'.`);
    } catch (error) {
        console.error(error.body);
    }
}

// This is a helper function to get the value of a deeply nested title property.
function getNameValue(page) {
    return page.properties.Name.title[0].text.content;
}

// This is a helper function to get the value of a date property.
function getDateValue(page) {
    return page.properties.Date.date.start;
}

// This is a helper function to get the value of a select property.
function getFrequencyValue(page) {
    return page.properties.Frequency.select.name;
}

// This function creates a list of all future tasks, so that we can test,
// if a task has already been created. To make this comparison easier each
// task is stored as a simple hash, where all properties are put together
// in a unique string, for example `Clean the house2021-12-18Weekly`.
async function getFutureTaskHashes() {
    const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
            and: [
                {
                    property: 'Date',
                    date: {
                        next_year: {},
                    },
                },
                {
                    property: 'Frequency',
                    select: {
                        is_not_empty: true,
                    },
                },
            ],
        },
        sorts: [
            {
                property: 'Date',
                direction: 'ascending',
            },
        ],
    });
    const index = [];
    for (let i = 0; i < response.results.length; i++) {
        const page = response.results[i];
        index.push(createTaskHashFromPage(page));
    }
    return index;
}

function createTaskHashFromPage(page) {
    return createTaskHashFromProps(
        getNameValue(page),
        getDateValue(page),
        getFrequencyValue(page)
    );
}

function createTaskHashFromProps(name, date, frequency) {
    return name + date + frequency;
}

// This function uses the `date-fns` library to calculate the next dates.
// If you want to use different intervals, just update the function.
function calculateNextDateBasedOnFrequency(date, frequency) {
    if (frequency === 'Daily') {
        return addDays(date, 1);
    }
    if (frequency === 'Weekly') {
        return addWeeks(date, 1);
    }
    if (frequency === 'Monthly') {
        return addMonths(date, 1);
    }
    if (frequency === 'Yearly') {
        return addYears(date, 1);
    }
}

// This is the main function of this script. The execution starts here.
async function handleRecurringTasks() {
    const futureTaskHashes = await getFutureTaskHashes();
    const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
            and: [
                {
                    property: 'Date',
                    date: {
                        past_week: {},
                    },
                },
                {
                    property: 'Frequency',
                    select: {
                        is_not_empty: true,
                    },
                },
            ],
        },
        sorts: [
            {
                property: 'Date',
                direction: 'ascending',
            },
        ],
    });
    for (let i = 0; i < response.results.length; i++) {
        const page = response.results[i];

        const name = getNameValue(page);
        const date = parseISO(getDateValue(page));
        const frequency = getFrequencyValue(page);

        const nextDate = format(
            calculateNextDateBasedOnFrequency(date, frequency),
            'yyyy-MM-dd'
        );

        if (
            futureTaskHashes.includes(
                createTaskHashFromProps(name, nextDate, frequency)
            )
        ) {
            console.log(`Task '${name}' for '${nextDate}' already exists.`);
        } else {
            await createTask(name, nextDate, frequency);
        }
    }
}

await handleRecurringTasks();
```

If you're done setting everything up, save your workflow and deploy it to production. To test your script hit the large "run now" button. You should get this success message:

![](/images/notion-pipedream-success.jpg)

And there's now two future tasks in Notion. It does not matter if you've marked the old tasks as completed. The script will take a look at any tasks in the past week, to create recurring tasks in the future. Why look back a whole week? This is actually just for demonstration purposes.

![](/images/notion-database-success.jpg)

What's also important is that you can run the script as often as you want. It won't create duplicates, if the future task already exists.

![](/images/notion-pipedream-skipped.jpg)

And that's how you create real recurring tasks in Notion. Feel free to copy the script and adapt it to your needs. Maybe you need different intervals? Just add a few more `if` statements to the `calculateNextDateBasedOnFrequency()` function. Your properties have different names? Just change the property names throughout the script (you can usually search and replace in any editor). As always, please let me know if you find this article useful or have any feedback or questions.
