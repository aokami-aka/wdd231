// APPLICATION CONFIRMATION

const params = new URLSearchParams(window.location.search);


// Display submitted values safely.
function displayValue(elementId, parameterName) {
    const element = document.getElementById(elementId);

    if (!element) return;

    const value = params.get(parameterName);

    element.textContent = value && value.trim()
        ? value
        : "Not provided";
}


// Required form information
displayValue("submittedFirstName", "firstName");
displayValue("submittedLastName", "lastName");
displayValue("submittedEmail", "email");
displayValue("submittedPhone", "phone");
displayValue("submittedOrganization", "organization");


// Format the submitted timestamp.
const timestampElement = document.getElementById("submittedTimestamp");
const timestampValue = params.get("timestamp");

if (timestampElement) {
    if (timestampValue) {
        const submittedDate = new Date(timestampValue);

        if (!Number.isNaN(submittedDate.getTime())) {
            timestampElement.textContent = submittedDate.toLocaleString(
                "en-US",
                {
                    dateStyle: "long",
                    timeStyle: "short"
                }
            );
        } else {
            timestampElement.textContent = "Invalid date";
        }
    } else {
        timestampElement.textContent = "Not provided";
    }
}
