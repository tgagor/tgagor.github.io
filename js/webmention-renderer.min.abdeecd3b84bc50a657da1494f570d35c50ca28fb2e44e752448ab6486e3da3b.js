(function(){const t=document.getElementById("webmentions-container");if(!t)return;const a=t.getAttribute("data-targets")||"",n=a.split(",").map(e=>e.trim()).filter(Boolean);if(!n.length)return;const r="https://webmention.io/api/mentions.jf2",s=new URLSearchParams({"sort-by":"published","sort-dir":"up",per_page:"200"});n.forEach(e=>s.append("target[]",e));const c=async()=>{try{t.innerHTML="<p>Loading interactions...</p>";const e=await fetch(`${r}?${s.toString()}`);if(!e.ok)throw new Error("Failed to load webmentions");const n=await e.json();l(n.children||[])}catch(e){t.innerHTML="<p>Could not load interaction data.</p>",console.error(e)}},o=e=>{if(e.rels?.canonical){const t=e.rels.canonical,n=Array.isArray(t)?t[0]:t;if(n)return n}return e.url?e.url:e.author?.url?e.author.url:""},l=n=>{if(!n||n.length===0){t.innerHTML="<p></p>";return}const a=[],i=[];n.forEach(e=>{const t=e["wm-property"];t==="like-of"||t==="repost-of"?a.push(e):t==="in-reply-to"||t==="mention-of"?i.push(e):i.push(e)});let s="";if(a.length>0){const t=new Set,n=[];a.forEach(e=>{const o=e.author&&(e.author.url||e.author.uid||e.author.name)||e.url||"",s=o||e.author&&e.author.name||JSON.stringify(e);t.has(s)||(t.add(s),n.push(e))}),s+=`<div class="webmentions-likes" aria-live="polite">`,s+=`<h4 class="webmentions-heading">Likes</h4>`,s+=`<ul class="webmention-likes-list" role="list">`,n.forEach(t=>{const n=e(t.author?.name||"Unknown"),r=t.author?.photo||"",u=t.author?.url||"",c=t["wm-property"]||"";let i="";if(r)i=`<img src="${e(r)}" alt="${n}" class="webmention-avatar" loading="lazy">`;else{const t=e((n||"U").charAt(0).toUpperCase());i=`<span class="webmention-avatar webmention-avatar--placeholder" aria-hidden="true">${t}</span>`}const a=o(t),l=a?`<a href="${e(a)}" class="webmention-like-link" target="_blank" rel="nofollow noopener" title="${n}">`:`<span class="webmention-like-link" title="${n}">`,d=a?`</a>`:`</span>`;s+=`
          <li class="webmention-like-item ${c}">
            ${l}
              ${i}
              <span class="sr-only">${n} ${c==="repost-of"?"reposted":"liked"} this</span>
            ${d}
          </li>
        `}),s+=`</ul></div>`}i.length>0&&(s+=`<div class="webmentions-mentions" aria-live="polite">`,s+=`<h4 class="webmentions-heading">Mentions</h4>`,s+=`<ul class="webmentions-list">`,i.forEach(t=>{const c=e(t.author?.name||"Unknown"),l=t.author?.photo||"",m=t.author?.url||"",h=t.published?new Date(t.published).toLocaleDateString():"",u=t.content?.html||t.content?.text||"",n=t["wm-property"];let a="mentioned";n==="like-of"&&(a="liked"),n==="repost-of"&&(a="reposted"),n==="in-reply-to"&&(a="replied");const r=o(t);let i="";if(l)i=`<img src="${e(l)}" alt="${c}" class="webmention-icon-img" width="48" height="48" loading="lazy">`;else{let e="💬";n==="like-of"&&(e="❤️"),n==="repost-of"&&(e="🔁"),n==="in-reply-to"&&(e="↩️"),i=`<div class="webmention-icon-emoji" aria-hidden="true">${e}</div>`}r&&(i=`<a href="${e(r)}" target="_blank" rel="nofollow noopener">${i}</a>`),s+=`
          <li class="webmention-item ${e(n||"")}">
            <div class="webmention-row">
              <div class="webmention-icon-column">
                ${i}
              </div>
              <div class="webmention-body-column">
                <div class="webmention-meta-top">
                  <span class="webmention-author">${r?`<a href="${e(r)}" target="_blank" rel="nofollow noopener">${c}</a>`:c}</span>
                  <span class="webmention-verb">${a}</span>
                  <span class="webmention-date">${h}</span>
                </div>
                ${(n==="in-reply-to"||n==="mention-of")&&u?`<div class="webmention-content">${d(u)}</div>`:``}
              </div>
            </div>
          </li>
        `}),s+=`</ul></div>`),t.innerHTML=s},e=e=>(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),d=e=>{const t=document.createElement("div");t.innerHTML=e;const n=["script","style","iframe","object","embed","form","link","meta"];n.forEach(e=>{const n=t.querySelectorAll(e);n.forEach(e=>e.remove())});const s=t.querySelectorAll("*");return s.forEach(e=>{const t=e.attributes;for(let n=t.length-1;n>=0;n--){const s=t[n].name;(s.startsWith("on")||s==="style")&&e.removeAttribute(s)}}),t.innerHTML},i=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(c(),i.disconnect())})});i.observe(t)})()