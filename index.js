var chr = function (runner) {
        this.init.call(this, runner);
    },
    console = {
        log : function (str, err) {
            var res = {};
            res.message = str;
            if (err) {
                res.message += "\n" + color('pass', err.message + (err.stack ? "\n" + err.stack : ""));
            }
            ps.send(res);
        }
    },
    n = 0,
    color = function(type, str) {
        var colors = {
            'pass': 90
            , 'fail': 31
            , 'bright pass': 92
            , 'bright fail': 91
            , 'bright yellow': 93
            , 'pending': 36
            , 'suite': 0
            , 'error title': 0
            , 'error message': 31
            , 'error stack': 90
            , 'checkmark': 32
            , 'fast': 90
            , 'medium': 33
            , 'slow': 31
            , 'green': 32
            , 'light': 90
            , 'diff gutter': 90
            , 'diff added': 42
            , 'diff removed': 41
        };
        return '\u001b[' + colors[type] + 'm' + str + '\u001b[0m';
    },
    cp = require('child_process'),
    ps = cp.fork(__dirname + '/child.js');

chr.prototype.init = function (runner) {

    var stats = { suites: 0, tests: 0, passes: 0, pending: 0, failures: 0 }
        , failures =  [];


    var epilogue = function () {

        // passes
        var fmt = color('bright pass', ' ')
            + color('green', ' %d passing')
            + color('light', ' (%s)');

        console.log(fmt,
            stats.passes || 0,
            ms(stats.duration));

        // pending
        if (stats.pending) {
            fmt = color('pending', ' ')
                + color('pending', ' %d pending');

            console.log(fmt, stats.pending);
        }

    }

    runner.on('start', function(){
        console.log("\n\n===========================\n        START TESTS \n===========================");
    });

    runner.on('suite', function(suite){
        stats.suites = stats.suites || 0;
        suite.root || stats.suites++;
        console.log(color('suite',  suite.title));
    });

    runner.on('test end', function(test){
        stats.tests = stats.tests || 0;
        stats.tests++;
    });

    runner.on('pass', function(test){
        stats.passes = stats.passes || 0;
        var fmt = color('green',  "\t" + test.title + ' (' + test.duration + ' ms)');
        console.log(fmt);
    });

    runner.on('test', function(test){
        //console.log(color('pass', '    ' + test.fullTitle() + ': '));
    });

    runner.on('fail', function(test, err){
        stats.failures = stats.failures || 0;
        stats.failures++;
        failures.push(test);
        console.log(color('fail', "\t" + 'Failed: ') + test.title, err);
    });

    runner.on('end', function(){
        stats.end = new Date;
        stats.duration = new Date - stats.start;
    });

    runner.on('suite end', function (suite) {
    });

    runner.on('pending', function(){
        stats.pending++;
    });
};

module.exports = chr;