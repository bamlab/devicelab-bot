PROFILE=$HOME/.profile
touch $PROFILE
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | PROFILE=$PROFILE bash
source $PROFILE
nvm install 6
