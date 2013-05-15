var wd = require('wd')
    , Q = require('q')
    , request = require('request')
    , assert = require('assert')
    , host = "ondemand.saucelabs.com"
    , port = 80
    , username = process.env.SAUCE_USERNAME
    , accessKey = process.env.SAUCE_ACCESS_KEY
    , expectedPageTitle = "Flowpath Jasmine Spec"
    , specName = 'Flowpath Jasmine Spec'
    , buildNumber = process.env.TRAVIS_BUILD_NUMBER
    , hostedFlowpathJasmineSpecUrl = "https://rawgithub.com/cbenham/flowpath/master/spec/SpecRunner.html"

    // using promisified version of webdriver
    , browser = wd.promiseRemote(host, port, username, accessKey);

browser.on('status', function(info){
    console.log('\x1b[36m%s\x1b[0m', info);
});

browser.on('command', function(meth, path, data){
    console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path, data || '');
});

// general rest call helper function using promises
var api = function (url, method, data) {
    var deferred = Q.defer();
    request(
        { method: method
            , uri: ["https://", username, ":", accessKey, "@saucelabs.com/rest", url].join("")
            , headers: {'Content-Type': 'application/json'}
            , body: JSON.stringify(data)
        }
        , function (error, response, body) {
            deferred.resolve(response.body);
        }
    );
    return deferred.promise;
};

// test case
browser.init({
    browserName: 'chrome',
    tags: ["travis"],
    name: specName,
    // provide build name if you want to see frontend tests
    // summary on your jobs page
    build: buildNumber
}).then(function () {
        return browser.get(hostedFlowpathJasmineSpecUrl)
            .delay(3000); // wait for tests to finish
    }).then(function () {
        return browser.title();
    }).then(function (title) {
        // are we on the right page?
        assert.ok(~title.indexOf(expectedPageTitle), 'Wrong title!');
    }).then(function () {
        // get jasmine output as JSON
        return browser.eval("jasmine.getJSReport()");
    }).then(function (jsreport) {
        // make an API call to Sauce - set custom-data with 'jasmine' data
        var data = {
            'custom-data': {jasmine: jsreport}
        };
        return api(["/v1/", username, "/jobs/", browser.sessionID].join(""), "PUT", data);
    }).then(function (body) {
        console.log("CONGRATS - WE'RE DONE", body);
    }).fin(function () {
        browser.quit();
    }).done();