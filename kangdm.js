
(function()
{
	RonmiViewer.init(
	{
		'req': null,
		'getCurPage': function(resp)
		{
			var url = RonmiViewer.req.url;
			if (url.indexOf('?') > 0) 
				return url.substr(url.indexOf('?') + 1);
			return 1;
		},
		'getTotalPage': function(resp)
		{
			// check totalPage cache
			if (RonmiViewer.vols[RonmiViewer.curID][2] == 0) 
			{
				var req;
				req = RonmiViewer.config.req = $.ajax(
				{
					'async': false,
					'url': RonmiViewer.vols[RonmiViewer.curID][0] + 'index.js',
					'beforeSend': function(o)
					{
						o.setRequestHeader('Referer', RonmiViewer.vols[RonmiViewer.curID][0]);
						o.setRequestHeader('User-Agent', navigator.userAgent);
					}
				});
				var r = req.responseText;
				r=r.replace(/<iframe.*<\/iframe>/, '');
				eval(r);
				RonmiViewer.vols[RonmiViewer.curID][2] = total;
				RonmiViewer.vols[RonmiViewer.curID][3] = volpic;
				RonmiViewer.vols[RonmiViewer.curID][4] = tpf + 1;
				
			}
			return RonmiViewer.vols[RonmiViewer.curID][2];
			
		},
		'fetchVols': function()
		{
			var url = location.href;
			var a = document.getElementById('main').getElementsByTagName('a');
			var i;
			for (i = 0; i < a.length; i++) 
			{
				if (a[i].href.indexOf(url) != -1 && a[i].href.indexOf('#') == -1) 
				{
					RonmiViewer.setupLink(a[i]);
				}
			}
			
			// init total page cache
			for (i = 0; i < RonmiViewer.vols.length; i++) 
			{
				RonmiViewer.vols[i][2] = 0;
			}
		},
		'convertURL': function(url)
		{
			return url;
		},
		'fetchPicURL': function(resp)
		{
			var volpic = RonmiViewer.vols[RonmiViewer.curID][3];
			var tpf = RonmiViewer.vols[RonmiViewer.curID][4];
			var url=(['http://jtr85tet.kyodm.com/comic_img/','http://jtr85tet.kyodm.com/comic_img/','http://kdfkdfkf.kyodm.com/comic_img/','http://kdfkdfkf.kyodm.com/comic_img/'])[parseInt(Math.random()*4)];
			var cp = String(RonmiViewer.config.getCurPage(resp));
			while (cp.length < tpf) 
			{
				cp = '0' + cp;
			}
			return url + volpic + cp + '.jpg';
		},
		'fetchNextPageURL': function(resp)
		{
			var cp = RonmiViewer.config.getCurPage(resp);
			cp++;
			cp = String(cp);
			return RonmiViewer.vols[RonmiViewer.curID][0] + '?' + cp;
		},
		'onPrefetchNextVol': function(next_vol_id)
		{
			var req;
			req = RonmiViewer.config.req = $.ajax(
			{
				'async': false,
				'url': RonmiViewer.vols[next_vol_id][0] + 'index.js',
				'beforeSend': function(o)
				{
					o.setRequestHeader('Referer', RonmiViewer.vols[next_vol_id][0]);
					o.setRequestHeader('User-Agent', navigator.userAgent);
				}
			});
			var r = req.responseText;
			r=r.replace(/<iframe.*<\/iframe>/, '');
			eval(r);
			RonmiViewer.vols[next_vol_id][2] = total;
			RonmiViewer.vols[next_vol_id][3] = volpic;
			RonmiViewer.vols[next_vol_id][4] = tpf + 1;
		},
		'asc': false
	});
})()
