# This is the readme file for setting up the IPFS cluster.

Install node.js/npm
Install kubo ipfs client at : https://dist.ipfs.tech/#kubo
Add the directory containing ipfs.exe to Path in environment variables.

## For setting up the bootstrap node:


Save the swarm.key file in %USERPROFILE%/.ipfs and use the same for all nodes.

```
npm i
ipfs init
node file_server.js
```
It runs on port 4000.

Add inbound rules on this computer :
Rule 1:
Protocol Type: TCP 
Local Ports: 4000,4001,4002,5001,8080

Rule 2:
Protocol Type: UDP
Local Ports: 4001

Set access to all.

## For setting up regular  nodes:

Save the swarm.key file given by bootstrap node in %USERPROFILE%/.ipfs.

```
npm i
ipfs init
API_SERVER_IP=the_wpa4_lan_ip API_SERVER_PEER_ID=corresponding_hash_obtained_from_ipfs_id node privatenode.js
```
First run the bootstrap server, then run the others. 



