// Google Apps Script Web App URL - we'll add this after setting up Google Sheets
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';

// Handle Employer Form Submission
document.getElementById('employerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        type: 'employer',
        name: this.name.value,
        phone: this.phone.value,
        business: this.business.value,
        location: this.location.value,
        requirement: this.requirement.value,
        timestamp: new Date().toISOString()
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
        showMessage(this, 'Please select at least one skill', 'error');
        return;
    }

    const formData = {
        type: 'employee',
        name: this.name.value,
        phone: this.phone.value,
        age: this.age.value,
        location: this.location.value,
        skills: skills,
        experience: this.experience.value,
        timestamp: new Date().toISOString()
    };

    await submitForm(this, formData);
});

async function submitForm(form, data) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
        // For now, just console log and show success
        // We'll connect to Google Sheets in next step
        console.log('Form data:', data);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showMessage(form, 'Success! We will contact you on WhatsApp within 30 minutes.', 'success');
        form.reset();
        
        // Redirect to WhatsApp after 2 seconds
        setTimeout(() => {
            const message = data.type === 'employer' 
                ? `Hi, I submitted the employer form. Name: ${data.name}, Need: ${data.requirement}`
                : `Hi, I submitted the worker registration. Name: ${data.name}, Skills: ${data.skills}`;
            
            window.open(`https://wa.me/918180092971?text=${encodeURIComponent(message)}`, '_blank');
        }, 2000);
        
    } catch (error) {
        console.error('Error:', error);
        showMessage(form, 'Something went wrong. Please WhatsApp us directly at 8180092971', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

function showMessage(form, text, type) {
    // Remove existing messages
    const existingMsg = form.querySelector('.message');
    if (existingMsg) existingMsg.remove();
    
    // Create new message
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.textContent = text;
    
    form.insertBefore(msg, form.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => msg.remove(), 5000);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});