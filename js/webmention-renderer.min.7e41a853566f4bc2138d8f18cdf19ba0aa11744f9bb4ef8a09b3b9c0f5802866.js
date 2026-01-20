(function(){const t=document.getElementById("webmentions-container");if(!t)return;const i=t.getAttribute("data-targets")||"",n=i.split(",").map(e=>e.trim()).filter(Boolean);if(!n.length)return;const a="https://webmention.io/api/mentions.jf2",s=new URLSearchParams({"sort-by":"published","sort-dir":"up",per_page:"200"});n.forEach(e=>s.append("target[]",e));const r=async()=>{try{t.innerHTML="<p>Loading interactions...</p>";const e=await fetch(`${a}?${s.toString()}`);if(!e.ok)throw new Error("Failed to load webmentions");const n=await e.json();c(n.children||[])}catch(e){t.innerHTML="<p>Could not load interaction data.</p>",console.error(e)}},c=n=>{if(!n||n.length===0){t.innerHTML="<p></p>";return}const i=[],o=[];n.forEach(e=>{const t=e["wm-property"];t==="like-of"||t==="repost-of"?i.push(e):t==="in-reply-to"||t==="mention-of"?o.push(e):o.push(e)});let s="";if(i.length>0){const t=new Set,n=[];i.forEach(e=>{const o=e.author&&(e.author.url||e.author.uid||e.author.name)||e.url||"",s=o||e.author&&e.author.name||JSON.stringify(e);t.has(s)||(t.add(s),n.push(e))}),s+=`<div class="webmentions-likes" aria-live="polite">`,s+=`<h4 class="webmentions-heading">Likes</h4>`,s+=`<ul class="webmention-likes-list" role="list">`,n.forEach(t=>{const n=e(t.author?.name||"Unknown"),a=t.author?.photo||"",c=t.author?.url||"",r=t["wm-property"]||"";let o="";if(a)o=`<img src="${e(a)}" alt="${n}" class="webmention-avatar" loading="lazy">`;else{const t=e((n||"U").charAt(0).toUpperCase());o=`<span class="webmention-avatar webmention-avatar--placeholder" aria-hidden="true">${t}</span>`}const i=t.url||c,l=i?`<a href="${e(i)}" class="webmention-like-link" target="_blank" rel="nofollow noopener" title="${n}">`:`<span class="webmention-like-link" title="${n}">`,d=i?`</a>`:`</span>`;s+=`
          <li class="webmention-like-item ${r}">
            ${l}
              ${o}
              <span class="sr-only">${n} ${r==="repost-of"?"reposted":"liked"} this</span>
            ${d}
          </li>
        `}),s+=`</ul></div>`}o.length>0&&(s+=`<div class="webmentions-mentions" aria-live="polite">`,s+=`<h4 class="webmentions-heading">Mentions</h4>`,s+=`<ul class="webmentions-list">`,o.forEach(t=>{const r=e(t.author?.name||"Unknown"),c=t.author?.photo||"",u=t.author?.url||"",h=t.published?new Date(t.published).toLocaleDateString():"",d=t.content?.html||t.content?.text||"",n=t["wm-property"];let i="mentioned";n==="like-of"&&(i="liked"),n==="repost-of"&&(i="reposted"),n==="in-reply-to"&&(i="replied");const a=t.url||u;let o="";if(c)o=`<img src="${e(c)}" alt="${r}" class="webmention-icon-img" width="48" height="48" loading="lazy">`;else{let e="💬";n==="like-of"&&(e="❤️"),n==="repost-of"&&(e="🔁"),n==="in-reply-to"&&(e="↩️"),o=`<div class="webmention-icon-emoji" aria-hidden="true">${e}</div>`}a&&(o=`<a href="${e(a)}" target="_blank" rel="nofollow noopener">${o}</a>`),s+=`
          <li class="webmention-item ${e(n||"")}">
            <div class="webmention-row">
              <div class="webmention-icon-column">
                ${o}
              </div>
              <div class="webmention-body-column">
                <div class="webmention-meta-top">
                  <span class="webmention-author">${a?`<a href="${e(a)}" target="_blank" rel="nofollow noopener">${r}</a>`:r}</span>
                  <span class="webmention-verb">${i}</span>
                  <span class="webmention-date">${h}</span>
                </div>
                ${(n==="in-reply-to"||n==="mention-of")&&d?`<div class="webmention-content">${l(d)}</div>`:``}
              </div>
            </div>
          </li>
        `}),s+=`</ul></div>`),t.innerHTML=s},e=e=>(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),l=e=>{const t=document.createElement("div");t.innerHTML=e;const n=["script","style","iframe","object","embed","form","link","meta"];n.forEach(e=>{const n=t.querySelectorAll(e);n.forEach(e=>e.remove())});const s=t.querySelectorAll("*");return s.forEach(e=>{const t=e.attributes;for(let n=t.length-1;n>=0;n--){const s=t[n].name;(s.startsWith("on")||s==="style")&&e.removeAttribute(s)}}),t.innerHTML},o=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(r(),o.disconnect())})});o.observe(t)})()