const projects = window.PORTFOLIO_PROJECTS;
const grid = document.querySelector('#project-grid');
const dialog = document.querySelector('#project-dialog');
const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
let activeProject = null;
let photoIndex = 0;
function render(filter = 'all') {
 const visible = projects.filter(project => filter === 'all' || project.category === filter);
 grid.innerHTML = visible.map(project => '<button class="project-card" data-project="' + project.id + '" aria-label="View ' + escapeHtml(project.title) + ' details"><div class="project-image ' + (project.category === 'film' ? 'film-art' : '') + '">' + (project.image ? '<img loading="lazy" src="' + project.image + '" alt="' + escapeHtml(project.alt) + '">' : '<strong>Stories<br>in motion.</strong>') + (project.category === 'film' ? '<span class="status-tag">FILMS FORTHCOMING</span>' : '') + '<span class="view-label">Explore</span></div><div class="card-caption"><div><h3>' + escapeHtml(project.title) + '</h3><p>' + escapeHtml(project.type) + '</p></div><span class="card-plus" aria-hidden="true">+</span></div></button>').join('');
 document.querySelector('#work-count').textContent = visible.length + (visible.length === 1 ? ' selection' : ' selections');
}
function openDialog(target){target.showModal();document.body.classList.add('modal-open');}
function closeDialog(target){target.close();document.body.classList.remove('modal-open');}
function showPhoto(index){
 if(!activeProject?.gallery)return;
 photoIndex=(index+activeProject.gallery.length)%activeProject.gallery.length;
 const photo=activeProject.gallery[photoIndex];
 const image=document.querySelector('.gallery-image'); image.src=photo.src;image.alt=photo.alt;
 document.querySelector('.gallery-counter').textContent=(photoIndex+1)+' / '+activeProject.gallery.length;
 document.querySelectorAll('[data-photo]').forEach(button=>{const active=Number(button.dataset.photo)===photoIndex;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
}
function openProject(project){
 activeProject=project;photoIndex=0;
 const films=(project.videos||[]).map(video=>'<div class="film-row"><strong>'+escapeHtml(video.title)+'</strong><span>'+(/^[a-zA-Z0-9_-]{11}$/.test(video.youtubeId)?'WATCH BELOW':'UPCOMING')+'</span></div>'+(/^[a-zA-Z0-9_-]{11}$/.test(video.youtubeId)?'<iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/'+video.youtubeId+'" title="'+escapeHtml(video.title)+'" allow="fullscreen; picture-in-picture" allowfullscreen></iframe>':'')).join('');
 let media=project.image?'<img class="dialog-image" src="'+project.image+'" alt="'+escapeHtml(project.alt)+'">':'';
 if(project.gallery){
 const photo=project.gallery[0];
 media='<div class="gallery-stage" aria-label="Exhibition photo gallery"><img class="gallery-image" src="'+photo.src+'" alt="'+escapeHtml(photo.alt)+'"><div class="gallery-navigation"><button data-direction="-1" aria-label="Previous photograph">Previous</button><span class="gallery-counter" role="status" aria-live="polite">1 / '+project.gallery.length+'</span><button data-direction="1" aria-label="Next photograph">Next</button></div><div class="gallery-thumbnails" role="group" aria-label="Choose a photograph">'+project.gallery.map((photo,index)=>'<button data-photo="'+index+'" class="'+(index===0?'active':'')+'" aria-label="Show photograph '+(index+1)+'" aria-pressed="'+(index===0)+'"><img src="'+photo.src+'" alt="" loading="lazy"></button>').join('')+'</div></div>';
 }
 document.querySelector('#dialog-content').innerHTML=media+'<div class="dialog-body"><p class="eyebrow">'+escapeHtml(project.role)+'</p><h2 id="dialog-title">'+escapeHtml(project.title)+'</h2><p>'+escapeHtml(project.description)+'</p>'+(project.details?'<div class="experience-details">'+project.details.map(detail=>'<section><h3>'+escapeHtml(detail.title)+'</h3><p>'+escapeHtml(detail.text)+'</p></section>').join('')+'</div>':'')+(project.note?'<p class="detail-note">'+escapeHtml(project.note)+'</p>':'')+(films?'<div class="film-list">'+films+'</div>':'')+'</div>';
 openDialog(dialog);
}
grid.addEventListener('click',event=>{const card=event.target.closest('[data-project]');if(card)openProject(projects.find(project=>project.id===card.dataset.project));});
dialog.addEventListener('click',event=>{const direction=event.target.closest('[data-direction]');const photo=event.target.closest('[data-photo]');if(direction)showPhoto(photoIndex+Number(direction.dataset.direction));if(photo)showPhoto(Number(photo.dataset.photo));});
dialog.addEventListener('keydown',event=>{if(!activeProject?.gallery)return;if(event.key==='ArrowRight'){event.preventDefault();showPhoto(photoIndex+1);}if(event.key==='ArrowLeft'){event.preventDefault();showPhoto(photoIndex-1);}});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});render(button.dataset.filter);}));
document.querySelectorAll('dialog').forEach(target=>{target.querySelector('.dialog-close').addEventListener('click',()=>closeDialog(target));target.addEventListener('click',event=>{if(event.target===target){const rect=target.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeDialog(target);}});target.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(target===dialog){document.querySelectorAll('#dialog-content iframe').forEach(frame=>frame.remove());activeProject=null;}});});
document.querySelector('#credits-open').addEventListener('click',()=>openDialog(document.querySelector('#credits-dialog')));
const motionButton=document.querySelector('#motion-toggle');
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
let paused=motionPreference.matches;
function updateMotion(){document.body.classList.toggle('motion-paused',paused);motionButton.setAttribute('aria-pressed',String(paused));motionButton.innerHTML=paused?'Motion paused <span aria-hidden="true">▶</span>':'Pause motion <span aria-hidden="true">Ⅱ</span>';motionButton.disabled=motionPreference.matches;motionButton.title=motionPreference.matches?'Motion follows your reduced-motion device setting':'';}
motionButton.addEventListener('click',()=>{paused=!paused;updateMotion();});motionPreference.addEventListener('change',event=>{paused=event.matches;updateMotion();});updateMotion();
document.querySelector('#year').textContent=new Date().getFullYear();render();
