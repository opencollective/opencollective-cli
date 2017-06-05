NODE_MASTER_VERSION=`node -v | sed -E "s/v([0-9])\..*/\1/"`;

if [ $NODE_MASTER_VERSION -eq "0" ]; then
  echo "Old version of Node -- only testing postinstall"
  mocha test/postinstall.test.js --require babel-core/register  
else
  mocha test --require babel-core/register
fi
