---
# Heading shown on the home page.
title: How I got into electronics and rockets
# The section is shown on the home page only while this is true and there is text below.
ready: true
---

<!-- Written by Dang Khoa, edited for length and style by Claude (2026-11-07). -->

I grew up in Vietnam and moved to Sydney for university. I have always liked making things. In high school I competed in Vietnam's physics olympiad, and in my free time I built machines out of bamboo, springs, rubber bands and tape. When I was not building for real, I was building robots and planes in Plane Crazy, a building game on Roblox.

Mechatronics at the University of Sydney was my first real contact with electronics design. My first-year units took me from flip-flops, timers and seven-segment displays to a PID-controlled motor with a laser-based encoder and an Arduino. I also spent a lot of that year writing embedded C and solving LeetCode problems.

Rocketry is where it really started. In my second year, in 2025, I joined the USYD Rocketry Team and was given the payload's electronics system and PCB to design. That payload, Rock Daisy, went on to win the SDL Payload Challenge at IREC 2026. Getting there meant learning almost everything from scratch: my first PCB, reading the ESP32-S3 datasheet to assign every pin, and working out trace widths and spacing for the SPI buses. It was hard at first.

Then the first board arrived. Seeing the signals on the oscilloscope and the first readings from the accelerometer is a moment I will not forget, and yes, I cried. That is when I fell in love with electronics. The first version did not work as well as it should have, and [what went wrong and how I fixed it](/projects/rock-daisy/#testing-and-what-broke) is on the Rock Daisy page.

After IREC I spent the break building on what I had learnt: online courses on LTspice simulation and on laying out high-speed interfaces such as Ethernet and HDMI, and working through Sedra and Smith's *Microelectronic Circuits* (8th edition) to strengthen my circuit design.

I then stepped up as ground support equipment co-lead for Project Kookaburra. The subsystem also covers mechanical work such as the fill system and launch rail, so I focus on the electronics. I am leading the redesign of the launch pad electronics as five team-designed boards on one RS-485 bus, and I designed two of them myself. [More on the project page.](/projects/gse-pad-box/)
