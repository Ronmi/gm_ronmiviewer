
(function()
{
	RonmiViewer.init(
	{
		'checkValid': function()
		{
			if(typeof unsafeWindow.cview=='function') return true;
			return false;
		},
		'_request': function(url, queryStringName)
		{
			var returnValue="";
			var URLString=String(url);
			var serachLocation=-1;
			var queryStringLength=queryStringName.length;
			do
			{
				serachLocation=URLString.indexOf(queryStringName+"\=");
				if (serachLocation!=-1)
				{
					if ((URLString.charAt(serachLocation-1)=='?') || (URLString.charAt(serachLocation-1)=='&'))
					{
						URLString=URLString.substr(serachLocation);
						break;
					}
					URLString=URLString.substr(serachLocation+queryStringLength+1);
				}
			}while (serachLocation!=-1)
			if (serachLocation!=-1)
			{
				var seperatorLocation=URLString.indexOf("&");
				if (seperatorLocation==-1)
					returnValue=URLString.substr(queryStringLength+1);
				else
					returnValue=URLString.substring(queryStringLength+1,seperatorLocation);
			}
			return returnValue;
		},
		'_getCurPage': function(r)
		{
			var ch = RonmiViewer.config._request(r.url, 'ch');
			var p=1;
			if(ch.indexOf("-")>0)
			{
				p=parseInt(ch.split('-')[1]);
				ch=ch.split('-')[0];
			}
			return p;
		},
		'getCurPage': function(r)
		{
			RonmiViewer.curPageReady(RonmiViewer.config._getCurPage(r));
		},
		'getTotalPage': function(resp)
		{
			var r=resp.responseText;
			var s=r.indexOf('var codes');
			var x=r.indexOf('"', s);
			var y=r.indexOf('"', x);
			var codes=r.substr(x+1, y+1).split('|');
			s=r.indexOf('var chs');
			x=r.indexOf('=', s);
			y=r.indexOf(';', x);
			var chs=parseInt(r.substr(x+1, y));

			s=r.indexOf('var itemid');
			x=r.indexOf('=', s);
			y=r.indexOf(';', x);
			var itemid=parseInt(r.substr(x+1, y));
			var ch=RonmiViewer.config._request(resp.url, 'ch');
			var i;
			var code="";
			var cid=0;
			for(i=0;i<codes.length;i++)
			{
				if(codes[i].indexOf(ch+" ")==0)
				{
					cid=i;
					code=codes[i];
					break;
				}
			}
			if(code=="")
			{
				for(i=0;i<codes.length;i++)
				{
					if(parseInt(codes[i].split(' ')[0])>ch)
					{
						cid=i;
						code=codes[i];
						ch=parseInt(codes[i].split(' ')[0]);
						break;
					}
				}
			}
			if(code=="")
			{
				cid=codes.length-1;
				code=codes[cid];
				ch=chs;
			}
			var previd=cid>0?parseInt(codes[cid-1].split(' ')[0]):ch;
			var nextid=cid<codes.length-1?parseInt(codes[cid+1].split(' ')[0]):ch;
			var num=code.split(' ')[0];
			var sid=code.split(' ')[1];
			var did=code.split(' ')[2];
			var page=code.split(' ')[3];
			var code=code.split(' ')[4];
			var img;
			RonmiViewer.vols[RonmiViewer.curID][3] = num;
			RonmiViewer.vols[RonmiViewer.curID][4] = itemid;
			RonmiViewer.vols[RonmiViewer.curID][5] = did;
			RonmiViewer.vols[RonmiViewer.curID][6] = sid;
			RonmiViewer.vols[RonmiViewer.curID][7] = code;
			RonmiViewer.totalPageReady(parseInt(page));
		},
		'fetchVols': function()
		{
			var i, tmp, a, td, url, host, x, y;
			a = document.getElementsByTagName('a');

			var cv=String(unsafeWindow.cview);
			var l=cv.indexOf('{');
			var q=cv.indexOf('window.open');
			tmp='unsafeWindow.cview='+cv.substr(0, l+1)+'var getCookie=function(a){return false;};'+cv.substr(l+1, q-l-1)+'return baseurl+url;}';
			eval(tmp);
			for (i = 0; i < a.length; i++) 
			{
				tmp = a[i].getAttribute('onclick');
				if (tmp != null && tmp.substr(0, 5)=='cview') 
				{
					td='url=unsafeWindow.'+tmp.substr(0, tmp.indexOf(';'));
					eval(td);
					x=url.indexOf('/',7);
					host='http://'+url.substr(7, x-7);
					y=url.indexOf('?')+1;
					a[i].href=host+url.substr(y);
					a[i].setAttribute('onclick', '');
					RonmiViewer.setupLink(a[i]);
				}
			}
		},
		'convertURL': function(url)
		{
			return url;
		},
		'fetchPicURL': function(resp)
		{
			var p=String(RonmiViewer.config._getCurPage(resp));
			if(p<10) img="00"+p;else if(p<100) img="0"+p;else img=p;
			var num=RonmiViewer.vols[RonmiViewer.curID][3];
			var itemid=RonmiViewer.vols[RonmiViewer.curID][4];
			var did=RonmiViewer.vols[RonmiViewer.curID][5];
			var sid=RonmiViewer.vols[RonmiViewer.curID][6];
			var code=RonmiViewer.vols[RonmiViewer.curID][7];
			var m=(parseInt((p-1)/10)%10)+(((p-1)%10)*3);
			img+="_"+code.substring(m,m+3);
			return "http://img"+sid+".8comic.com/"+did+"/"+itemid+"/"+num+"/"+img+".jpg";
		},
		'fetchNextPageURL': function(resp)
		{
			var ch = RonmiViewer.config._request(resp.url, 'ch');
			var p=1;
			if(ch.indexOf("-")>0)
			{
				p=parseInt(ch.split('-')[1]);
				ch=ch.split('-')[0];
			}
			var url=resp.url.substr(0, resp.url.indexOf('?')+1);
			return url+'ch='+ch+'-'+String(p+1);
		},
		'asc': true
	});
})()
