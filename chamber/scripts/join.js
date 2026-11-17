// MEMBERSHIP APPLICATION

// Capture the local date and time when the form loads.
const timestampField = document.querySelector("#timestamp");

if (timestampField) {
    const loadedAt = new Date();
    timestampField.value = loadedAt.toISOString();
}

// MEMBERSHIP MODALS

const modalButtons = document.querySelectorAll("[data-modal]");

modalButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const modalId = button.dataset.modal;
        const modal = document.getElementById(modalId);

        if (modal) {
            modal.showModal();
        }
    });
});


// Close buttons
const closeButtons = document.querySelectorAll(".modal-close");

closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const modal = button.closest("dialog");

        if (modal) {
            modal.close();
        }
    });
});


// Close a modal when clicking its backdrop.
document.querySelectorAll(".membership-modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.close();
        }
    });
});
