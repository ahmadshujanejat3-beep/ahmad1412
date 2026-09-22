/*
  تنظیمات اصلی سایت
  1) شماره WhatsApp خودتان را با فرمت کشور وارد کنید، مثال: 937XXXXXXXX
  2) برای دریافت فرم‌ها به‌صورت ایمیل، Formspree endpoint خودتان را در FORMSPREE_ENDPOINT قرار دهید.
*/
const CONFIG = {
  whatsapp: "937XXXXXXXX",
  formspreeEndpoint: "", // مثال: https://formspree.io/f/xxxxxxxx
  businessName: "دیتابیس‌ساز"
};

const orderForm = document.getElementById("orderForm");
const formNote = document.getElementById("formNote");
const service = document.getElementById("service");

function setService(value){
  if(!value) return;
  const options=[...service.options].map(o=>o.text);
  const found=options.findIndex(x=>x===value);
  if(found>=0) service.selectedIndex=found;
  document.getElementById("order").scrollIntoView({behavior:"smooth"});
}

document.querySelectorAll("[data-service]").forEach(el=>{
  el.addEventListener("click",()=>setService(el.dataset.service));
});

document.getElementById("phoneDisplay").textContent =
  CONFIG.whatsapp.includes("X") ? "شماره خود را در script.js وارد کنید" : "+"+CONFIG.whatsapp;

orderForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(orderForm).entries());
  const text =
`سلام، یک سفارش جدید دارم.
نام: ${data.name}
شماره: ${data.phone}
نوع درخواست: ${data.service}
بودجه: ${data.budget || "مشخص نشده"}
توضیحات: ${data.message || "ندارد"}`;

  // اگر Formspree تنظیم شده باشد، فرم هم به ایمیل شما ارسال می‌شود.
  if(CONFIG.formspreeEndpoint){
    try{
      const res=await fetch(CONFIG.formspreeEndpoint,{
        method:"POST",
        headers:{"Accept":"application/json","Content-Type":"application/json"},
        body:JSON.stringify(data)
      });
      if(!res.ok) throw new Error("form error");
      formNote.textContent="سفارش با موفقیت ارسال شد. به‌زودی با شما تماس گرفته می‌شود.";
      formNote.style.color="#008f70";
      orderForm.reset();
      return;
    }catch(err){
      formNote.textContent="ارسال آنلاین انجام نشد؛ از WhatsApp استفاده کنید.";
      formNote.style.color="#b45309";
    }
  }

  // روش پشتیبان: ساخت پیام WhatsApp
  if(CONFIG.whatsapp && !CONFIG.whatsapp.includes("X")){
    window.open("https://wa.me/"+CONFIG.whatsapp+"?text="+encodeURIComponent(text),"_blank");
  }else{
    formNote.textContent="برای فعال شدن سفارش، شماره WhatsApp خود را در script.js وارد کنید.";
    formNote.style.color="#b45309";
  }
});

document.querySelector(".menu").addEventListener("click",()=>{
  const links=document.querySelector(".navlinks");
  links.style.display=links.style.display==="flex"?"none":"flex";
  links.style.flexDirection="column";
  links.style.position="absolute";
  links.style.top="70px";
  links.style.right="4%";
  links.style.background="white";
  links.style.padding="15px";
  links.style.borderRadius="12px";
  links.style.boxShadow="0 10px 30px #0002";
});
