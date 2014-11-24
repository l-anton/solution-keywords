# How to install and run APIs on Amazon Linux

sudo yum update
sudo yum install gcc-c++ make
sudo yum install openssl-devel
sudo yum install git
git clone git://github.com/joyent/node.git
cd node
git checkout v0.10.33
./configure
make
sudo make install
cd ..
sudo su
vi /etc/sudoers
# Insert ":/usr/local/bin" at the end of the "Default secure_path = ..." and close with : <ESC> :wq! <ENTER>
exit
git clone https://github.com/isaacs/npm.git
cd npm
sudo make install
cd ..
sudo npm install forever
sudo npm install mongojs
sudo vi /etc/yum.repos.d/mongodb.repo
# Edit as follows and close with : <ESC> :wq! <ENTER>\
# [mongodb]
# name=MongoDB Repository
# baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64/
# gpgcheck=0
# enabled=1
sudo yum install -y mongodb-org
sudo service mongod start
# Upload get_api.js post_api.js start_get start_post stop_get stop_post
sudo ./start_post
sudo ./start_get

## Checks that Node processes are running on ports 8080 and 8081 and MongoDB on port 27017
ss -nltp

## Stop services
sudo ./stop_post
sudo ./stop_get
sudo service mongod stop