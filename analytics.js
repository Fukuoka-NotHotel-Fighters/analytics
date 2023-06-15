let events = [];

async function trackEvent(eventType, id) {
    let event = {
        url: window.location.href, // Add this line
        time: new Date(),
        eventType: eventType,
        id: id
    };
    events.push(event);

    // Send the event to your server
    let response = await fetch('https://your-api-url.com/track-event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    });

    if (!response.ok) {
        console.error('Error sending event to server:', response.statusText);
    }
}

document.querySelectorAll('[id]').forEach((element) => {
    element.addEventListener('mouseover', function() {
        trackEvent('mouseover', this.id);
    });
    element.addEventListener('click', function() {
        trackEvent('click', this.id);
    });
});
