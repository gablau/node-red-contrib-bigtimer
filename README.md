# Timer for Node-Red
A Node-Red timer with dusk/dawn handling, summer/winter time, location, manual over-ride and more.

You can find out more about this at http://tech.scargill.net/big-timer/

This should be suitable for general use. It has 3 outputs, one of which triggers when there is a change and presents one of two messages, the second is a simple 1 or 0 every minute and the third outputs a message which could be used for speech or debugging.

It also has an input. This can be used to override the schedule - valid commands in the payload are "on", "off" and "default" - the latter leaves the timer to it's own devices and can also be used as an instant test.

The manual override will time out after 8 hours and go back to auto (just in case you forget to turn something off). Manual override will also be over-ridden by any scheduled change.


