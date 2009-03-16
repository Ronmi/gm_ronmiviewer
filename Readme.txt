這個專案的目標是建立一個泛用的線上漫畫閱覽函式庫，並針對已知的線上漫畫網站製作對應的閱覽器
給開發者：比較詳盡的說明都放在github上的wiki中
  http://wiki.github.com/Ronmi/gm_ronmiviewer
給一般使用者：github 上的wiki有自行打包的教學，使用上的疑問請參照
  http://userscripts.org/scripts/show/43063

回報bug或是功能建議，請到my bugzilla
  http://orz.rmi.twbbs.org/bugzilla3/enter_bug.cgi?product=gm_ronmiviewer

For those non-chinese users:

this project is a script lib for greasemonkey.
it's aim to create a comic viewer lib.
you can check the wiki on github http://wiki.github.com/Ronmi/gm_ronmiviewer
or http://userscripts.org/scripts/show/43063 for example
currently, these documents are chinese only
translations are welcome :)

if you have any idea or wanna help developing site script, plz use my bugzilla
http://orz.rmi.twbbs.org/bugzilla3/enter_bug.cgi?product=gm_ronmiviewer

for site script developer:
you should override at least required method in example code
than inserts entire script into document
92wy.js is a good example for you
for details plz visit wiki on github


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


