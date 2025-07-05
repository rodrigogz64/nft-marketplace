import { toast } from 'react-toastify';

export const useNotifications = () => {
  const notify = {
    success: (message) => {
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
    error: (error) => {
      let message = 'Something went wrong. Please try again.';
      
      if (error?.code === 'ACTION_REJECTED') {
        message = 'Transaction was cancelled';
      } else if (error?.code === 4001) {
        message = 'Transaction rejected by user';
      } else if (error?.message?.includes('insufficient funds')) {
        message = 'Insufficient funds to complete this transaction';
      } else if (error?.message?.includes('nonce')) {
        message = 'Please try again. Transaction could not be processed';
      }

      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
    info: (message) => {
      toast.info(message, {
        position: "top-right",
        autoClose: 3000,
      });
    },
    warning: (message) => {
      toast.warning(message, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  return notify;
};