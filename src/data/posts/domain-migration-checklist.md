---
title: "domain migration checklist"
description: "list of things to do to make sure your sites work on your new domain"
pubDate: "May 27 2025"
---

i just migrated my websites from `sinskiy.website` hosted on [reg.ru](https://reg.ru) to `sinskiy.site` on [jino](https://jino.ru/market) (not sponsored) after my domain registration expired. while the migration took longer than anticipation, now i know what to expect and happy to share it with you spend less time on it

## 0. domain propagation

preferably wait for your domain to achieve the "PROPAGATED" status. on my domain registrar it's located at `Settings` -> `Main settings` -> `Status`

## 1. ensure your site has an SSL/TLS certificate

some hosting services don't work with websites without a certificate

many domain registers automatically give certificates upon registering. however, in my case i had to perform these actions:

- navigate to `my domain` -> `settings` -> `SSL`
- click on `install certificate` (ensure the `Wildcard-certificate` is also checked if you want to secure subdomains)
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
   - generally: go to the domain settings within your project, delete the old domain and add your new domain. you'll be provided with DNS records that you'll need to add to your domain registrar's DNS settings
   - platform-specific navigation:
     - on Vercel: `Settings` -> `Domains`
     - on Netlify: `Domain management`
     - on Cloudflare Pages: `Custom domains`
     - on Render: `Settings` -> scroll to `Custom Domains`
2. check and update environment variables (locally too)
   - i think you can figure out the platform-specific navigation on your own. it's all roughly at `Settings` -> `Environmental variables`
3. update OAuth and other integrations domain references (analytics, ads, payment, emails, CDN, backups, etc.)
4. redeploy your projects

while waiting for the new DNS records to propagate (which usually takes a few minutes), update references to the old domain within your project's codebase. a global search-and-replace worked fine for me

4. update external references to your domain

beyour your hosting services and code, it's better to update external locations where your old domain might be linked too. consider checking the following:

- social media profiles:
  - connected links on GitHub, SoundCloud, YouTube, etc.
  - profile bio
- content
  - YouTube video descriptions
  - your blog articles
  - LinkedIn posts
  - announcements on Discord, Telegram, HackerNews, etc.
- resume
- business-related platforms that I know little about (Google (Maps, widgets), TripAdvisor, etc.)
- external content not owned by you (podcasts, guest posts, partnerships, etc.)

again, find and replace should be enough

i hope this guide proves helpful your domain migration! (it certainly will for mine lol)
