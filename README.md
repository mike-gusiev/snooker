# snooker

How to install it?
 
1. git clone https://github.com/mike-gusiev/snooker
2. npm i
3. bower i
4. cp ftp-auth.default.js  ftp-auth.js
5. gulp less
6. gulp

Now you can easily use and modify project in "app" folder. Every modification will be shown immediately due to "Live reload" module.

To create "dist" folder with minifyed and uglifyed scripts, type:

7. gulp make-dist

To deploy your dist on your webserver:

8. Specify your own ftp-account in file ftp-auth.js
9. gulp deploy-dist
