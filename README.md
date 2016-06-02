# Timer for Node-Red
BigTimer offers a range of timing facilities for Node-Red and can be used singly or in groups. Full support for dusk/dawn and variations also week/month control is  supported and the node offers outputs to MQTT, speech and databases.

You can find out more about this at http://tech.scargill.net/big-timer/

Suitable for general use, BigTimer has 3 outputs, one of which triggers when there is a change and presents one of two messages (for, for example MQTT or other control mechanism), the second is a simple 1 or 0 every minute and the third outputs a message which could be used for speech or debugging.

It also has an input. This can be used to override the schedule - valid commands in the payload are "on", "off","default" and more detailed in the blog - "default" leaves the timer to it's own devices and can also be used as an instant test.

The manual override will time-out after 8 hours and go back to auto (just in case you forget to turn something off). Manual override will also be over-ridden by any scheduled change. There is a pause schedule button for convenient longer-term pausing of the schedule.

Note if upgrading - check your settings. In addition to dusk/dawn, new prefixes have been added which may need checking just after an upgrade.


