export default function articleFeedback(id) {
    const feedbackDiv = document.getElementById(id);
    if (feedbackDiv) {
        const submitBtn = feedbackDiv.querySelector('button[type="submit"]');
        const yesRadio = (() => {
            const eng = feedbackDiv.querySelector('input[value="Yes"]');
            const nor = feedbackDiv.querySelector('input[value="Ja"]');
            if (eng) { return eng; } else if (nor) { return nor; }
            return false;
        })();
        const noRadio = (() => {
            const eng = feedbackDiv.querySelector('input[value="No"]');
            const nor = feedbackDiv.querySelector('input[value="Nei"]');
            if (eng) { return eng; } else if (nor) { return nor; }
            return false;
        })();
        if (submitBtn) submitBtn.style.display = 'none';
        if (yesRadio) {
            yesRadio.addEventListener('click', () => {
                submitBtn.style.display = 'block';
            });
        }
        if (noRadio) {
            noRadio.addEventListener('click', () => {
                submitBtn.style.display = 'block';
            });
        }
    }
}
