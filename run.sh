cd vue-admin
rm -rf dist
npm run build
cp ../.htaccess dist
echo 管理后台编译完毕

cd ..
cd vue-pc
rm -rf dist
npm run build
cp ../.htaccess dist
echo 前台编译完毕

#cd ..
#cd vue-phone
#rm -rf dist
#npm run build
#echo 手机端编译完毕