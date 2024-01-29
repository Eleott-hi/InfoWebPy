// Import necessary libraries
import { createContext, useContext, useState } from 'react';

// Create a context for the confirmation dialog
const ConfirmationDialogContext = createContext();

// Create a provider to manage the state of the dialog
export const ConfirmationDialogProvider = ({ children }) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState(null);

    // Function to open the confirmation dialog
    const openDialog = (content) => {
        setDialogContent(content);
        setDialogOpen(true);
    };

    // Function to close the confirmation dialog
    const closeDialog = () => {
        setDialogContent(null);
        setDialogOpen(false);
    };

    // Function to handle confirmation action
    const handleConfirm = () => {
        // Add your custom logic for confirmation here
        console.log('Confirmed');
        closeDialog();
    };

    // Function to handle cancel action
    const handleCancel = () => {
        // Add your custom logic for canceling here
        console.log('Canceled');
        closeDialog();
    };

    return (
        <ConfirmationDialogContext.Provider
            value={{
                openDialog,
                closeDialog,
                handleConfirm,
                handleCancel,
            }}
        >
            {children}
            {isDialogOpen && (
                // Dialog component with a slightly darker background
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {/* Actual dialog card */}
                    <div
                        style={{
                            background: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        {dialogContent}
                        {/* Confirmation and cancel buttons */}
                        <button onClick={handleConfirm}>Confirm</button>
                        <button onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            )}
        </ConfirmationDialogContext.Provider>
    );
};

// Custom hook to use the confirmation dialog context
export const useConfirmationDialog = () => {
    return useContext(ConfirmationDialogContext);
};
