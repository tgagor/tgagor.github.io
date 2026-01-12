(function(){const t=document.getElementById("webmentions-container");if(!t)return;const i=t.getAttribute("data-targets")||"",n=i.split(",").map(e=>e.trim()).filter(Boolean);if(!n.length)return;const a="https://webmention.io/api/mentions.jf2",s=new URLSearchParams({"sort-by":"published","sort-dir":"up",per_page:"200"});n.forEach(e=>s.append("target[]",e));const r=async()=>{try{t.innerHTML="<p>Loading interactions...</p>";const e=await fetch(`${a}?${s.toString()}`);if(!e.ok)throw new Error("Failed to load webmentions");const n=await e.json();c(n.children||[])}catch(e){t.innerHTML="<p>Could not load interaction data.</p>",console.error(e)}},c=n=>{if(!n||n.length===0){t.innerHTML="<p></p>";return}const i=[],o=[];n.forEach(e=>{const t=e["wm-property"];t==="like-of"||t==="repost-of"?i.push(e):t==="in-reply-to"||t==="mention-of"?o.push(e):o.push(e)});let s="";if(i.length>0){const t=new Set,n=[];i.forEach(e=>{const o=e.author&&(e.author.url||e.author.uid||e.author.name)||e.url||"",s=o||e.author&&e.author.name||JSON.stringify(e);t.has(s)||(t.add(s),n.push(e))}),s+=`<div class="webmentions-likes" aria-live="polite">`,s+=`<h4 class="webmentions-heading">Likes</h4>`,s+=`<ul class="webmention-likes-list" role="list">`,n.forEach(t=>{const n=e(t.author?.name||"Unknown"),a=t.author?.photo||"",o=t.author?.url||"",r=t["wm-property"]||"";let i="";if(a)i=`<img src="${e(a)}" alt="${n}" class="webmention-avatar" loading="lazy">`;else{const t=e((n||"U").charAt(0).toUpperCase());i=`<span class="webmention-avatar webmention-avatar--placeholder" aria-hidden="true">${t}</span>`}const c=o?`<a href="${e(o)}" class="webmention-like-link" target="_blank" rel="nofollow noopener" title="${n}">`:`<span class="webmention-like-link" title="${n}">`,l=o?`</a>`:`</span>`;s+=`
          <li class="webmention-like-item ${r}">
            ${c}
              ${i}
              <span class="sr-only">${n} ${r==="repost-of"?"reposted":"liked"} this</span>
            ${l}
          </li>
        `}),s+=`</ul></div>`}o.length>0&&(s+=`<div class="webmentions-mentions" aria-live="polite">`,s+=`<h4 class="webmentions-heading">Mentions</h4>`,s+=`<ul class="webmentions-list">`,o.forEach(t=>{const i=e(t.author?.name||"Unknown"),r=t.author?.photo||"",c=t.author?.url||"",u=t.published?new Date(t.published).toLocaleDateString():"",d=t.content?.html||t.content?.text||"",n=t["wm-property"];let o="mentioned";n==="like-of"&&(o="liked"),n==="repost-of"&&(o="reposted"),n==="in-reply-to"&&(o="replied");let a="";if(r)a=`<img src="${e(r)}" alt="${i}" class="webmention-icon-img" width="48" height="48" loading="lazy">`;else{let e="💬";n==="like-of"&&(e="❤️"),n==="repost-of"&&(e="🔁"),n==="in-reply-to"&&(e="↩️"),a=`<div class="webmention-icon-emoji" aria-hidden="true">${e}</div>`}s+=`
          <li class="webmention-item ${e(n||"")}">
            <div class="webmention-row">
              <div class="webmention-icon-column">
                ${a}
              </div>
              <div class="webmention-body-column">
                <div class="webmention-meta-top">
                  <span class="webmention-author">${c?`<a href="${e(c)}" target="_blank" rel="nofollow noopener">${i}</a>`:i}</span>
                  <span class="webmention-verb">${o}</span>
                  <span class="webmention-date">${u}</span>
                  <a href="${e(t.url)}" target="_blank" rel="nofollow noopener" class="webmention-source-link" title="Original Source">🔗</a>
                </div>
                ${(n==="in-reply-to"||n==="mention-of")&&d?`<div class="webmention-content">${l(d)}</div>`:``}
              </div>
            </div>
          </li>
        `}),s+=`</ul></div>`),t.innerHTML=s},e=e=>(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),l=e=>{const t=document.createElement("div");t.innerHTML=e;const n=["script","style","iframe","object","embed","form","link","meta"];n.forEach(e=>{const n=t.querySelectorAll(e);n.forEach(e=>e.remove())});const s=t.querySelectorAll("*");return s.forEach(e=>{const t=e.attributes;for(let n=t.length-1;n>=0;n--){const s=t[n].name;(s.startsWith("on")||s==="style")&&e.removeAttribute(s)}}),t.innerHTML},o=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(r(),o.disconnect())})});o.observe(t)})()