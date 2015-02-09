Allows you to stream md5 data and hash at the very end which is very efficient when working with files.
This file is based off Joseph Myers' version found at http://www.myersdaily.org/joseph/javascript/md5-text.html.

The progressive portion is based off PHP's implementation. See http://php.net/manual/en/function.hash-init.php

## Notes

* If you pass an array, we look at the first element to determine if its an array of characters or of bytes.
* Buffers are assumed to contain bytes.
* You cannot mix types in a progressive state. (This will be fixed in a later version)

## Examples

```JS
//to hash a single string
var hash = StreamMD5.hash("test")
//098f6bcd4621d373cade4e832627b4f6
```

```JS
//for streaming data
var state = StreamMD5.init();
while (something) {
    StreamMD5.update(state, string);
}
var hash = StreamMD5.finalize(state);
```

## Todo

* Support streams
