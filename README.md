# snooker

How to install it?
 
1. git clone https://github.com/mike-gusiev/snooker
2. npm i
3. bower i
4. gulp less
5. gulp

Now you can easily use and modify project in "app" folder. Every modification will be shown immediately due to "Live reload" module.

To create "dist" folder with minifyed and uglifyed scripts, type:

6. gulp make-dist

To deploy your dist on your webserver:

7. copy "ftp-auth.default.js" to "ftp-auth.js" and write out your own ftp-account.
8. gulp deploy-dist
