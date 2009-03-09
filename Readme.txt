this project is a script lib for greasemonkey.
it's aim to create a comic viewer lib.
you can check http://userscripts.org/scripts/show/43063 for example

if you have any idea or wanna help developing site script, plz contact ronmi@rmi.twbbs.org

for site script developer:
you should override at least required method in example code
than inserts entire script into document
92wy.js is a good example for you


besides, some tool you may need:
javascript packer: http://orz.rmi.twbbs.org/pack/index.php
data:URI kitchen: http://software.hixie.ch/utilities/cgi/data/data

========== example code ==========

(function()
{

	RonmiViewer.init(
	{
		'checkValid': function()
		{
			// 這個method不一定要override
		},
		
		'getCurPage': function(resp)
		{
			// 這個method是必需的(required)
		},
		
		'getTotalPage': function(resp)
		{
			// 這個method是必需的(required)
		},
		'fetchVols': function()
		{
			// 這個method是必需的(required)
		},
		'convertURL': function(url)
		{
			// 這個method是必需的(required)
		},
		'fetchPicURL': function(resp)
		{
			// 這個method是必需的(required)
		},
		'fetchNextPageURL': function(resp)
		{
			// 這個method是必需的(required)
		},
		'specialFetchPicURL': function(resp)
		{
			// 這個method不一定要override
		},
		'specialFetchNextPageURL': function(resp)
		{
			// 這個method不一定要override
		},
		'onstart': function(id)
		{
			// 這個method不一定要override
		},
		'onPrefetchNextVol': function(next_vol_id)
		{
			// 這個method不一定要override
		},
		'asc': false
	});
})()


