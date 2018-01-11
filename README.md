URL Shortener Microservice

Hosted @ https://productive-trader.glitch.me/

Description: The Url Shortener Microservice performs two tasks. The first is to accept a url as input and then output a shortened address using the current url. The second is two redirect traffic when given a valid shortened url.

How to Use:	Append your "/new/myurl" to the end of the current url, where myurl is the url you would like to shorten, like so: https://energetic-bird.glitch.me/new/myurl

This can either be done in your address bar or by using the http GET protocol.

Example output: {"original_url":"http://asd.com", "short_url":"http://energetic-bird.com/go/9"}

How to Dev/test:	This was developed in the Glitch environment. I recommend using the terminal which can be accessed by pressing ctrl-shift-x.

Changes can be previewed by returning to terminal and entering "refresh", then refreshing the hosted address.# Backend Challenges boilerplate - package.json
