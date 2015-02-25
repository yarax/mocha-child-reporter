# Mocha child reporter

Reporter, that creates a child process with stdout to console

Useful for testing modules, that redirect stdout to /dev/null or logs

```
> ./node_modules/mocha/bin/mocha --require should --reporter mocha-child-reporter tests/*.js

===========================
        START TESTS 
===========================

Strategy
	should be named url (1 ms)
	should throw if constructed without a verify callback (1 ms)
	handling with access url (1 ms)
	handling with failure url (0 ms)
```
