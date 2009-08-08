
(function()
{
// overrides required method
	RonmiViewer.init(
	{
		'getCurPage': function(resp)
		{
			RonmiViewer.curPageReady(1);
		},
		'getTotalPage': function(resp)
		{
			RonmiViewer.curPageReady(1);
		},
		'fetchVols': function()
		{
			var i, tmp, a, td;
			
			a = RonmiViewer.evaluateXPath(document, '/html/body/table[8]/tbody/tr/td[2]/table[5]/tbody/tr/td/table/tbody/tr/td/table[3]/tbody/tr[2]/td/table/tbody/tr/td/a');
			for (i = 0; i < a.length; i++) 
			{
				tmp = a[i].href.search(/ShowDialog\.aspx\?id=[0-9]+$/);
				if (tmp != -1) 
				{
					RonmiViewer.setupLink(a[i]);
				}
			}
		},
		'convertURL': function(url)
		{
			return '/display.aspx?' + String(url.match(/id=\d+$/));
		},
		'fetchPicURL': function(r)
		{
			var resp=r.responseText;
			var body = resp.search(/<body/);
			var tmp = resp.substr(body);
			var i = tmp.search(/<[sS][cC][rR][iI][pP][tT]/);
			var j = tmp.search(/<\/[sS][cC][rR][iI][pP][tT]/);
			tmp = tmp.substr(i, j - i);
			i = tmp.search(/var array_img/);
			
			var sc = tmp.substr(i);
			
			var array_img;
			eval(sc);
			array_img.shift();
			var ret = array_img.pop();
			for (i = 0; i < array_img.length; i++) 
				RonmiViewer.pix.push([unescape(array_img[i]), RonmiViewer.vols[RonmiViewer.curID][1]]);
			return unescape(ret);
		},
		'fetchNextPageURL': function(resp)
		{
			return '';
		},
		'asc': false
	});
	// end of function
})()
