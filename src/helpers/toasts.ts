// Import SweetAlert2
import Swal from "sweetalert2";

// Create a SweetAlert2 mixin for toasts
const Toast = Swal.mixin({
    toast: true, // Enable toast
    position: "top-end", // Position of the toast
    iconColor: "white", // Color of the icon
    customClass: {
        popup: "colored-toast", // Custom class for the popup
    },
    showConfirmButton: false, // Hide the confirm button
    timer: 4000, // Auto-close the toast after 4 seconds
    timerProgressBar: true, // Show a progress bar for the timer
});

// Function to show an error toast
const errorToast = async (text: string) =>
    await Toast.fire({
        icon: "error", // Error icon
        title: text, // Display the provided text as the title
    });

// Function to show a toast with an access code
const accessCodeToast = async (accessCode: string) => {
    Swal.fire({
        icon: "success", // Success icon
        title: "Click to copy this Call Id and Share with your friend:", // Title text
        text: accessCode, // Display the access code as text
        showCancelButton: false, // Hide the cancel button
        confirmButtonText: "Copy ID", // Text for the confirm button
        allowOutsideClick: false, // Prevent closing when clicking outside
        preConfirm: () => {
            // Use the Clipboard API to copy the access code when the "Copy ID" button is clicked
            navigator.clipboard
                .writeText(accessCode)
                .then(() => {
                    // Show a confirmation toast when the text is successfully copied
                    Toast.fire({
                        icon: "success", // Success icon
                        title: "Call Id copied to clipboard.", // Confirmation message
                    });
                })
                .catch((err) => {
                    // Log the error if the text could not be copied
                    console.error("Could not copy text: ", err);
                });
        },
    });
};

// Export the toast functions
export { errorToast, accessCodeToast };
