let currentLang = 'en';

// Language Toggle
document.getElementById('langToggle').addEventListener('click', function() {
    document.body.classList.add('lang-transitioning');
    
    setTimeout(() => {
        currentLang = currentLang === 'en' ? 'hi' : 'en';
        
        this.textContent = currentLang === 'en' ? 'हिंदी' : 'English';
        
        // Update all text elements
        document.querySelectorAll('.lang-text').forEach(elem => {
            const text = elem.getAttribute(`data-${currentLang}`);
            if (text) {
                elem.innerHTML = text;
            }
        });
        
        // Update all input/textarea placeholders
        document.querySelectorAll('.lang-field').forEach(field => {
            const placeholder = field.getAttribute(`data-${currentLang}`);
            if (placeholder) {
                field.placeholder = placeholder;
            }
        });
        
        // Update all select dropdowns
        document.querySelectorAll('.lang-select').forEach(select => {
            Array.from(select.options).forEach(option => {
                const text = option.getAttribute(`data-${currentLang}`);
                if (text) {
                    option.textContent = text;
                }
            });
        });
        
        document.body.classList.remove('lang-transitioning');
    }, 150);
});

// Handle Employer Form Submission
document.getElementById('employerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        type: 'employer',
        name: this.name.value,
        phone: this.phone.value,
        business: this.business.value || 'Not provided',
        location: this.location.value,
        skill: this.skill.value,
        date: this.date.value,
        timeslot: this.timeslot.value,
        hours: this.hours.value,
        additional: this.additional.value || 'None',
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    await submitForm(this, formData);
});

// Handle Employee Form Submission
document.getElementById('employeeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const skills = Array.from(this.querySelectorAll('input[name="skills"]:checked'))
        .map(cb => cb.value)
        .join(', ');

    if (!skills) {
        showMessage(this, currentLang === 'en' ? 'Please select at least one skill' : 'कृपया कम से कम एक कौशल चुनें', 'error');
        return;
    }

    const formData = {
        type: 'employee',
        name: this.name.value,
        phone: this.phone.value,
        age: this.age.value,
        location: this.location.value,
        skills: skills,
        experience: this.experience.value || 'Not specified',
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    await submitForm(this, formData);
});

async function submitForm(form, data) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = currentLang === 'en' ? 'Submitting...' : 'जमा किया जा रहा है...';

    try {
        console.log('Form data:', data);
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const successMsg = currentLang === 'en' 
            ? 'Success! Redirecting to WhatsApp...' 
            : 'सफलता! व्हाट्सएप पर भेजा जा रहा है...';
        showMessage(form, successMsg, 'success');
        
        form.reset();
        
        setTimeout(() => {
            let message;
            if (data.type === 'employer') {
                message = `Hi, I need workers for my business.\n\nName: ${data.name}\nPhone: ${data.phone}\nBusiness: ${data.business}\nLocation: ${data.location}\nSkill Required: ${data.skill}\nDate: ${data.date}\nTime: ${data.timeslot}\nHours: ${data.hours}\nAdditional: ${data.additional}`;
            } else {
                message = `Hi, I want to register as a worker.\n\nName: ${data.name}\nPhone: ${data.phone}\nAge: ${data.age}\nLocation: ${data.location}\nSkills: ${data.skills}\nExperience: ${data.experience}`;
            }
            
            const whatsappUrl = `https://wa.me/918180092971?text=${encodeURIComponent(message)}`;
            window.location.href = whatsappUrl;
        }, 1500);
        
    } catch (error) {
        console.error('Error:', error);
        const errorMsg = currentLang === 'en'
            ? 'Something went wrong. Please WhatsApp us directly at 8180092971'
            : 'कुछ गलत हो गया। कृपया सीधे 8180092971 पर व्हाट्सएप करें';
        showMessage(form, errorMsg, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

function showMessage(form, text, type) {
    const existingMsg = form.querySelector('.message');
    if (existingMsg) existingMsg.remove();
    
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.textContent = text;
    
    form.insertBefore(msg, form.firstChild);
    
    setTimeout(() => msg.remove(), 5000);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});