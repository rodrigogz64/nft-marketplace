import { useState } from 'react';
import { toast } from 'react-toastify';

export function useTransaction() {
  const [isProcessing, setIsProcessing] = useState(false);

  const executeTransaction = async (transactionFn, options = {}) => {
    const { onSuccess, onError } = options;
    setIsProcessing(true);

    try {
      const tx = await transactionFn();
      console.log('Transaction submitted:', tx.hash);
      
      toast.info('Transaction submitted. Waiting for confirmation...', {
        autoClose: false,
        toastId: 'waiting-confirmation'
      });

      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      toast.dismiss('waiting-confirmation');
      onSuccess?.(receipt);
      return receipt;
    } catch (error) {
      console.error('Transaction failed:', error);
      toast.dismiss('waiting-confirmation');
      
      onError?.(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return { executeTransaction, isProcessing };
}