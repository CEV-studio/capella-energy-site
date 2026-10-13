const header=document.querySelector('.site-header');
const toggle=document.querySelector('.menu-toggle');
if(toggle&&header){toggle.addEventListener('click',()=>{const open=header.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});}
document.querySelectorAll('.country-switch a').forEach(link=>{const country=link.textContent.trim().toLowerCase();if(country==='france')link.href='https://capellaenergy.fr/';if(country==='belgique')link.href='https://capellaenergy.be/';});
document.querySelectorAll('[data-profile-select]').forEach(select=>{const sync=()=>document.querySelectorAll('[data-company-fields]').forEach(group=>group.classList.toggle('hidden',select.value!=='professionnel'));select.addEventListener('change',sync);sync();});
document.querySelectorAll('form[data-capella-form]').forEach(form=>{form.addEventListener('submit',()=>{const submit=form.querySelector('[type="submit"]');if(submit){submit.disabled=true;submit.textContent='Envoi en cours…';}});});
