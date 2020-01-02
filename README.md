# Playback Control

This repo contins the code for a chrome extension that allows external control of media playing websites such as Youtube, Netflix and Plex. It works by running a content script on matching websites, listening to a remote server's websocket connection and sending any commands to these content scripts. A script then runs based on the command, for example pausing/playing the video or changing the volume.

This project is part of the larger [home-automation](https://github.com/SanderRonde/home-automation) project, where this is part of the remote-control module.