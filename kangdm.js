
(function()
{
	RonmiViewer.init(
	{
		'req': null,
		'_getCurPage': function(r)
		{
			var resp=r.responseText;
			var url = r.url;
			var cp=1;
			if (url.indexOf('?') > 0) 
				cp=parseInt(url.substr(url.indexOf('?') + 1));
			return cp;
		},
		'getCurPage': function(r)
		{
			RonmiViewer.curPageReady(RonmiViewer.config._getCurPage(r));
		},
		'fetchImageHost': function(total)
		{
			GM_xmlhttpRequest({
				method: 'GET',
				url: 'http://www.kangdm.com/images/Vol.js',
				headers: {
					'Referer': RonmiViewer.vols[RonmiViewer.curID][0],
					'User-Agent': navigator.userAgent
				},
				overrideMimeType: 'text/plain;charset=gb2312',
				onload: function(z)
				{
					var t=z.responseText;
					t=t.substr(0, t.indexOf('function')-1);
					t='var c=function(){'+t+'; RonmiViewer.vols[RonmiViewer.curID][5] = url; }; c();';
					eval(t);
					RonmiViewer.totalPageReady(total);
				}
			});
		},
		'getTotalPage': function(r)
		{
			if (RonmiViewer.vols[RonmiViewer.curID][2] == 0) 
			{
				GM_xmlhttpRequest({
					method: 'GET',
					url: RonmiViewer.vols[RonmiViewer.curID][0] + 'index.js',
					headers: {
						'Referer': RonmiViewer.vols[RonmiViewer.curID][0],
						'User-Agent': navigator.userAgent
					},
					overrideMimeType: 'text/plain;charset=gb2312',
					onload: function(z)
					{
						var t=z.responseText;
						t=t.replace(/<iframe.*<\/iframe>/, '');
						eval(t);
						RonmiViewer.vols[RonmiViewer.curID][2] = total;
						RonmiViewer.vols[RonmiViewer.curID][3] = volpic;
						RonmiViewer.vols[RonmiViewer.curID][4] = tpf + 1;
						RonmiViewer.vols[RonmiViewer.curID][5] = 'http://kyo.kyodm.com/comic_img/';
						RonmiViewer.config.fetchImageHost(total);
					}
				});
			}
			else RonmiViewer.totalPageReady(RonmiViewer.vols[RonmiViewer.curID][2]);
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
		'fetchPicURL': function(r)
		{
			var resp=r.responseText;
			var volpic = RonmiViewer.vols[RonmiViewer.curID][3];
			var tpf = RonmiViewer.vols[RonmiViewer.curID][4];
			//var url = (['http://jtr85tet.kyodm.com/comic_img/', 'http://jtr85tet.kyodm.com/comic_img/', 'http://kdfkdfkf.kyodm.com/comic_img/', 'http://kdfkdfkf.kyodm.com/comic_img/'])[parseInt(Math.random() * 4)];
			var url=RonmiViewer.vols[RonmiViewer.curID][5];
			var cp = String(RonmiViewer.config._getCurPage(r));
			while (cp.length < tpf) 
			{
				cp = '0' + cp;
			}
			return url + volpic + cp + '.jpg';
		},
		'fetchNextPageURL': function(r)
		{
			var resp=r.responseText;
			var cp = RonmiViewer.config._getCurPage(r);
			cp++;
			cp = String(cp);
			return RonmiViewer.vols[RonmiViewer.curID][0] + '?' + cp;
		},
		'onPrefetchNextVol': function(next_vol_id)
		{
			var req;
			req=RonmiViewer.getSync2(
				RonmiViewer.vols[next_vol_id][0] + 'index.js',
				RonmiViewer.vols[next_vol_id][0],
				'text/plain;charset=gb2312'
			);
			var t=req.responseText;
			t=t.replace(/<iframe.*<\/iframe>/, '');
			eval(t);
			RonmiViewer.vols[next_vol_id][2] = total;
			RonmiViewer.vols[next_vol_id][3] = volpic;
			RonmiViewer.vols[next_vol_id][4] = tpf + 1;
		},
		'asc': false
	});
})()
