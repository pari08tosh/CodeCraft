## Codecraft Judge

This is a node.js based judge designed for codecraft, but can be implemented on any site. The judge has been sandboxed using docker
and has to be run as a docker container. 

**Languages**

The judge currently ships with C, C++14, Java (openjdk 1.8), Python 2 and Python 3. Go through the language.js file and follow the template 
to add new languages. Also mention installation on the new langugage in the dockerfile. The judge uses ubuntu 16.04 as its base image,
so write your commands accordingly.

**Set Up**

Make sure you have docker installed.

Like any dockerized applications, there are two simple steps to get the judge running.
1. Create image for the application using a suitable name. 
> sudo docker build -t codecraft-judge .
2. Run the judge container on port 8080. 
> docker run -p 8080:8080 -d codecraft-judge

Thats it!
