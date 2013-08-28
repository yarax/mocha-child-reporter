var ProgressBar = require('progress'),
    bar = new ProgressBar(':bar', { total: 70 });

process.on('message', function(data) {
    console.log(data.message);
    if (data.message.match(/\.\.\./)) {
        var timer = setInterval(function () {
            bar.tick();
            if (bar.complete) {
                clearInterval(timer);
            }
        }, 1000);
    }
});
