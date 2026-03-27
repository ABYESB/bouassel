// --- 1. الإعدادات والروابط الأساسية ---
const scriptURL = 'https://script.google.com/macros/s/AKfycbwLqAnOilOT8L92eIgdv4Chbaoc4UY_awAFnVYIarLM4l7GUA1dMwiVFLYx9tU0iesc/exec';
let selectedSlots = []; 

// دالة ذكية تجلب تاريخ "الاثنين" للأسبوع الحالي مهما كان اليوم
// يجب أن تكون هذه السطور في أعلى الملف لتراها كل الدوال
function getMonday(d) {
    d = new Date(d);
    var day = d.getDay();
    var diff = d.getDate() - day + (day == 0 ? -6 : 1);
    var monday = new Date(d.getFullYear(), d.getMonth(), diff, 12, 0, 0); 
    return monday;
}

// تعريف المتغير هنا يجعله متاحاً لـ initTable وغيرها
let currentStartDate = getMonday(new Date());

// --- 2. تنسيق التاريخ DD/MM/YYYY ---
function getFormattedDate(date) {
    let d = new Date(date);
    let day = String(d.getDate()).padStart(2, '0');
    let month = String(d.getMonth() + 1).padStart(2, '0');
    let year = d.getFullYear();
    return `${day}/${month}/${year}`;
}


function handleData(bookings) {
    // التأكد من أن البيانات المستلمة مصفوفة صحيحة
    if (!Array.isArray(bookings)) return;

    bookings.forEach(booking => {
        // البحث عن الخانة في الجدول بناءً على التاريخ والساعة المستلمين من جوجل
        const slot = document.querySelector(`[data-date="${booking.date}"][data-hour="${booking.hour}"]`);
        
        if (slot) {
            slot.innerText = "محجوز";
            slot.style.backgroundColor = "#ef4444"; // اللون الأحمر
            slot.style.color = "white";
            
            // هذا السطر هو الأهم: يمنع أي شخص من الضغط على المربع المحجوز نهائياً
            slot.style.pointerEvents = "none"; 
            
            // إضافة كلاس للتمييز البرمجي إذا احتجنا له في التنسيق (CSS)
            slot.classList.add("booked");
        }
    });
}

// 2. دالة جلب البيانات من جوجل

function loadExistingBookings() {

    const script = document.createElement('script');

    // تأكد أن scriptURL هو الرابط الجديد الذي ينتهي بـ /exec

    script.src = `${scriptURL}?callback=handleData&t=${new Date().getTime()}`;

    document.body.appendChild(script);

}



// 3. بناء الجدول وتحديثه (النسخة المصححة لضبط ترحيل الأيام)
// 3. بناء الجدول وتحديثه (النسخة النهائية لحل مشكلة إزاحة الأيام)
function initTable() {
    const tableBody = document.getElementById('tableBody');
    const headerRow = document.getElementById('headerRow');
    const footerRow = document.getElementById('footerRow');
    const dateDisplay = document.getElementById('dateDisplay');
    
    if (!tableBody || !headerRow) return;

    tableBody.innerHTML = '';
    headerRow.innerHTML = '<th>الساعة</th>';
    if (footerRow) footerRow.innerHTML = '<th>الساعة</th>';
    
    const daysArr = ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"];
    
    let displayDate = new Date(currentStartDate);
    displayDate.setDate(displayDate.getDate() + 3); 
    dateDisplay.innerText = displayDate.toLocaleDateString('ar-MA', { month: 'long', year: 'numeric' });

    let currentWeekDates = [];
    for (let i = 0; i < 7; i++) {
        let d = new Date(currentStartDate);
        d.setDate(d.getDate() + i); 
        let fullDate = getFormattedDate(d);
        currentWeekDates.push({name: daysArr[i], date: fullDate}); 
        
        let cellContent = `${daysArr[i]}<br><small>${d.getDate()}</small>`;
        headerRow.innerHTML += `<th>${cellContent}</th>`;
        if (footerRow) footerRow.innerHTML += `<th>${cellContent}</th>`;
    }

    for (let hour = 8; hour <= 23; hour++) {
        let hLabel24 = `${hour}:00`; 

        // تحديد ما إذا كان الوقت صباحاً أم مساءً
        let suffix = (hour >= 12) ? "م" : "ص";
        
        let displayHour = hour;
        if (hour > 12) displayHour = hour - 12; 
        
        // إضافة الحرف (ص/م) بجانب الساعة
        let hLabel12 = `${String(displayHour).padStart(2, '0')}:00 ${suffix}`; 

        let row = `<tr><td style="background:#f0f2f5; font-weight:bold; white-space: nowrap;">${hLabel12}</td>`;
        
        for (let day = 0; day < 7; day++) {
            if (daysArr[day] === "الأحد" && hour >= 8 && hour < 12) {
                row += `<td class="slot booked" style="background-color: #ef4444; color: white; pointer-events: none;">محجوز</td>`;
            } else {
                row += `<td class="slot" 
                            data-date="${currentWeekDates[day].date}" 
                            data-day="${currentWeekDates[day].name}" 
                            data-hour="${hLabel24}" 
                            onclick="handleSlotSelection(this)">متاح</td>`;
            }
        }
        row += `</tr>`;
        tableBody.innerHTML += row;
    }
    loadExistingBookings();
}
// تشغيل السلايدر تلقائياً

function initSwiper() {

    if (typeof Swiper !== 'undefined') {

        new Swiper('.swiper-container', {

            loop: true,

            autoplay: { 

                delay: 3000, 

                disableOnInteraction: false 

            },

            pagination: { 

                el: '.swiper-pagination', 

                clickable: true 

            },

        });

    }

}



// استدعاء التشغيل عند فتح الصفحة

document.addEventListener('DOMContentLoaded', () => {

    initTable();

    loadExistingBookings();

    initSwiper(); // <--- تأكد من وجود هذا السطر هنا

});



// 7. دوال إضافية لتجنب الأخطاء

function requestVideo() {

    window.open("https://wa.me/212621403563?text=أريد تسجيل فيديو للمباراة", "_blank");

}



// استبدل الدالة القديمة بهذه
function handleSlotSelection(element) {
    // 1. منع اختيار المحجوز مسبقاً
    if (element.innerText === "محجوز" || element.classList.contains("booked")) {
        return; 
    }

    // 2. التحقق من حالة العنصر: هل هو مختار حالياً أم لا؟
    const isAlreadySelected = element.classList.contains('selected');

    // 3. إذا كان المستخدم يحاول اختيار ساعة "جديدة" (ليست خضراء بعد)
    if (!isAlreadySelected) {
        // منع الساعة الثالثة فوراً
        if (selectedSlots.length >= 2) {
            alert("⚠️ عذراً، لا يمكن حجز أكثر من ساعتين متتاليتين.");
            return; // توقف تام هنا
        }

        // منع الساعات غير المتتالية
        if (selectedSlots.length === 1) {
            const firstSlot = selectedSlots[0];
            const firstHour = parseInt(firstSlot.hour.split(':')[0]);
            const currentHour = parseInt(element.getAttribute('data-hour').split(':')[0]);
            const currentDate = element.getAttribute('data-date');

            if (Math.abs(currentHour - firstHour) !== 1 || currentDate !== firstSlot.date) {
                alert("عذراً، يجب اختيار ساعات متتالية وفي نفس اليوم.");
                return; // توقف تام هنا
            }
        }
    }

    // 4. تنفيذ التغيير في الواجهة
    element.classList.toggle('selected');
    const date = element.getAttribute('data-date');
    const hour = element.getAttribute('data-hour');
    // *** الحل الجديد: قراءة اسم اليوم من data-day مباشرة ***
    const dayName = element.getAttribute('data-day'); 

    if (element.classList.contains('selected')) {
        // أضفنا البيانات الجديدة للمصفوفة لضمان دقتها عند الإرسال
        selectedSlots.push({ hour, date, element, dayName }); 
        
        // فتح النافذة
        document.getElementById('bookingModal').style.display = "block";
        
        // تحديث النص الظاهر للمستخدم
        selectedSlots.sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
        const allHours = selectedSlots.map(s => s.hour).join(" و ");
        document.getElementById('selectedDetails').innerText = `حجز يوم ${dayName}: ${date} الساعة ${allHours}`;
    } else {
        // إزالة الساعة من المصفوفة إذا ألغى الاختيار
        selectedSlots = selectedSlots.filter(s => s.element !== element);
        
        // إذا أصبحت المصفوفة فارغة، أغلق النافذة تلقائياً
        if (selectedSlots.length === 0) {
            document.getElementById('bookingModal').style.display = "none";
        }
    }
}

// استبدل جميع نسخ closeBookingModal بهذه النسخة الواحدة فقط في نهاية الكود
function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.style.display = "none";

    // تنظيف البيانات
    const userNameInput = document.getElementById('userName');
    const userPhoneInput = document.getElementById('userPhone');
    const checkbox = document.getElementById('confirmCheckbox');

    if (userNameInput) userNameInput.value = "";
    if (userPhoneInput) userPhoneInput.value = "";
    if (checkbox) checkbox.checked = false;

    // إزالة اللون الأخضر من جميع المربعات المختارة وتفريغ القائمة
    selectedSlots.forEach(s => {
        if (s.element) s.element.classList.remove('selected');
    });
    selectedSlots = [];
    
    // إعادة تعطيل زر الإرسال
    if (typeof toggleSubmitButton === "function") toggleSubmitButton();
}



function changeWeek(direction) {

    currentStartDate.setDate(currentStartDate.getDate() + (direction * 7));

    initTable();

}




// 1. دالة موقع الملعب (تطابق زر showMap)

function showMap() {

    // رابط إحداثيات ملعب بوعسل - مكناس

    const mapUrl = "https://www.google.com/maps?q=2CQM+W4J، وليلي"; 

    window.open(mapUrl, "_blank");

}

// 2. دالة قوانين الملعب المصلحة

function toggleRules() {

    // قمنا بتغيير 'newRulesModal' إلى 'rulesModal' ليطابق اسم العنصر في الـ HTML لديك

    var modal = document.getElementById('rulesModal');

    if (modal) {

        if (modal.style.display === 'block') {

            modal.style.display = 'none';

        } else {

            modal.style.display = 'block';

        }

    }

}



// دالة إغلاق النافذة (تأكد من مطابقة الاسم أيضاً)

function closeRulesModal() {

    document.getElementById('rulesModal').style.display = 'none';

}



// إغلاق النافذة عند الضغط خارجها

window.onclick = function(event) {

    const modal = document.getElementById('rulesModal');

    if (event.target == modal) {

        modal.style.display = 'none';

    }

}

async function submitFinalBooking() {
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    const btn = document.querySelector('.modal-footer button'); 

    if (!name || !phone) return alert("يرجى إكمال البيانات");

    if(btn) {
        btn.disabled = true;
        btn.innerText = "جاري التحقق من التوفر...";
    }

    const tempSlots = [...selectedSlots]; 
    const dayName = tempSlots[0].dayName; 
    const bookingDate = tempSlots[0].date;
    const bookingHours = tempSlots.map(s => s.hour).join(" و ");
    
    // --- التصحيح الجذري هنا ---
    // 1. تنظيف الرقم من أي رموز مخفية أو فراغات
    const myNumber = "212632412959"; 

    // 2. استخدام encodeURIComponent لضمان عمل الرابط على جميع المتصفحات
    const messageContent = `⚽ *حجز جديد لملعب بوعسل* ⚽\n\n` +
                           `*الاسم:* ${name}\n` +
                           `*الهاتف:* ${phone}\n` +
                           `*اليوم:* ${dayName}\n` +
                           `*التاريخ:* ${bookingDate}\n` +
                           `*الوقت:* ${bookingHours}\n\n` +
                           `يرجى تأكيد الحجز من طرفكم.`;

    const whatsappURL = "https://wa.me/" + myNumber + "?text=" + encodeURIComponent(messageContent);

    try {
        for (const slot of tempSlots) {
            const response = await fetch(scriptURL, {
                method: 'POST',
                body: JSON.stringify({ 
                    hour: slot.hour, 
                    date: slot.date, 
                    dayName: slot.dayName,
                    name: name, 
                    phone: phone 
                })
            });

            const result = await response.json();

            if (result.result === "error") {
                alert("⚠️ " + result.message);
                if (typeof loadExistingBookings === 'function') loadExistingBookings(); 
                if(btn) {
                    btn.disabled = false;
                    btn.innerText = "تأكيد الحجز";
                }
                return; 
            }
        }

        tempSlots.forEach(slot => {
            if (slot.element) {
                slot.element.innerText = "محجوز";
                slot.element.style.backgroundColor = "#ef4444";
                slot.element.style.color = "white";
                slot.element.style.pointerEvents = "none";
                slot.element.classList.add("booked");
                slot.element.classList.remove("selected");
            }
        });

        closeBookingModal();
        selectedSlots = []; 

        // استخدام window.open لفتح الواتساب في نافذة جديدة وضمان عدم تعليق الموقع
        window.open(whatsappURL, '_blank');

    } catch (error) {
        console.error("خطأ في الخلفية:", error);
        if (typeof loadExistingBookings === 'function') loadExistingBookings();
        alert("حدث خطأ أو أن الوقت حجز للتو، يرجى مراجعة الجدول.");
        if(btn) {
            btn.disabled = false;
            btn.innerText = "تأكيد الحجز";
        }
    }
}
// دالة زر دعم الجمعية
function showDonationInfo() {
    alert("شكراً لرغبتك في دعم جمعية شباب بوعسل!\n\nيمكنكم التواصل معنا عبر الهاتف أو البريد الإلكتروني لتنسيق الدعم المادي أو العيني.");
}

// دالة مسؤول الموقع (إذا كنت تريد إعادة تفعيل لوحة التحكم)
function openAdminPanel() {
    const pass = prompt("🔐 أدخل كلمة مرور الإدارة:");
    if (pass === "1111") {
        const hourlyRate = 60; // السعر المحدد: 60 درهم للساعة
        
        // جلب البيانات من جوجل
        fetch(`${scriptURL}?callback=analyzeData&t=${new Date().getTime()}`)
            .then(response => response.text())
            .then(text => {
                // تحويل بيانات JSONP إلى مصفوفة
                const startIdx = text.indexOf('(') + 1;
                const endIdx = text.lastIndexOf(')');
                const jsonData = JSON.parse(text.substring(startIdx, endIdx));

                // إنشاء مصفوفة لتخزين بيانات كل شهر (من 1 إلى 12)
                let monthlyStats = Array(12).fill(0).map(() => ({ hours: 0, revenue: 0 }));

                jsonData.forEach(booking => {
                    // استخراج الشهر من التاريخ (تنسيق DD/MM/YYYY)
                    const dateParts = booking.date.split('/');
                    if (dateParts.length === 3) {
                        const monthIndex = parseInt(dateParts[1]) - 1; // تحويل الشهر لرقم من 0 إلى 11
                        if (monthIndex >= 0 && monthIndex < 12) {
                            monthlyStats[monthIndex].hours += 1;
                            monthlyStats[monthIndex].revenue += hourlyRate;
                        }
                    }
                });

                // تجهيز النص النهائي للعرض في النافذة
                const monthNames = [
                    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", 
                    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
                ];

                let report = "📊 التقرير المالي السنوي (60 درهم/ساعة):\n";
                report += "----------------------------------------\n";
                
                let grandTotalRevenue = 0;
                let hasData = false;

                monthlyStats.forEach((stat, index) => {
                    if (stat.hours > 0) {
                        report += `📅 ${monthNames[index]}: ${stat.hours} ساعة ⬅️ ${stat.revenue} درهم\n`;
                        grandTotalRevenue += stat.revenue;
                        hasData = true;
                    }
                });

                if (!hasData) {
                    report += "\n⚠️ لا توجد بيانات حجز مسجلة بعد.";
                } else {
                    report += "----------------------------------------\n";
                    report += `💰 إجمالي مداخل السنة: ${grandTotalRevenue} درهم`;
                }

                alert(report);
            })
            .catch(err => alert("حدث خطأ أثناء جلب التقارير: " + err));
            
    } else {
        alert("❌ كلمة مرور خاطئة");
    }
}
function openEmail() {
    // نستخدم window.open مع _blank لضمان الخروج من إطار الموقع
    window.open("mailto:3dworkben@gmail.com?subject=استفسار ", "_blank");
}
// دالة فتح وإغلاق نافذة الانخراط
function toggleMembership() {
    const modal = document.getElementById('membershipModal');
    if (modal.style.display === "block") {
        modal.style.display = "none";
    } else {
        modal.style.display = "block";
    }
}

// دالة إرسال بيانات المنخرط للواتساب
function submitMembership() {
    const name = document.getElementById('memberName').value;
    const age = document.getElementById('memberAge').value;


    if (!name || !age ) {
        alert("المرجو ملء جميع الخانات (الاسم، العمر، )");
        return;
    }

    const message = `طلب انخراط جديد في جمعية شباب بوعسل:
📝 الاسم: ${name}
🎂 العمر: ${age} سنة
---
أرغب في الانخراط والاستفادة من أنشطة الجمعية والتدريبات الأسبوعية.`;

    // استبدل الرقم برقمك الخاص
    const whatsappUrl = `https://wa.me/212617094811?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}
// دالة لتفعيل أو تعطيل زر الإرسال بناءً على خانة الإقرار
function toggleSubmitButton() {
    const checkbox = document.getElementById('confirmCheckbox');
    const submitBtn = document.getElementById('finalConfirmBtn');
    
    if (checkbox.checked) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
    } else {
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.5";
    }
}

let deferredPrompt;
const installContainer = document.getElementById('installContainer');
const btnInstall = document.getElementById('btnInstall');

// الاستماع لحدث التثبيت التلقائي ومنعه مؤقتاً
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // منع المتصفح من إظهار رسالته الخاصة
    deferredPrompt = e;  // حفظ الحدث لاستخدامه عند ضغط الزر
    
    // إظهار الزر الخاص بنا للمستخدم
    installContainer.style.display = 'block';
});

// تنفيذ التثبيت عند الضغط على الزر
btnInstall.addEventListener('click', (e) => {
    // إخفاء الزر بعد الضغط
    installContainer.style.display = 'none';
    
    // إظهار نافذة التثبيت الأصلية
    deferredPrompt.prompt();
    
    // معرفة اختيار المستخدم (وافق أم رفض)
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
    });
});

// إخفاء الزر إذا تم تثبيت التطبيق بنجاح
window.addEventListener('appinstalled', (evt) => {
    installContainer.style.display = 'none';
    console.log('App was successfully installed');
});
/* 1. الحل البرمجي: التحديث التلقائي لمنع تضارب الحجوزات */
// يقوم هذا الكود بسؤال "جوجل شيت" عن أي حجز جديد كل 30 ثانية
setInterval(() => {
    console.log("جاري تحديث الحجوزات لتجنب التضارب بين المستخدمين...");
    if (typeof loadExistingBookings === 'function') {
        loadExistingBookings(); 
    }
}, 30000); // 30000 ميلي ثانية تعني 30 ثانية
