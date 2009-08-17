
(function()
{
	RonmiViewer.init(
	{
		'checkValid': function()
		{
			var xpath = '/html/body/div/div[4]/div/h1/span';
			var res = RonmiViewer.evaluateXPath(document, xpath);
			if (res.length < 1) 
				return true;
			res = res[0].textContent;
			if (res == '[小说]') 
				return false;
			return true;
		},
		'getCurPage': function(resp)
		{
			var s = resp.responseText.match(/var current_page = \d+;/);
			if (s != null) 
			{
				s = String(s).substr(19);
				s = s.substr(0, s.length - 1);
				RonmiViewer.curPageReady(parseInt(s));
			}
			else
				RonmiViewer.curPageReady(1);
		},
		'getTotalPage': function(resp)
		{
			var s = resp.responseText.match(/var total_page = \d+;/);
			if (s != null) 
			{
				s = String(s).substr(17);
				s = s.substr(0, s.length - 1);
				RonmiViewer.totalPageReady(parseInt(s));
			}
			else
				RonmiViewer.totalPageReady(1);
		},
		'fetchVols': function()
		{
			var i, tmp, a, td;
			a = document.getElementsByTagName('a');
			for (i = 0; i < a.length; i++) 
			{
				tmp = a[i].href.match(/^http:\/\/.*\/go\/show.*\.htm$/);
				if (tmp != null) 
				{
					RonmiViewer.setupLink(a[i]);
				}
			}
		},
		'convertURL': function(url)
		{
			return url;
		},
		'fetchPicURL': function(r)
		{
			var d, tmp;
			var resp=r.responseText;
			d = resp.search(/<div id="picture"/);
			if (d != -1) 
			{
				// it's comic!
				tmp = resp.substr(d);
				d = tmp.search(/id="pic"/);
				tmp = tmp.substr(0, d) + ' /></a></div>';
				var parser = new DOMParser();
				var doc = parser.parseFromString(tmp, 'text/xml');
				return doc.documentElement.firstChild.firstChild.getAttribute('src');
			}
			d = resp.search(/<div id=dhsp/);
			if (d != -1) 
			{
				// it's anime!
				tmp = resp.substr(d);
				tmp = String(tmp.match(/<embed[^<]+>/));
				tmp = tmp.match(/src=['"]([^'"]+)['"]/);
				tmp = tmp.substr(5, tmp.length - 6);
				return tmp;
			}
			d = resp.search(/class="content_xiaoshuo"/);
			if (d != -1) 
			{
				// it's novel
				tmp=resp.substr(d).match(/src=['"]([^>]+\.txt)["']/);
				if(tmp && tmp[1]) return tmp[1];
			}
			return null;
		},
		'fetchNextPageURL': function(r)
		{
			var resp=r.responseText;
			var tmp = String(resp.match(/<a [^>]+id="down">/));
			var d = tmp.search(/href="/);
			tmp = tmp.substr(d + 6);
			d = tmp.search(/"/);
			return tmp.substr(0, d);
		},
		'specialShowPic': function(url)
		{
			if (url.substr(url.length - 4) == '.swf') 
			{
				// http://player.youku.com/player.php/Type/Folder/Fid/3038298/Ob/1/Pt/6/sid/XNzQzNjAwMTI=/v.swf
				var arg = url.substr(35);
				arg = arg.substr(0, arg.length - 6);
				var args = arg.split(/\//);
				var i;
				arg = '';
				for (i = 0; i < args.length; i++) 
				{
					if ((i % 2) == 0) 
					{
						arg += args[i] + '=';
					}
					else 
					{
						arg += encodeURIComponent(args[i]) + '&';
					}
				}
				return unsafeWindow.jQuery('<embed width="480" height="400" align="middle" type="application/x-shockwave-flash" mode="transparent" allowscriptaccess="always" quality="high" src="http://static.youku.com/v1.0.0014/v/swf/qplayer.swf" flashvars="' + arg + 'show_pre=1&show_next=1&isShowRelatedVideo=false&Version=/v1.0.0400&isAutoPlay=true&winType=interior" allowfullscreen="true" pluginspage="http://www.macromedia.com/go/getflashplayer" name="movie_player" id="movie_player" />').get(0);
			}
			var e=document.createElement('img');
			e.setAttribute('alt', 'Loading...');
			e.setAttribute('border', '1');
			e.setAttribute('src', url);
			e.addEventListener('click', function(){ RonmiViewer.next(); }, false);
			e.addEventListener('load', function(){ RonmiViewer.resizeHandler(null); }, false);
			return e;
		},
		'asc': false
	});
})()
