/* Copy button next to the contact email address. */
(function () {
  var btn=document.getElementById('copy-mail');
  var addr=document.getElementById('mail-addr');
  if(!btn||!addr)return;
  btn.addEventListener('click',function(){
    var done=function(){btn.textContent='Copied';setTimeout(function(){btn.textContent='Copy'},1800)};
    var fallback=function(){var r=document.createRange();r.selectNodeContents(addr);var s=window.getSelection();s.removeAllRanges();s.addRange(r);btn.textContent='Selected';};
    try{navigator.clipboard.writeText(addr.textContent).then(done,fallback)}catch(e){fallback()}
  });
})();
