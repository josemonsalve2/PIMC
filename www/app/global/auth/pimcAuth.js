(function () {
    'use strict';
 
    var pimc =  angular
        .module('pimc')
        .config(['$httpProvider', 'jwtOptionsProvider','pimcApiDomain', 'pimcBackEndURL', function Config($httpProvider, jwtOptionsProvider, pimcApiDomain, pimcBackEndURL) {
            // Please note we're annotating the function so that the $injector works when the file is minified
            jwtOptionsProvider.config({
              authPrefix: 'JWT ',
              whiteListedDomains: [pimcApiDomain],
              unauthenticatedRedirectPath: '/login',
              tokenGetter: ['options', function(options) {
                // Skip authentication for any requests ending in .html
                if (options && options.url.substr(options.url.length - 5) == '.html') {
                    return null;
                }
                var user = localStorage.getItem('currentUser')
                if (user) {
                    return JSON.parse(user).access_token;
                } else {
                    return null;
                }
              }]
            });
        
            $httpProvider.interceptors.push('jwtInterceptor');
           }]).run(function(authManager) {
                 authManager.checkAuthOnRefresh();
                 authManager.redirectWhenUnauthenticated();
               });
 
})(window.angular);
