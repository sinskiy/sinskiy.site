---
title: "domain migration checklist"
description: "list of things to do to make sure your sites work on your new domain"
pubDate: "May 27 2025"
---

i just migrated my websites from `sinskiy.website` hosted on [reg.ru](https://reg.ru) to `sinskiy.site` on [jino](https://jino.ru/market) (not sponsored) after my domain registration expired. it took longer than anticipated so i'm happy to share my experience sou you can save time

## 0. domain propagation

preferably wait for your domain to achieve `PROPAGATED` status. on my domain registrar this is located at `Settings` -> `Main settings` -> `Status`. if it hasn't propagated yet you can't be sure that your changes actually work

## 1. ensure your site has an SSL/TLS certificate

some hosting services don't work without a certificate

many domain registers automatically give certificates upon registration. however, i had to take these steps:

- navigate to `my domain` -> `settings` -> `SSL`
- click on `install certificate` (ensure the `Wildcard-certificate` option is also checked to secure subdomains)
- _wait ~2 minutes_ for the certificate to activate

## 2. remove default redirects

upon registering my domain, i noticed that my domain registrar had added default DNS records that were basically ads of their service:

| domain          | type | ip          |
| --------------- | :--: | ----------- |
| sinskiy.site    |  A   | 76.76.21.21 |
| \*.sinskiy.site |  A   | 76.76.21.21 |

you probably want to remove them too. to find DNS records, i had to navigate to:

- `my domain` -> `settings` -> `DNS`

## 3. update domain references

once initial configuration is done, it's time to update all references to your old domain across your hosting services and codebase:

1. update domain settings
   - generally: go to your project's domain settings, delete the old domain and add your new domain. you'll be provided with DNS records to add to your domain registrar's DNS settings
   - platform-specific navigation:
     - on Vercel: `Settings` -> `Domains`
     - on Netlify: `Domain management`
     - on Cloudflare Pages: `Custom domains`
     - on Render: `Settings` -> scroll to `Custom Domains`
2. check and update environment variables (locally too)
   - i think you can figure out the platform-specific navigation on your own. it's all roughly at `Settings` -> `Environmental variables`
3. update domain references for OAuth and other integrations (analytics, ads, payment, emails, CDN, backups, etc.)
4. redeploy your projects
5. verify your sites work on the new domain

while waiting for DNS records to propagate (usually a few minutes), update old domain references within your project's codebase. a global search-and-replace worked fine for me

4. update external references to your domain

beyond your hosting services and code, it's useful to update external locations where your old domain might be linked too. consider checking the following:

- social media profiles:
  - connected links on GitHub, SoundCloud, YouTube, etc.
  - profile bio
- content
  - YouTube video descriptions
  - your blog articles
  - LinkedIn posts
  - announcements on Discord, Telegram, HackerNews, etc.
- resume
- business-related platforms that you likely know better examples of as i've never interacted with them (Google (Maps, widgets), TripAdvisor, etc.)
- external content not owned by you (podcasts, guest posts, partnerships, etc.)

again, find and replace should be enough

i hope this guide proves helpful for your next domain migration! (it certainly will for mine lol)
