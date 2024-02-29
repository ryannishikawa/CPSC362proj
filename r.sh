#/bin/bash

#Program name "task manager"
#Author: R. Nishikawa, K. Ho, M. DeBinion
#This file is the script file that accompanies the "task manager" program.
#Prepare for execution in normal mode (not gdb mode).
#run chmod +x r.sh before running this program 


echo "initializing the database"
npm run dbinit

echo "starting the project"
npm start

echo "This bash script will now terminate."