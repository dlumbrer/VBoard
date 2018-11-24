# VBoard 1.0.0
Platform to create (3D and VR) charts of ElasticSearch data.

## Installation Steps

There are few ways to install VBoard:

### From repository
Directly installation from the source code, the steps are:

1. Clone the repository, choosing a different branch in order to change between ThreeDC and A-FrameDC:
```
git clone https://github.com/dlumbrer/VBoard -b integration-aframedc
or
git clone https://github.com/dlumbrer/VBoard -b integration-threedc
```
2. Change directory:
```
cd VBoard
```
3. Install npm dependencies:
```
npm install
```
4. Optional, install node http-server `npm install -g http-server`

5.  Run VBoard server:
```
http-server
```

The fifth step is optional because you can use any server of http, for instance the http simple server from python.

### From releases 

This is the easiest way to launch VBoard if don't want to install it via source code or docker. It is so simple that you have to download the zip/tar binaries of the selected version (ThreeDC or A-FrameDC) from the GitHub VBoard [releases page](https://github.com/dlumbrer/VBoard/releases), go inside the uncompressed folder and launch it with your favourite http-server.

### Docker
There are docker images of the two versions of VBoard. The information about the images are inside the ["docker" branch](https://github.com/dlumbrer/VBoard/tree/docker), also, there are inside a few examples of how to deploy VBoard using docker-compose.


## User Guide

Please, visit the user guide doc, [USER_GUIDE.md](https://github.com/dlumbrer/VBoard/blob/master/USER_GUIDE.md), in order to know how to make visualizations and dashboards with VBoard.

## Screenshots

![Screenshot](images/user_guide/examplevis1.png)
![Screenshot](images/user_guide/examplepanel2.png)
![Screenshot](images/user_guide/exampledash1.png)
![Screenshot](images/user_guide/exampledashaloneVRpc.png)
![Screenshot](images/user_guide/exampledashaloneVRmobile.jpg)


## Help me to improve! :smile:

If there's any problem or doubt, please, open a Github Issue (Pull Request) or contact me via email (dmorenolumb@gmail.com). It would be very helpful if you tried it and tell me what you think of it, the errors and the possible improves that I could make.

#### For anything, contact me: dmorenolumb@gmail.com