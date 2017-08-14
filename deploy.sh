#!/usr/bin/sh

# go to bin home
BIN_HOME=$(cd "$(dirname "$0")"; pwd)
cd ${BIN_HOME}

echo "Copying static js/css files to nginx directory..."
cp -rf stock_visualization/static /usr/share/nginx/html/account/
echo "Change owner to nginx"
chown -R nginx:nginx /usr/share/nginx/html/account
echo "Done!"

