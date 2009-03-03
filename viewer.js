
var RonmiViewer = {
    'evaluateXPath': function(aNode, aExpr){
        var xpe = new XPathEvaluator();
        var nsResolver = xpe.createNSResolver(aNode.ownerDocument == null ? aNode.documentElement : aNode.ownerDocument.documentElement);
        var result = xpe.evaluate(aExpr, aNode, nsResolver, 0, null);
        var found = [];
        var res;
        while (res = result.iterateNext()) 
            found.push(res);
        return found;
    },
    'config': null,
    'vols': new Array(), // 存放每一集的連結
    'fetchVols': function(){
        RonmiViewer.config.fetchVols();
    },
    'pix': new Array(), // 暫時儲存圖片的url
    'curID': -1, // 正在取得第幾集的url
    'curStatus': 2, // 目前狀況 0:正在抓 2:done 1:wait retry
    'req': null,
    'xmlhttp': function(url){
        RonmiViewer.req = new XMLHttpRequest();
        RonmiViewer.req.open('GET', url, true);
        RonmiViewer.req.setRequestHeader('User-Agent', navigator.userAgent);
        RonmiViewer.req.onreadystatechange = function(){
            if (RonmiViewer.req.readyState == 4) {
                RonmiViewer.doneFetchNextURL(RonmiViewer.req.responseText);
            }
        };
        RonmiViewer.req.send(null);
    },
    'iframe': null,
    'curURL': null,
    'beginFetchNextURL': function(url){
        RonmiViewer.curURL = url;
        RonmiViewer.xmlhttp(url);
        RonmiViewer.dataLayer.innerHTML = 'Fetching ' + RonmiViewer.vols[RonmiViewer.curID][1];
    },
    'beginFetchPixURL': function(num){
        if (RonmiViewer.curStatus == 0) 
            return;
        if (num < RonmiViewer.curID) 
            return;
        RonmiViewer.curStatus = 0;
        var url = RonmiViewer.config.convertURL(RonmiViewer.vols[num][0]);
        RonmiViewer.curID = num;
        RonmiViewer.beginFetchNextURL(url);
        RonmiViewer.dataLayer.innerHTML = 'Fetching ' + RonmiViewer.vols[RonmiViewer.curID][1] + ' (1)';
    },
    'bug': false,
    'doneFetchNextURL': function(resp){
        if (RonmiViewer.bug) 
            return;
        if (resp != null && RonmiViewer.req.status == 200) {
            var tPage = RonmiViewer.config.getTotalPage(resp);
            var cPage = RonmiViewer.config.getCurPage(resp);
            
            
            // 取得圖片的url
            var picurl = RonmiViewer.config.fetchPicURL(resp);
            if (picurl == null) { // 找不到url，看看有沒有特殊取得url的函式
                if (RonmiViewer.config.specialFetchPicURL) {
                    picurl = RonmiViewer.config.specialFetchPicURL(resp);
                }
                else {
                    alert('cannot fetch url, please report this problem');
                    RonmiViewer.bug = true;
                    return;
                }
            }
            RonmiViewer.pix.push([picurl, RonmiViewer.vols[RonmiViewer.curID][1]]);
            
            // 到底了沒？
            if (tPage == cPage) { // 已到底，設定一下狀態
                RonmiViewer.curStatus = 2;
                RonmiViewer.dataLayer.textContent = RonmiViewer.vols[RonmiViewer.curID][1] + ' Loaded';
                RonmiViewer.show();
            }
            else { // 未到底，取得下一頁url
                RonmiViewer.curStatus = 1;
                RonmiViewer.beginFetchNextURL(RonmiViewer.config.fetchNextPageURL(resp));
                RonmiViewer.dataLayer.innerHTML = 'Fetching ' + RonmiViewer.vols[RonmiViewer.curID][1] + ' (' + String(cPage + 1) + '/' + tPage + ')';
            }
            RonmiViewer.prefetch();
            
        }
        else {
            window.setTimeout(function(){
                RonmiViewer.beginFetchNextURL(RonmiViewer.curURL);
            }, 500);
            RonmiViewer.dataLayer.textContent = 'Fetch failed. Waiting refetch.';
        }
    },
    'picLayer': null,
    'dataLayer': null, // 用來顯示資訊的圖層
    'prefetchCount': 10,
    'curPix': 0, // 顯示到第幾張
    'curFetch': 1, // 預讀到第幾張
    'infoLayer': null,
    'curimgLayer': null,
    'hotkeyEnabled': false,
    'hotCharCode': -1,
    'hotKeyCode': -1,
    'hotAlt': false,
    'hotCtrl': false,
    'hotShift': false,
    'hotMeta': false,
    'keyLayer': null,
    'setKeyEvent': function(e){
        RonmiViewer.hotCharCode = e.charCode;
        RonmiViewer.hotKeyCode = e.keyCode;
        RonmiViewer.hotAlt = e.altKey;
        RonmiViewer.hotCtrl = e.ctrlKey;
        RonmiViewer.hotShift = e.shiftKey;
        RonmiViewer.hotMeta = e.metaKey;
        window.removeEventListener('keypress', RonmiViewer.setKeyEvent, false);
        window.addEventListener('keypress', RonmiViewer.keyEventHandler, false);
        RonmiViewer.hotkeyEnabled = true;
        RonmiViewer.keyLayer.innerHTML = 'Hotkey enabled.';
    },
    'keyEventHandler': function(e){
        if (RonmiViewer.hotCharCode == e.charCode &&
        RonmiViewer.hotKeyCode == e.keyCode &&
        RonmiViewer.hotAlt == e.altKey &&
        RonmiViewer.hotCtrl == e.ctrlKey &&
        RonmiViewer.hotShift == e.shiftKey &&
        RonmiViewer.hotMeta == e.metaKey) {
            RonmiViewer.next();
        }
    },
    'toggleKey': function(){
        if (RonmiViewer.hotkeyEnabled == true) {
            RonmiViewer.hotkeyEnabled = false;
            window.removeEventListener('keypress', RonmiViewer.setKeyEvent, false);
            window.removeEventListener('keypress', RonmiViewer.keyEventHandler, false);
            RonmiViewer.keyLayer.innerHTML = 'Hotkey disabled.';
        }
        else {
            window.addEventListener('keypress', RonmiViewer.setKeyEvent, false);
            RonmiViewer.keyLayer.innerHTML = 'Hotkey capturing.';
        }
    },
    'debugLayerEventHandler': function(e){
        if (e.charCode == 109 && e.ctrlKey == true) 
            RonmiViewer.toggleDebug();
    },
    'debugLayer': null,
    'updateDebug': function(){
        var str;
        str = 'last vol: ' + RonmiViewer.vols[RonmiViewer.vols.length - 1][1] + '<br />';
        str += 'current col: ' + RonmiViewer.vols[RonmiViewer.curID][1] + '<br />';
        
        RonmiViewer.debugLayer.innerHTML = str;
        
        RonmiViewer.curimgLayer.textContent = '[' + RonmiViewer.pix[RonmiViewer.curPix][0] + ']';
        RonmiViewer.infoLayer.innerHTML = '[' + String(RonmiViewer.curPix + 1) + '/' + String(RonmiViewer.pix.length) + ' Pages]';
    },
    'toggleDebug': function(){
        var d = RonmiViewer.controlPanel;
        if (d.style.display == 'none') {
            jQuery(d).slideDown();
            var w = d.offsetWidth;
            var h = d.offsetHeight;
            var x = window.innerWidth;
            var y = window.innerHeight;
            d.style.top = String((y - h) / 2) + 'px';
            d.style.left = String((x - w) / 2) + 'px';
            RonmiViewer.updateDebug();
        }
        else {
            jQuery(d).slideUp();
        }
    },
    'controlPanel': null,
    'screenInit': function(){
        // 清除畫面
        document.body.innerHTML = '<table width="100%"><tr><td><div id="picLayer"></div></td></tr></table>' +
        '<div id="controlPanel" style="position:absolute;background-color:white;border:1px solid red;display:none;z-index:1000;padding:5px;">' +
        '<span onclick="RonmiViewer.prev();return false;" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'\';" style="color:red;">Previous Pic</span> | <span onclick="RonmiViewer.show();return false;" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'\';" style="color:red;">Show</span> | <span onclick="RonmiViewer.next();return false;" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'\';" style="color:red;">Next Pic</span><br />' +
        '<span id="key" onclick="RonmiViewer.toggleKey();">Hotkey disabled.</span> | <span id="info"></span> | <span id="dataLayer">Prefetch ' +
        String(RonmiViewer.prefetchCount) +
        ' pix</span><br />' +
        '<span id="ifr">Progress </span><br />' +
        '<label><input id="autoResize" type="checkbox" checked="true" onclick="RonmiViewer.show();" />Auto resize picture to window size</label>' +
		'<div id="curimg"></div>' +
        '<div id="debug" /><span onclick="RonmiViewer.controlPanel.style.width=null;RonmiViewer.controlPanel.style.height=null;">Resize this panel to standard size</span></div>';
        
        
        RonmiViewer.dataLayer = document.getElementById('dataLayer');
        RonmiViewer.picLayer = document.getElementById('picLayer');
        RonmiViewer.picLayer.inndeHTML = '';
        RonmiViewer.iframe = document.getElementById('ifr');
        RonmiViewer.infoLayer = document.getElementById('info');
        RonmiViewer.curimgLayer = document.getElementById('curimg');
        RonmiViewer.keyLayer = document.getElementById('key');
        RonmiViewer.debugLayer = document.getElementById('debug');
        RonmiViewer.controlPanel = document.getElementById('controlPanel');
        jQuery(RonmiViewer.controlPanel).draggable();
        window.addEventListener('keypress', RonmiViewer.debugLayerEventHandler, false);
        window.addEventListener('resize', RonmiViewer.resizeHandler, false);
    },
    'picimg': null,
    'start': function(url){
        var asc = document.getElementById('asc').checked;
        if (asc == false) {
            RonmiViewer.vols.reverse();
        }
        
        // 先找到是哪一集
        var id = unescape(url);
        var i, j;
        for (i = 0; i < RonmiViewer.vols.length; i++) 
            if (RonmiViewer.vols[i][0] == id) 
                break;
        RonmiViewer.curPix = 0;
        RonmiViewer.curFetch = 1;
        
        var tmp = String(document.getElementById('ppp').value).match(/\d+/);
        if (tmp == null) 
            tmp = 10;
        else 
            tmp = parseInt(tmp);
        if (tmp > 30) 
            tmp = 30;
        RonmiViewer.prefetchCount = tmp;
        
        // 清除畫面
        RonmiViewer.screenInit();
        RonmiViewer.beginFetchPixURL(i);
        
    },
    'resizeHandler': function(e){
        if (document.getElementById('autoResize').checked == true) {
            var w = window.innerWidth - 10;
            var h = window.innerHeight - 40;
            var img = jQuery('#picLayer img');
            if (img.length < 1) 
                return;
            var iw = img.width();
            var ih = img.height();
            if (iw < w && ih < h) 
                return;
            var x = w / iw;
            var y = h / ih;
            if (x > y) {
                img.width(iw * y);
                img.height(h);
            }
            else {
                img.width(w);
                img.height(ih * x);
            }
        }
    },
    'show': function(){
        RonmiViewer.prefetching = false;
        RonmiViewer.updateDebug();
        if (RonmiViewer.config.specialShowPic) 
            RonmiViewer.picLayer.innerHTML = RonmiViewer.config.specialShowPic(RonmiViewer.pix[RonmiViewer.curPix][0]);
        else 
            RonmiViewer.picLayer.innerHTML = '<img onload="RonmiViewer.resizeHandler(null);" alt="Loading..." border="1" src="' + RonmiViewer.pix[RonmiViewer.curPix][0] + '" onclick="RonmiViewer.next()" />';
        RonmiViewer.resizeHandler(null);
    },
    'prefetching': false,
    'prefetch': function(){
        if (RonmiViewer.prefetching) {
            RonmiViewer.show();
            return;
        }
        RonmiViewer.prefetching = true;
        // 清理多餘的prefetch
        var img, i;
        img = RonmiViewer.iframe.getElementsByTagName('img');
        for (i = RonmiViewer.prefetchCount; i < img.length; i++) 
            RonmiViewer.iframe.removeChild(img[i - RonmiViewer.prefetchCount]);
        // 移除重複的prefetch
        img = RonmiViewer.iframe.getElementsByTagName('img');
        for (i = 0; i < img.length; i++) {
            if (decodeURI(img[i].src) == RonmiViewer.pix[RonmiViewer.curPix][0]) 
                RonmiViewer.iframe.removeChild(img[i]);
        }
        
        while (RonmiViewer.iframe.getElementsByTagName('img').length < RonmiViewer.prefetchCount) {
            if (RonmiViewer.curFetch >= RonmiViewer.pix.length) {
                if (RonmiViewer.curStatus != 2) {
                    RonmiViewer.prefetching = false;
                    RonmiViewer.show();
                    return;
                }
                if (RonmiViewer.curID < (RonmiViewer.vols.length - 1)) 
                    RonmiViewer.beginFetchPixURL(RonmiViewer.curID + 1);
                RonmiViewer.show();
                return;
            }
            img = document.createElement('img');
            img.src = RonmiViewer.pix[RonmiViewer.curFetch][0];
            img.setAttribute('width', '24');
            img.setAttribute('height', '24');
            img.setAttribute('border', '1');
            img.setAttribute('style', 'padding-right:2px;');
            RonmiViewer.iframe.appendChild(img);
            RonmiViewer.curFetch++;
        }
        RonmiViewer.prefetching = false;
        RonmiViewer.show();
    },
    'prev': function(){
        if (RonmiViewer.curPix < 1) {
            alert('no more pix');
            return;
        }
        RonmiViewer.curPix--;
        RonmiViewer.show();
        window.scroll(0, 0);
    },
    'next': function(){
        RonmiViewer.curPix++;
        if (RonmiViewer.curPix >= RonmiViewer.pix.length) {
            alert('no more pix');
            return;
        }
        RonmiViewer.prefetch();
        window.scroll(0, 30);
    },
    'init': function(c){
        RonmiViewer.config = c;
    },
    'setupLink': function(e){
        RonmiViewer.vols.push([e.href, e.textContent]);
        e.onclick = null;
        e.setAttribute('onclick', 'RonmiViewer.start("' + escape(e.href) + '");return false;');
        e.href = 'javascript:false;';
    },
    'injectScript': function(url){
        var e;
        e = document.createElement('script');
        e.setAttribute('type', 'text/javascript');
        e.setAttribute('src', url);
        e.setAttribute('id', 'RonmiViewer');
        document.getElementsByTagName('head')[0].appendChild(e);
    },
    'inject': function(){
        if (typeof(jQuery) == 'undefined') {
            RonmiViewer.injectScript('http://jqueryjs.googlecode.com/files/jquery-1.3.2.min.js');
            RonmiViewer.injectScript('http://jquery-ui.googlecode.com/svn/tags/1.6rc6/ui/ui.core.js');
            RonmiViewer.injectScript('http://jquery-ui.googlecode.com/svn/tags/1.6rc6/ui/ui.draggable.js');
        }
        
        RonmiViewer.fetchVols();
        var e = document.createElement('div');
        e.setAttribute('style', 'position:fixed;top:0px;left:0px;background-color:red;padding:5px;color:#ffffff;');
        if (RonmiViewer.config.asc) 
            e.innerHTML = 'Prefetch <input value="10" size="4" maxlength="2" id="ppp" /> pix (Max 30) | <label><input type="checkbox" id="asc" checked="true" />Ascendant(first at top)</label>';
        else 
            e.innerHTML = 'Prefetch <input value="10" size="4" maxlength="2" id="ppp" /> pix (Max 30) | <label><input type="checkbox" id="asc" />Ascendant(first at top)</label>';
        document.body.appendChild(e);
        document.title = '[Viewer Script Ready] ' + document.title;
        e = document.getElementsByTagName('script');
        for (var i = 0; i < e.length; i++) {
            if (e[i].getAttribute('id') != 'RonmiViewer') 
                e[i].parentNode.removeChild(e[i])
        }
    }
};

(function(){
/*	
    RonmiViewer.init({
        'getCurPage': function(resp){
        // resp: 從xmlhttprequest取得的html code
		// 這個method是必需的
        },
        'getTotalPage': function(resp){
        // resp: 從xmlhttprequest取得的html code
		// 這個method是必需的
        },
        'fetchVols': function(){
		// 這個method是必需的
        },
        'convertURL': function(url){
		// 這個method是必需的
        },
        'fetchPicURL': function(resp){
        // 這個method可以不override
        },
        'fetchNextPageURL': function(resp){
        // 這個method可以不override
        },
        'asc': false
    });
*/
    window.addEventListener('load', RonmiViewer.inject, false);
})()