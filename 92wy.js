
(function()
{
	RonmiViewer.init(
	{
		'base64': 
		{
		
			// private property
			_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
			
			// public method for encoding
			encode: function(input)
			{
				var output = "";
				var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
				var i = 0;
				
				input = this._utf8_encode(input);
				
				while (i < input.length) 
				{
				
					chr1 = input.charCodeAt(i++);
					chr2 = input.charCodeAt(i++);
					chr3 = input.charCodeAt(i++);
					
					enc1 = chr1 >> 2;
					enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
					enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
					enc4 = chr3 & 63;
					
					if (isNaN(chr2)) 
					{
						enc3 = enc4 = 64;
					}
					else if (isNaN(chr3)) 
					{
						enc4 = 64;
					}
					
					output = output +
					this._keyStr.charAt(enc1) +
					this._keyStr.charAt(enc2) +
					this._keyStr.charAt(enc3) +
					this._keyStr.charAt(enc4);
					
				}
				
				return output;
			},
			
			// public method for decoding
			decode: function(input)
			{
				var output = "";
				var chr1, chr2, chr3;
				var enc1, enc2, enc3, enc4;
				var i = 0;
				
				input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
				
				while (i < input.length) 
				{
				
					enc1 = this._keyStr.indexOf(input.charAt(i++));
					enc2 = this._keyStr.indexOf(input.charAt(i++));
					enc3 = this._keyStr.indexOf(input.charAt(i++));
					enc4 = this._keyStr.indexOf(input.charAt(i++));
					
					chr1 = (enc1 << 2) | (enc2 >> 4);
					chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
					chr3 = ((enc3 & 3) << 6) | enc4;
					
					output = output + String.fromCharCode(chr1);
					
					if (enc3 != 64) 
					{
						output = output + String.fromCharCode(chr2);
					}
					if (enc4 != 64) 
					{
						output = output + String.fromCharCode(chr3);
					}
					
				}
				
				output = this._utf8_decode(output);
				
				return output;
				
			},
			
			// private method for UTF-8 encoding
			_utf8_encode: function(string)
			{
				string = string.replace(/\r\n/g, "\n");
				var utftext = "";
				
				for (var n = 0; n < string.length; n++) 
				{
				
					var c = string.charCodeAt(n);
					
					if (c < 128) 
					{
						utftext += String.fromCharCode(c);
					}
					else if ((c > 127) && (c < 2048)) 
					{
						utftext += String.fromCharCode((c >> 6) | 192);
						utftext += String.fromCharCode((c & 63) | 128);
					}
					else 
					{
						utftext += String.fromCharCode((c >> 12) | 224);
						utftext += String.fromCharCode(((c >> 6) & 63) | 128);
						utftext += String.fromCharCode((c & 63) | 128);
					}
					
				}
				
				return utftext;
			},
			
			// private method for UTF-8 decoding
			_utf8_decode: function(utftext)
			{
				var string = "";
				var i = 0;
				var c = c1 = c2 = 0;
				
				while (i < utftext.length) 
				{
				
					c = utftext.charCodeAt(i);
					
					if (c < 128) 
					{
						string += String.fromCharCode(c);
						i++;
					}
					else if ((c > 191) && (c < 224)) 
					{
						c2 = utftext.charCodeAt(i + 1);
						string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
						i += 2;
					}
					else 
					{
						c2 = utftext.charCodeAt(i + 1);
						c3 = utftext.charCodeAt(i + 2);
						string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
						i += 3;
					}
					
				}
				
				return string;
			}
			
		},
		'novelIframeSrcPre': '<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body><script type="text/javascript" src="',
		'novelIframeSrcPost': '"></script></body></html>',
		'checkValid': function()
		{
			//return true;
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
			var s = resp.match(/var current_page = \d+;/);
			if (s != null) 
			{
				s = String(s).substr(19);
				s = s.substr(0, s.length - 1);
				return parseInt(s);
			}
			return 1;
		},
		'getTotalPage': function(resp)
		{
			var s = resp.match(/var total_page = \d+;/);
			if (s != null) 
			{
				s = String(s).substr(17);
				s = s.substr(0, s.length - 1);
				return parseInt(s);
			}
			return 1;
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
		'fetchPicURL': function(resp)
		{
			var d, tmp;
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
				tmp = String(tmp.match(/src="[^"]+"/));
				tmp = tmp.substr(5, tmp.length - 6);
				return tmp;
			}
			d = resp.search(/class="content_xiaoshuo"/);
			if (d != -1) 
			{
				// it's novel
				tmp=resp.substr(d);
				tmp=String(tmp.match(/src=[^>]+\.txt/)).substr(5);
				return tmp;
			}
			return null;
		},
		'fetchNextPageURL': function(resp)
		{
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
				return '<embed width="480" height="400" align="middle" type="application/x-shockwave-flash" mode="transparent" allowscriptaccess="always" quality="high" src="http://static.youku.com/v1.0.0014/v/swf/qplayer.swf" flashvars="' + arg + 'show_pre=1&show_next=1&isShowRelatedVideo=false&Version=/v1.0.0400&isAutoPlay=true&winType=interior" allowfullscreen="true" pluginspage="http://www.macromedia.com/go/getflashplayer" name="movie_player" id="movie_player" />';
			}
			/*
			if(url.substr(url.length-4)=='.txt')
			{
				var src='data:text/html;charset=utf-8;base64,'+encodeURIComponent(RonmiViewer.config.base64.encode(RonmiViewer.config.novelIframeSrcPre+url+RonmiViewer.config.novelIframeSrcPost));
				var w=String(window.innerWidth-10);
				var h=String(window.innerHeight-10);
				return '<iframe src="'+url+'" id="asd" onload="RonmiViewer.config.novel();" border="0" />';
			}
			*/
			return '<img onload="RonmiViewer.resizeHandler(null);" alt="Loading..." border="1" src="' + url + '" onclick="RonmiViewer.next()" />';
		},
		'asc': false
	});
})()
