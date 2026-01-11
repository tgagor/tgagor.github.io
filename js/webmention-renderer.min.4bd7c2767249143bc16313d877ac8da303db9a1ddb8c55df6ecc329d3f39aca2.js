(function(){const e=document.getElementById("webmentions-container");if(!e)return;const n=e.getAttribute("data-target");if(!n)return;const o="https://webmention.io/api/mentions.jf2",i=new URLSearchParams({target:n,"sort-by":"published","sort-dir":"up",per_page:"100"}),a=async()=>{try{e.innerHTML="<p>Loading interactions...</p>";const t=await fetch(`${o}?${i.toString()}`);if(!t.ok)throw new Error("Failed to load webmentions");const n=await t.json();r(n.children||[])}catch(t){e.innerHTML="<p>Could not load interaction data.</p>",console.error(t)}},r=n=>{if(n.length===0){e.innerHTML="<p></p>";return}let s='<ul class="webmentions-list">';n.forEach(e=>{const i=t(e.author?.name||"Unknown"),r=e.author?.photo||"",l=e.author?.url||"",u=e.published?new Date(e.published).toLocaleDateString():"",d=e.content?.html||e.content?.text||"",n=e["wm-property"];let o="mentioned",a="💬";n==="like-of"&&(o="liked",a="❤️"),n==="repost-of"&&(o="reposted",a="🔁"),n==="in-reply-to"&&(o="replied",a="↩️"),s+=`
        <li class="webmention-item ${n}">
          <div class="webmention-meta">
            ${r?`<img src="${t(r)}" alt="${i}" class="webmention-avatar" loading="lazy">`:""}
            <span class="webmention-author">
              ${l?`<a href="${t(l)}" target="_blank" rel="nofollow noopener">${i}</a>`:i}
            </span>
            <span class="webmention-verb">${o}</span>
            <span class="webmention-date">${u}</span>
            <a href="${t(e.url)}" target="_blank" rel="nofollow noopener" class="webmention-source-link" title="Original Source">🔗</a>
          </div>
          ${(n==="in-reply-to"||n==="mention-of")&&d?`<div class="webmention-content">${c(d)}</div>`:""}
        </li>
      `}),s+="</ul>",e.innerHTML=s},t=e=>(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),c=e=>{const t=document.createElement("div");t.innerHTML=e;const n=["script","style","iframe","object","embed","form","link","meta"];n.forEach(e=>{const n=t.querySelectorAll(e);n.forEach(e=>e.remove())});const s=t.querySelectorAll("*");return s.forEach(e=>{const t=e.attributes;for(let n=t.length-1;n>=0;n--){const s=t[n].name;(s.startsWith("on")||s==="style")&&e.removeAttribute(s)}}),t.innerHTML},s=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(a(),s.disconnect())})});s.observe(e)})()