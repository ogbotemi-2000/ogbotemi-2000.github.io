function save(blob, name, result) {
  name = name || 'download';

  // Use native saveAs in IE10+
  if (typeof navigator !== "undefined") {
      if (/MSIE [1-9]\./.test(navigator.userAgent)) {
          alert('IE is unsupported before IE10');
          return;
      }
      if (navigator.msSaveOrOpenBlob) {
          // https://msdn.microsoft.com/en-us/library/hh772332(v=vs.85).aspx
          alert('will download using IE10+ msSaveOrOpenBlob');
          navigator.msSaveOrOpenBlob(blob, name);
          return;
      }
  }

  // Construct URL object from blob
  var win_url = window.URL || window.webkitURL || window;
  var url = win_url.createObjectURL(blob);

  // Use a.download in HTML5
  var a = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
  if ('download'in a) {
      alert(`${location.host} has provided the \`{ query${', response'.repeat(!!result)} }\` object to your browser for download`);
      a.href = url;
      a.download = name;
      a.dispatchEvent(new MouseEvent('click'));
      // Don't revoke immediately, as it may prevent DL in some browsers
      setTimeout(function() {
          win_url.revokeObjectURL(url);
      }, 500);
      return;
  }
}

const Ev = ev=>node=>(cb, arg)=>/^on/.test(ev)?node[ev]=cb:node[node.attachEvent?'attachEvent':'addEventListener'](ev, cb, arg),
lStore = (k,v=null, get, val)=>(window.localStorage)&&(val=localStorage[prop=((v&&~v)?'set':~v&&(get='get')||'remove')+'Item'](k, JSON.stringify(v)), get?JSON.parse(val):val/**to return true if supported */),
Ev_many = (evs, node, common)=>evs.split(/\s+/).forEach(ev=>Ev(ev)(node)(common)),
      w_Ev =E=>(typeof E=='string' ? Ev(E) : E)(window),
      W = window, w_Ev_dom = w_Ev('DOMContentLoaded'), w_Ev_rz = w_Ev('resize'),
      w_Ev_scroll = w_Ev('scroll'), cLs =bool=>bool?'add':'remove', N=(n,i,s,a)=>{ for(n+=i||=0, s||=1, a=[]; i<n; a.push(i+=s));  return a; },
      ellps=(s,n)=>((s=s.split('.'))[1]||='', s[0]=s[0].slice(0,n).trim()+'...'.repeat(!!s[0][n+1]), s.join('.'.repeat(!!s[1]))),
      togl=(el,arg,cls)=>[].concat(arg).forEach(cl=>(cls||=el.classList).toggle(cl)),
      scrollFn=(obj, el, rise, jumps, prop, fn, arr, i)=> {
        i = 0, el = obj.el, rise = obj.rise, jumps = obj.jumps, fn = obj.fn, arr = [-1, 1], prop = obj.prop,
        rAF.loop=id=>fn(el['scroll'+prop] = el['scroll'+prop] + arr[+rise] * jumps[0] * i ** jumps[1], i++)&&(rAF.loop=null)
      },
      rAF=cb=>requestAnimationFrame(cb),
      _debug=/debug/.test(location.search), slice=arr=>[].slice.call(arr), qsa=str=>slice(document.querySelectorAll(str)),
      qS=(s,a,n)=>(n=(n||document)['querySelector'+(a?'All':'')](s), a?slice(n):n),
      crE = (tag, attrs=[], values={})=>(tag = document.createElement(tag), Object.keys(values).forEach(key=>tag[key]=values[key]), attrs.forEach(attr=>tag.setAttribute(attr.name.trim(), attr.value.trim())), tag),
      /** function for the purpose of making UI seem slightly slow whereas it isn't */
      delay =(fn, t)=>setTimeout(fn, t);

      _debug&&w_Ev('onbeforeunload')(_=>'Prevents navigation or reload of page without user-prompted consent');
      /*ever-running animation loop that can entered and exited by setting rAF.loop to a function for animations that need intermittent calls or smooth fps*/
      rAF.loop=null, rAF.loops=[], requestAnimationFrame(rAF.__loop=id=>{
        rAF.id=id, rAF.loop?.call(), (rAF.loops=rAF.loops.filter(e=>e)).forEach(loop=>loop?.call())
        requestAnimationFrame(rAF.__loop)
      });

w_Ev('onunload')(ev=>{
  console.log('::UNLOADING::REFRESHING::', ev),
  /** cleanup activities occur here such as removing PII when exiting page */
  lStore('user', -1)
})

function frameLoad(scope, callback, doc, t) {
  doc = scope.document || scope.contentDocument,
  t=frameLoad, clearInterval(t.intrvl),
  doc&&(t.intrvl=setInterval(function() {
    if(doc.readyState !=='loading') clearInterval(t.intrvl), callback();
  }))
}
function slotIn(path, back) {
  if(!(window.history||{}).pushState) return location.pathname=path;
  let html=document.documentElement;
  fetch(path).then(res=>res.text()).then(markup=>{
    let elems=[], scripts=[]; 
    markup=markup.split(/<\/head>/);
    ['head', 'body'].forEach((s,i)=>{
      scripts[i] = qS('script', !0, document[s]),
      document[s].after(elems[i]=crE(s, [], { ...i&&{ className:'hidden' }, innerHTML:markup[i] }))
    }),
    delay(_=>{
      [elems[1], document.body].forEach((el, i)=>el.classList[cLs(i)]('hidden')),
      rAF(_=>['head','body'].forEach(s=>document[s].remove())),
      history[back?'pushState':'replaceState'](null, null, path),
      /** create new script element with same content as old script to trigger their execution */
      elems.forEach((elem, i)=>qS('script', !0, elem).forEach(script=>{
        ~scripts[i].indexOf(script)||script.replaceWith(crE('script', slice(script.attributes), { textContent: script.textContent }))
      }))
    }, 1e3)
  })
}

/*self contained component*/
function grow_shrink(el,e,ind,i,c,n,d,k, cls){
  d=grow_shrink,n={500:'base',640:'sm',768:'md',1024:'lg',1280:'xl'},
  c=document.createElement("div"),
  !(d.cached||=[])[ind]&&(d.cached[ind]={}),!(d.arr||=[])[ind]&&(d.arr[ind]=[].slice.call((d.el=el/*window.growShrink*/).querySelectorAll(".fluid"))),
  !(d.dump||=[])[ind]&&(d.dump[ind]=d.el.querySelector("a+div>div")),
  (e=(k=Object.keys(n).filter((c,n)=>(i=n,c>e)))[0]), k = new RegExp(k.map(e=>n[e]+':show').join('|')),
  /*d.vw!==e&&!d.cached[*/(d.vw=e)/*]*/&&d.arr[ind].forEach((n,r,o)=>{
    (n=n.cloneNode(!0)).classList.add(c.className=el.getAttribute('data-classname'));
    if(((cls=n.classList)+'').match(k)) cls.remove('clicked'), (cls+'').replace(/(base|sm|md|lg|xl):show/, function(a) {
      cls.remove(a, 'fluid')
    }), c.appendChild(n), !d.cached[ind][e]&&(d.cached[ind][e]=c)
  }),d.dump[ind].replaceChild(/*d.cached[e]||*/c,d.dump[ind].firstChild)}

w_Ev_dom(call=>{
  call=_=>qS('#growShrink',!0).forEach((el,i)=>grow_shrink(el, innerWidth, i))
  window.growShrink&&(call(), w_Ev_rz(call))
})


function byteFormat(num, res='') {
  if(num<1024) {
    res = num+' bytes';
  } else if(1024<=num&&num<1048576) {
    res += num/1024,
    res = res.slice(0, res.indexOf('.')+3) /*3-1 dp*/+' KB'
  } else {
    res += num/1048576,
    res = res.slice(0, res.indexOf('.')+3) /*3-1 dp*/+' MB'
  }
  return res
}

function minMax(obj, isRem, arr=['min','max'], vary, cnst, fn, str) {
  minMax.switch = fn = (value, isRem) => isRem ? value*16 : value/16,
    
  arr.forEach((e, i, arr, max)=>{
    arr[i] = obj[e], max = arr[2+i] = obj['v'+e],
    !i ? vary = (obj[arr[1+i]] - arr[i])/(obj['v'+arr[i+1]] - max) : (cnst = (arr[i] - max * vary)/16, str = `clamp(${fn(arr[i-1], false)}rem, calc(${cnst.toFixed(3)}rem + ${(100*vary).toFixed(2)}vw), ${fn(arr[i], false)}rem)`)
  });
  return str
}

function relation(parent, child) {
    return [parent.compareDocumentPosition(child)&Node.DOCUMENT_POSITION_CONTAINED_BY,
            parent.compareDocumentPosition(child)&Node.DOCUMENT_POSITION_CONTAINS]
}

  let Abbr={
    dict: function(arr) {
      arr.forEach((str, abbr)=>{
        abbr=str.charAt(0), str.replace(/[A-Z]/g, a=>abbr+=a),
        (this.__dict||={})[abbr] = str
      })
    },
    to  : function(node, arg, flag, dict, arr) {
      dict = this.__dict, str='', arr = Array.isArray(arg)?arg:[arg];
      for(let e, p=[], k=0, j=arr.length; p=[], e=arr[k], k<j; k++) {
        if(typeof e==="object") {
          if(e.at) p=e;/**short method of arrays and strings but used to detect arrays only here */
          else { for(let i in e) { (e[i]+' ').repeat(i).split(/\s+/).forEach(e=>e&&p.push(e)) } } 
        }
        else p=[e];
        p.find((str, v, bool)=>((v=node[str]||node[dict[str]])?node=v:flag&&(node=v,/*breaks out of for loop above*/ k=j), flag&&v||!v ))
      }
      return node
    }
   };
  Abbr.dict(['tagName', 'previousSibling', 'textContent', 'childNodes', 'classList', 'parentNode', 'previousElementSibling', 'nextElementSibling', 'nextSibling', 'firstChild', 'firstElementChild', 'lastChild', 'lastElementChild']);

  function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
  
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
  
    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';
  
    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;
  
    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
  
    // Avoid flash of the white box if rendered for any reason.
    ['color', 'background'].forEach(e=>textArea.style[e] = 'transparent'),
    textArea.value = text;
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    let msg;
    try {
      var successful = document.execCommand('copy');
      msg = successful ? 'copied' : 'failed to copy';
    } catch (err) {
      msg = 'cannot copy; no support'
    }
    document.body.removeChild(textArea);
    return msg
  }