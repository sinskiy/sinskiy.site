---
title: "using Expo for the first time"
description: "a full-stack web developer tries React Native"
pubDate: "Jun 07 2025"
---

i started my programming journey with the goal of becoming a web developer and i don't regret it, especially after trying Expo

## installation

i followed React Native's [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide. i ran out of storage while installing Android Studio, which is not a pleasant experience on Linux. although this is not React Native's problem, the frustration inevitably influenced my attitude towards it. the first real problem came with Watchman: none of the installation options worked for my Debian system. `Building from source` gave a lot of errors, `Prebuilt binaries` for Ubuntu expectedly didn't work, just like `Prebuilt Debs` for `Ubuntu`. i only managed to install a very old version via `sudo apt install watchman`, and i'm not sure that it even works

## Expo

[`npx create-expo-app`](https://docs.expo.dev/get-started/create-a-project/) worked smoothly, unlike [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) (mobile app for Expo): sometimes it started showing a white blank screen; the only solution i found was restarting the phone, though clearing the app data also worked a few times

## Android emulator

after having problems with Expo Go, i decided to give Android emulator a go. my PC with the latest Debian, AMD Ryzen 5 1600 and Nvidia GeForce GTX 1650 _(if it even uses GPU)_ couldn't handle the latest Android version; only Android 9 (the only other version i've tried) worked fine. still, hot reloading frequently failed in both Expo Go and Android emulator. subsequently, i encountered issues with a non-working dark mode, for which i've yet to find a solution. maybe the problem is with the age of Android 9

another inconvenience is the inability to fixate the Android emulator window on one side of the screen. this makes scrolling with cursor near the corner impossible in VSCode, for example

## `expo-router`

customizing the styles is unnecessarily complex and [docs](https://docs.expo.dev/versions/latest/sdk/router/) are not helpful in my opinion. the router itself is also a bit odd

> while researching for this blog post i found out there's an [unstyled version of `expo-router`](https://docs.expo.dev/versions/latest/sdk/router-ui/). this would be helpful to me, but the naming is very confusing: why is the headless version called `<name> UI`? i would've never guessed

## development builds

after getting tired of problems with Expo Go and Android emulator, i decided to see if `expo-dev-client` can fix them. scanning the QR code just closed the camera view and did nothing

## Kotlin

development builds and some more problems with loading the app pissed me off so i decided to try [Kotlin](https://kotlinlang.org/). it suits me as i'm developing my app only for Android and the only reason i chose React Native at first is because i'm familiar with [React](https://react.dev/). mirroring the phone screen in Android Studio works flawlessly and the language seems quite elegant, like a mix of Java and Go. i'm just learning the basics but the experience for now is much more positive than with Expo. i'll write a follow-up blog post later about my Kotlin experience

## conclusion

the State of React Native survey indicates that [developers are generally happy about developing React Native apps, especially with Expo](https://results.2024.stateofreactnative.com/en-US/opinions/#opinions_advantages_multiple). at the same time, all of the mentioned errors and bugs i experienced are undocumented (at least i haven't found any solution after spending quite a lot of time on Google), am i the only one experiencing them? perhaps i'm an exception, and Expo is actually quite good. i'd be glad to hear about your experience with Expo

<details>
<summary>
meta
</summary>

1. my watchman critical error:

```
Command '['/usr/bin/cmake', '--build', '/tmp/fbcode_builder_getdeps-ZhomeZsinskiyZwatchmanZbuildZfbcode_builder/build/folly', '--target', 'install', '--config', 'RelWithDebInfo', '-j', '8']' returned non-zero exit status 1.
```

(there's no build folder in `~/watchman/build/code_builder`)

also there were many non-fatal C errors

2. full specs:

- motherboard: ASRock AB350 Pro4
- RAM: 16 GiB
- processor: AMD Ryzen 5 1600 × 12
- graphics: NVIDIA GeForce GTX 1650
- OS: Debian 12 (Bookworm)
- GNOME: 43.9
- windowing system: X11

</details>
