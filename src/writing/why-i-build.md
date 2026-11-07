---
# Heading shown on the home page.
title: How I got into electronics and rockets
# The section is shown on the home page only while this is true and there is text below.
ready: true
---

<!-- Written by Dang Khoa, edited for flow and length by Claude (2026-11-07). -->

I grew up in Vietnam and came to Sydney for university. I've always enjoyed making things. In high school I competed in Vietnam's physics olympiad, and in my spare time I built little machines out of bamboo, springs, rubber bands and tape. Online, I kept building: robots and planes in Plane Crazy, a building game on Roblox.

Studying mechatronics at the University of Sydney was the first time I really got into electronics design. In first year I went from wiring up flip-flops, timers and seven-segment displays to building a PID-controlled motor with a laser-based encoder and an Arduino. I also spent a lot of that year writing embedded C and solving LeetCode problems.

The real journey started when I joined the USYD Rocketry Team at the start of my second year, in 2025. I was given the payload's electronics and PCB to design, and that payload, Rock Daisy, went on to win the SDL Payload Challenge at IREC 2026. It was my first PCB, so I learnt as I went: reading the ESP32-S3 datasheet to choose what each pin would do, then working out trace widths and spacing for the SPI buses. It was tough at first.

Then the first board arrived. Watching the signals come up on the oscilloscope and seeing the first readings from the accelerometer is something I'll never forget, and yes, I cried. That was when I fell in love with electronics. The first version didn't work as well as it should have, and you can read [what went wrong and how I fixed it](/projects/rock-daisy/#testing-and-what-broke) on the Rock Daisy page.

After IREC I spent the break upskilling. I took online courses on LTspice simulation and on laying out high-speed interfaces like Ethernet and HDMI, and worked through Sedra and Smith's *Microelectronic Circuits* (8th edition) to deepen my understanding of circuit design.

I then stepped up as ground support equipment co-lead for Project Kookaburra, the team's next rocket. The role also covers mechanical work like the fill system and launch rail, so I focus on the electronics side. I'm leading the redesign of the launch pad electronics as a set of team-designed boards, each with its own RS-485 link to a central command hub, and I designed two of those boards myself. [More on the project page.](/projects/gse-pad-box/)
